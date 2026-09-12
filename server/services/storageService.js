const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

// Directory for persistent uploads
const UPLOAD_DIR = path.resolve(__dirname, '../../public/uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed MIME types and their extensions
const ALLOWED_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
  'application/pdf': ['.pdf'],
};

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB maximum file size

/**
 * Validate file magic numbers/signatures from buffer
 */
function validateMagicBytes(buffer, mimeType) {
  if (!buffer || buffer.length < 12) return false;

  if (mimeType === 'image/png') {
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }

  if (mimeType === 'image/jpeg') {
    // JPEG magic bytes: FF D8 FF
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimeType === 'image/webp') {
    // WEBP: starts with "RIFF" and has "WEBP" at offset 8
    const riff = buffer.toString('ascii', 0, 4);
    const webp = buffer.toString('ascii', 8, 12);
    return riff === 'RIFF' && webp === 'WEBP';
  }

  if (mimeType === 'image/avif') {
    // AVIF: ftypavif or ftypavis at offset 4
    const ftyp = buffer.toString('ascii', 4, 12);
    return ftyp.includes('avif') || ftyp.includes('avis');
  }

  if (mimeType === 'application/pdf') {
    // PDF: %PDF-
    const header = buffer.toString('ascii', 0, 5);
    return header.startsWith('%PDF-');
  }

  return false;
}

/**
 * Extract image dimensions (width/height) from buffer without external native dependencies
 */
function extractImageDimensions(buffer, mimeType) {
  try {
    if (mimeType === 'image/png' && buffer.length >= 24) {
      // PNG width & height are stored at byte offset 16 and 20 as 32-bit big-endian integers
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    }

    if (mimeType === 'image/jpeg' && buffer.length > 2) {
      // Walk JPEG markers to find SOF0 (0xFFC0) or SOF2 (0xFFC2)
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) {
          offset++;
          continue;
        }
        const marker = buffer[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          // SOF marker found: height at offset + 5 (2 bytes), width at offset + 7 (2 bytes)
          if (offset + 9 <= buffer.length) {
            const height = buffer.readUInt16BE(offset + 5);
            const width = buffer.readUInt16BE(offset + 7);
            return { width, height };
          }
        }
        // Move past marker and its length
        if (offset + 3 <= buffer.length) {
          const length = buffer.readUInt16BE(offset + 2);
          offset += 2 + length;
        } else {
          break;
        }
      }
    }

    if (mimeType === 'image/webp' && buffer.length >= 30) {
      const format = buffer.toString('ascii', 12, 16);
      if (format === 'VP8 ') {
        // Simple lossy VP8
        const keyframe = buffer.readUInt8(23);
        if (keyframe === 0x9d && buffer.readUInt8(24) === 0x01 && buffer.readUInt8(25) === 0x2a) {
          const width = buffer.readUInt16LE(26) & 0x3fff;
          const height = buffer.readUInt16LE(28) & 0x3fff;
          return { width, height };
        }
      } else if (format === 'VP8L') {
        // Lossless VP8L: signature 0x2f at offset 20
        if (buffer.readUInt8(20) === 0x2f) {
          const b1 = buffer.readUInt8(21);
          const b2 = buffer.readUInt8(22);
          const b3 = buffer.readUInt8(23);
          const b4 = buffer.readUInt8(24);
          const width = 1 + (((b2 & 0x3f) << 8) | b1);
          const height = 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
          return { width, height };
        }
      } else if (format === 'VP8X') {
        // Extended VP8X
        const width = 1 + (buffer.readUInt8(24) | (buffer.readUInt8(25) << 8) | (buffer.readUInt8(26) << 16));
        const height = 1 + (buffer.readUInt8(27) | (buffer.readUInt8(28) << 8) | (buffer.readUInt8(29) << 16));
        return { width, height };
      }
    }
  } catch (err) {
    // Dimension extraction failure is non-fatal
  }
  return { width: null, height: null };
}

/**
 * Sanitize a filename to prevent path traversal and shell injection
 */
function sanitizeFileName(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);

  const randomHash = crypto.randomBytes(4).toString('hex');
  const timestamp = Date.now();

  return `${base || 'upload'}-${timestamp}-${randomHash}${ext}`;
}

/**
 * Calculate SHA-256 checksum of buffer
 */
function calculateChecksum(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Memory storage multer instance for strict server-side validation
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    if (!ALLOWED_MIME_TYPES[mime] || !ALLOWED_MIME_TYPES[mime].includes(ext)) {
      return cb(
        new Error(
          `Invalid file format: ${ext} (${mime}). Allowed formats: JPG, PNG, WEBP, AVIF, PDF.`
        ),
        false
      );
    }
    cb(null, true);
  },
});

/**
 * Persist validated file buffer to storage
 */
async function saveFile(buffer, originalName, mimeType) {
  // Validate magic bytes
  if (!validateMagicBytes(buffer, mimeType)) {
    throw new Error(`File contents do not match specified MIME type: ${mimeType}`);
  }

  const fileName = sanitizeFileName(originalName);
  const filePath = path.join(UPLOAD_DIR, fileName);

  await fs.promises.writeFile(filePath, buffer);

  const checksum = calculateChecksum(buffer);
  const isImage = mimeType.startsWith('image/');
  const dimensions = isImage ? extractImageDimensions(buffer, mimeType) : { width: null, height: null };

  return {
    fileName,
    originalName,
    storageKey: fileName,
    url: `/uploads/${fileName}`,
    size: buffer.length,
    mimeType,
    fileType: isImage ? 'image' : 'document',
    width: dimensions.width,
    height: dimensions.height,
    checksum,
  };
}

/**
 * Safely delete an uploaded file from disk
 */
async function deleteFile(fileName) {
  try {
    const safeBase = path.basename(fileName);
    const filePath = path.join(UPLOAD_DIR, safeBase);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
  } catch (err) {
    console.warn(`[StorageService] Failed to delete file ${fileName}:`, err.message);
  }
  return false;
}

module.exports = {
  upload,
  saveFile,
  deleteFile,
  validateMagicBytes,
  extractImageDimensions,
  calculateChecksum,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_DIR,
};

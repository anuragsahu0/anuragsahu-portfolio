const Certificate = require('../models/Certificate');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');
const { isSafeUrl, sanitizeHtmlContent } = require('../utils/security');

const FALLBACK_CERTIFICATES = [
  {
    _id: 'cert-1',
    title: 'Python for Data Science & AI',
    issuer: 'Coursera / IBM',
    issueDate: '2025',
    credentialUrl: 'https://coursera.org/verify/credential-placeholder',
    image: '',
    description: 'Data analysis, NumPy, Pandas vectorization, and foundational machine learning techniques.',
    displayOrder: 1,
    isVisible: true,
  },
  {
    _id: 'cert-2',
    title: 'Full-Stack Web Engineering',
    issuer: 'freeCodeCamp / Udemy',
    issueDate: '2025',
    credentialUrl: 'https://freecodecamp.org/certification/placeholder',
    image: '',
    description: 'Modern frontend design patterns, asynchronous JavaScript, Node.js API development, and MongoDB integration.',
    displayOrder: 2,
    isVisible: true,
  },
  {
    _id: 'cert-3',
    title: 'Deep Learning with PyTorch',
    issuer: 'Udacity / DeepLearning.AI',
    issueDate: '2026',
    credentialUrl: '',
    image: '',
    description: 'Neural network layer architecture, tensor mathematics, backpropagation, and loss optimization.',
    displayOrder: 3,
    isVisible: true,
  },
];

const getPublicCertificates = async (req, res, next) => {
  try {
    let certs = [];
    try {
      if (Certificate.db && Certificate.db.readyState === 1) {
        certs = await Certificate.find({ isVisible: true }).sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!certs || certs.length === 0) {
      certs = FALLBACK_CERTIFICATES.filter((c) => c.isVisible);
    }

    return sendSuccess(res, { count: certs.length, certificates: certs });
  } catch (err) {
    next(err);
  }
};

const getAdminCertificates = async (req, res, next) => {
  try {
    let certs = [];
    try {
      if (Certificate.db && Certificate.db.readyState === 1) {
        certs = await Certificate.find().sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!certs || certs.length === 0) {
      certs = FALLBACK_CERTIFICATES;
    }

    return sendSuccess(res, { count: certs.length, certificates: certs });
  } catch (err) {
    next(err);
  }
};

const createCertificate = async (req, res, next) => {
  try {
    const { title, issuer, credentialUrl } = req.body;
    if (!title || !issuer) {
      return sendError(res, 'Certificate title and issuer are required.', 'VALIDATION_ERROR', 422);
    }
    if (credentialUrl && !isSafeUrl(credentialUrl)) {
      return sendError(res, 'Invalid or unsafe credential URL.', 'INVALID_URL', 422);
    }

    let cert = null;
    try {
      if (Certificate.db && Certificate.db.readyState === 1) {
        cert = await Certificate.create(req.body);
      }
    } catch (dbErr) {}

    if (!cert) {
      cert = { _id: `cert-${Date.now()}`, ...req.body, createdAt: new Date() };
      FALLBACK_CERTIFICATES.push(cert);
    }

    try {
      await logActivity('CERTIFICATE_CREATED', 'Certificate', { title: cert.title, issuer: cert.issuer }, req);
    } catch (e) {}

    return sendSuccess(res, cert, 201);
  } catch (err) {
    next(err);
  }
};

const updateCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.credentialUrl && !isSafeUrl(req.body.credentialUrl)) {
      return sendError(res, 'Invalid or unsafe credential URL.', 'INVALID_URL', 422);
    }
    let cert = null;

    try {
      if (Certificate.db && Certificate.db.readyState === 1) {
        cert = await Certificate.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!cert) {
      const idx = FALLBACK_CERTIFICATES.findIndex((c) => c._id === id);
      if (idx !== -1) {
        FALLBACK_CERTIFICATES[idx] = { ...FALLBACK_CERTIFICATES[idx], ...req.body, updatedAt: new Date() };
        cert = FALLBACK_CERTIFICATES[idx];
      }
    }

    if (!cert) {
      return sendError(res, 'Certificate not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('CERTIFICATE_UPDATED', 'Certificate', { id, title: cert.title }, req);
    } catch (e) {}

    return sendSuccess(res, cert);
  } catch (err) {
    next(err);
  }
};

const deleteCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Certificate.db && Certificate.db.readyState === 1) {
        deleted = await Certificate.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = FALLBACK_CERTIFICATES.findIndex((c) => c._id === id);
      if (idx !== -1) {
        deleted = FALLBACK_CERTIFICATES.splice(idx, 1)[0];
      }
    }

    if (!deleted) {
      return sendError(res, 'Certificate not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('CERTIFICATE_DELETED', 'Certificate', { id }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Certificate deleted.', id });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/certificates/reorder
 */
const reorderCertificates = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return sendError(res, 'Invalid items array.', 'VALIDATION_ERROR', 400);
    }

    try {
      if (Certificate.db && Certificate.db.readyState === 1) {
        const bulkOps = items.map((item, idx) => {
          const id = typeof item === 'object' ? (item._id || item.id) : item;
          const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
          const filter = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
          return {
            updateOne: {
              filter,
              update: { $set: { displayOrder: order } },
            },
          };
        });
        await Certificate.bulkWrite(bulkOps);
      }
    } catch (dbErr) {}

    items.forEach((item, idx) => {
      const id = typeof item === 'object' ? (item._id || item.id) : item;
      const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
      const found = FALLBACK_CERTIFICATES.find((c) => c._id === id || c.id === id);
      if (found) found.displayOrder = order;
    });
    FALLBACK_CERTIFICATES.sort((a, b) => a.displayOrder - b.displayOrder);

    try {
      await logActivity('CERTIFICATES_REORDERED', 'Certificate', { count: items.length }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Certificates reordered successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicCertificates,
  getAdminCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates,
};

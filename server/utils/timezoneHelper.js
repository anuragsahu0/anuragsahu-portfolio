/**
 * TIMEZONE HELPER UTILITY
 * Native Intl-based timezone parsing, conversion, and formatting.
 * Zero external dependencies.
 */

const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Check if a timezone string is valid IANA identifier
 */
function isValidTimezone(tz) {
  if (!tz || typeof tz !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Extract timezone abbreviation (e.g. IST, UTC, EDT, GMT)
 */
function getTimezoneAbbreviation(date, tz = DEFAULT_TIMEZONE) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : tz;
  } catch (e) {
    return tz;
  }
}

/**
 * Convert a local date string + time string in a specified timezone to a UTC Date object.
 * Supports:
 * - dateString: 'YYYY-MM-DD', timeString: 'HH:mm'
 * - or single ISO/datetime string: 'YYYY-MM-DDTHH:mm'
 */
function localToUTC(dateInput, timeInput = '00:00', tz = DEFAULT_TIMEZONE) {
  const targetTz = isValidTimezone(tz) ? tz : DEFAULT_TIMEZONE;

  let year, month, day, hours, minutes;

  if (typeof dateInput === 'string' && dateInput.includes('T')) {
    const [dPart, tPart] = dateInput.split('T');
    const [y, m, d] = dPart.split('-').map(Number);
    const [h, min] = tPart.split(':').map(Number);
    year = y;
    month = m;
    day = d;
    hours = h || 0;
    minutes = min || 0;
  } else if (typeof dateInput === 'string') {
    const [y, m, d] = dateInput.split('-').map(Number);
    const [h, min] = (timeInput || '00:00').split(':').map(Number);
    year = y;
    month = m;
    day = d;
    hours = h || 0;
    minutes = min || 0;
  } else if (dateInput instanceof Date) {
    return dateInput;
  } else {
    throw new Error('Invalid date input provided for timezone conversion.');
  }

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new Error('Invalid date components provided.');
  }

  // 1. Initial UTC guess
  let utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));

  // 2. Format utcGuess in target timezone to see what local time it yields
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: targetTz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const getTzComponents = (d) => {
    const parts = formatter.formatToParts(d);
    const map = {};
    parts.forEach((p) => {
      map[p.type] = p.value;
    });
    return {
      year: parseInt(map.year, 10),
      month: parseInt(map.month, 10),
      day: parseInt(map.day, 10),
      hour: parseInt(map.hour, 10),
      minute: parseInt(map.minute, 10),
    };
  };

  let tzParts = getTzComponents(utcGuess);

  // Compute offset between target local components and what utcGuess produced
  const targetUtcMs = Date.UTC(year, month - 1, day, hours, minutes, 0);
  const guessedUtcMs = Date.UTC(
    tzParts.year,
    tzParts.month - 1,
    tzParts.day,
    tzParts.hour,
    tzParts.minute,
    0
  );

  const diffMs = guessedUtcMs - targetUtcMs;
  const exactUtcDate = new Date(utcGuess.getTime() - diffMs);

  return exactUtcDate;
}

/**
 * Format a Date object in a specified timezone.
 * Returns formatted string e.g. "20 Sep 2026, 10:00 AM IST (Asia/Kolkata)"
 */
function formatInTimezone(dateInput, tz = DEFAULT_TIMEZONE, options = {}) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const targetTz = isValidTimezone(tz) ? tz : DEFAULT_TIMEZONE;

  const dateOpts = {
    timeZone: targetTz,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options.date,
  };

  const timeOpts = {
    timeZone: targetTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    ...options.time,
  };

  const dateFormatter = new Intl.DateTimeFormat('en-GB', dateOpts);
  const timeFormatter = new Intl.DateTimeFormat('en-US', timeOpts);

  const datePart = dateFormatter.format(d);
  const timePart = timeFormatter.format(d);
  const tzAbbrev = getTimezoneAbbreviation(d, targetTz);

  return {
    fullString: `${datePart}, ${timePart} ${tzAbbrev} (${targetTz})`,
    datePart,
    timePart,
    tzAbbrev,
    timezone: targetTz,
    isoUtc: d.toISOString(),
  };
}

module.exports = {
  DEFAULT_TIMEZONE,
  isValidTimezone,
  getTimezoneAbbreviation,
  localToUTC,
  formatInTimezone,
};

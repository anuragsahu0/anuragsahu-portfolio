const Settings = require('../models/Settings');

// Global fallback store for zero-latency cross-visitor sync
const globalSettingsMemoryStore = {
  'ag_proj_status_01': 'Completed',
  'ag_proj_status_02': 'Coming Soon',
  'ag_proj_status_03': 'Coming Soon',
};

const getAll = async (req, res, next) => {
  try {
    const settingsMap = { ...globalSettingsMemoryStore };
    try {
      const settings = await Settings.find();
      settings.forEach((s) => { settingsMap[s.key] = s.value; });
    } catch (dbErr) {}

    return res.status(200).json({ success: true, settings: settingsMap });
  } catch (err) {
    return res.status(200).json({ success: true, settings: globalSettingsMemoryStore });
  }
};

const upsert = async (req, res, next) => {
  try {
    const { key, value, description } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, message: 'key and value are required.' });
    }

    // Save in memory store immediately
    globalSettingsMemoryStore[key] = value;

    // Persist to MongoDB if connected
    try {
      await Settings.findOneAndUpdate(
        { key },
        { key, value, description: description || '' },
        { new: true, upsert: true, runValidators: true }
      );
    } catch (dbErr) {}

    return res.status(200).json({ success: true, key, value });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, upsert };

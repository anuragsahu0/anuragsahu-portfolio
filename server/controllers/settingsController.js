const Settings = require('../models/Settings');

const GLOBAL_CLOUD_ID = 'ff8081819f7e10ae019fc83569456a67';
const GLOBAL_CLOUD_URL = `https://api.restful-api.dev/objects/${GLOBAL_CLOUD_ID}`;

// Global memory cache
const globalSettingsCache = {
  'ag_proj_status_01': 'Completed',
  'ag_proj_status_02': 'Coming Soon',
  'ag_proj_status_03': 'Coming Soon',
};

const getAll = async (req, res, next) => {
  try {
    const settingsMap = { ...globalSettingsCache };

    // Fetch from global cloud storage
    try {
      const cloudRes = await fetch(GLOBAL_CLOUD_URL);
      const cloudData = await cloudRes.json();
      if (cloudData && cloudData.data) {
        Object.assign(settingsMap, cloudData.data);
        Object.assign(globalSettingsCache, cloudData.data);
      }
    } catch (cErr) {}

    // Fallback to MongoDB
    try {
      const dbSettings = await Settings.find();
      dbSettings.forEach((s) => { settingsMap[s.key] = s.value; });
    } catch (dbErr) {}

    return res.status(200).json({ success: true, settings: settingsMap });
  } catch (err) {
    return res.status(200).json({ success: true, settings: globalSettingsCache });
  }
};

const upsert = async (req, res, next) => {
  try {
    const { key, value, description } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, message: 'key and value are required.' });
    }

    // 1. Update memory cache
    globalSettingsCache[key] = value;

    // 2. Persist to global cloud storage
    try {
      await fetch(GLOBAL_CLOUD_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Anurag Portfolio Global Settings',
          data: globalSettingsCache
        })
      });
    } catch (cErr) {}

    // 3. Persist to MongoDB
    try {
      await Settings.findOneAndUpdate(
        { key },
        { key, value, description: description || '' },
        { new: true, upsert: true, runValidators: true }
      );
    } catch (dbErr) {}

    return res.status(200).json({ success: true, key, value, settings: globalSettingsCache });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, upsert };

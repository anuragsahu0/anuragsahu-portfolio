const Settings = require('../models/Settings');

const getAll = async (req, res, next) => {
  try {
    const settings = await Settings.find();
    // Convert to key/value object for easy frontend consumption
    const settingsMap = {};
    settings.forEach((s) => { settingsMap[s.key] = s.value; });
    return res.status(200).json({ success: true, settings: settingsMap });
  } catch (err) { next(err); }
};

const upsert = async (req, res, next) => {
  try {
    const { key, value, description } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ success: false, message: 'key and value are required.' });
    }
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value, description: description || '' },
      { new: true, upsert: true, runValidators: true }
    );
    return res.status(200).json({ success: true, setting });
  } catch (err) { next(err); }
};

module.exports = { getAll, upsert };

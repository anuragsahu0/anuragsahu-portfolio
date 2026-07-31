const SocialLink = require('../models/SocialLink');

const getAll = async (req, res, next) => {
  try {
    const links = await SocialLink.find({ isActive: true }).sort({ order: 1 });
    return res.status(200).json({ success: true, count: links.length, socialLinks: links });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const link = await SocialLink.create(req.body);
    return res.status(201).json({ success: true, socialLink: link });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const link = await SocialLink.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!link) return res.status(404).json({ success: false, message: 'Social link not found.' });
    return res.status(200).json({ success: true, socialLink: link });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const link = await SocialLink.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ success: false, message: 'Social link not found.' });
    return res.status(200).json({ success: true, message: 'Social link deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, remove };

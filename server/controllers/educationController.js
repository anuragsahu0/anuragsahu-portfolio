const Education = require('../models/Education');

const FALLBACK_EDUCATION = [
  {
    id: 'btech-cse-aiml',
    type: 'degree',
    institution: 'Maharana Pratap Institute of Professional Studies',
    degree: 'B.Tech in Computer Science & Engineering (AI & ML)',
    duration: '2024 — 2028 (Expected)',
    currentStatus: 'Second Year Student (CGPA: 9.2 / 10.0)',
    location: 'India',
    relevantCoursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (C++)',
      'Database Management Systems',
      'Operating Systems & System Logic',
      'Linear Algebra & Applied ML',
    ],
    highlights: [
      'Ranked top 5% in academic coursework',
      'Lead Student Coordinator for Tech & AI Student Chapter',
      'Organized college-level hackathons and coding contests',
    ],
  },
  {
    id: 'senior-secondary',
    type: 'degree',
    institution: 'Higher Secondary Education (CBSE / State Board)',
    degree: 'Senior Secondary Schooling (Class XII - PCM)',
    duration: '2022 — 2024',
    currentStatus: 'Completed with Distinction',
    location: 'India',
    relevantCoursework: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science (Python)'],
    highlights: [
      'Scored 90%+ in Mathematics & Computer Science',
      'Built first Python automation scripts in high school',
    ],
  },
];

const getAll = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    const records = await Education.find(filter).sort({ order: 1 });
    return res.status(200).json({ success: true, count: records.length, education: records, source: 'database' });
  } catch (err) {
    console.warn('[Education] DB unavailable, serving fallback data');
    let fallback = FALLBACK_EDUCATION;
    if (req.query.type) fallback = FALLBACK_EDUCATION.filter((e) => e.type === req.query.type);
    return res.status(200).json({ success: true, count: fallback.length, education: fallback, source: 'fallback' });
  }
};

const create = async (req, res, next) => {
  try {
    const record = await Education.create(req.body);
    return res.status(201).json({ success: true, education: record });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const record = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Education record not found.' });
    return res.status(200).json({ success: true, education: record });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const record = await Education.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Education record not found.' });
    return res.status(200).json({ success: true, message: 'Education record deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, update, remove };

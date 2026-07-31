const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { verifyToken } = require('../middleware/auth');

// Public
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);

// Admin (protected)
router.post('/admin/projects', verifyToken, createProject);
router.put('/admin/projects/:id', verifyToken, updateProject);
router.delete('/admin/projects/:id', verifyToken, deleteProject);

module.exports = router;

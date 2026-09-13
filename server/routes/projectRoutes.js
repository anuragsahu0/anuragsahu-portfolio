const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { verifyToken, requirePermission } = require('../middleware/auth');

// Public
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);

// Admin (protected)
router.post('/admin/projects', verifyToken, requirePermission('projects.create'), createProject);
router.put('/admin/projects/:id', verifyToken, requirePermission('projects.edit'), updateProject);
router.delete('/admin/projects/:id', verifyToken, requirePermission('projects.delete'), deleteProject);

module.exports = router;

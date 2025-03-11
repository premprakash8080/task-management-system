const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  getProjects,
  addMember,
  removeMember,
  updateProjectSettings,
} = require('../controllers/project.controller');

// Apply auth middleware to all routes
router.use(auth);

// Project CRUD operations
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:projectId', getProjectById);
router.patch('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);

// Project members management
router.post('/:projectId/members', addMember);
router.delete('/:projectId/members', removeMember);

// Project settings
router.patch('/:projectId/settings', updateProjectSettings);

module.exports = router; 
import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  getProjects,
  addMember,
  removeMember,
  updateProjectSettings,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  getProjectTasks,
} from '../controllers/project.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

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

// Project tasks
router.get('/:projectId/tasks', getProjectTasks);

// Section management
router.post('/:projectId/sections', createSection);
router.patch('/:projectId/sections/:sectionId', updateSection);
router.delete('/:projectId/sections/:sectionId', deleteSection);
router.post('/:projectId/sections/reorder', reorderSections);

export { router }; 
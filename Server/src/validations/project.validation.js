import Joi from 'joi';
import { objectId } from './custom.validation.js';

const createProject = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    color: Joi.string(),
    icon: Joi.string(),
    tags: Joi.array().items(Joi.string()),
    settings: Joi.object().keys({
      defaultView: Joi.string().valid('list', 'board', 'calendar', 'files'),
      taskStatuses: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          color: Joi.string().required(),
          order: Joi.number().required(),
        })
      ),
    }),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    color: Joi.string(),
    icon: Joi.string(),
    status: Joi.string().valid('active', 'archived', 'completed'),
    tags: Joi.array().items(Joi.string()),
  })
    .min(1),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

const getProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
};

const getProjects = {
  query: Joi.object().keys({
    status: Joi.string().valid('active', 'archived', 'completed'),
    search: Joi.string(),
    sort: Joi.string(),
    includeStats: Joi.boolean(),
  }),
};

const addMember = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    role: Joi.string().valid('admin', 'member'),
  }),
};

const removeMember = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const updateProjectSettings = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    settings: Joi.object().keys({
      defaultView: Joi.string().valid('list', 'board', 'calendar', 'files'),
      taskStatuses: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          color: Joi.string().required(),
          order: Joi.number().required(),
        })
      ),
    }).required(),
  }),
};

export {
  createProject,
  updateProject,
  deleteProject,
  getProject,
  getProjects,
  addMember,
  removeMember,
  updateProjectSettings,
}; 
const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTask = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    status: Joi.string().valid('todo', 'in_progress', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date(),
    projectId: Joi.string().custom(objectId),
    assigneeId: Joi.string().custom(objectId),
    tags: Joi.array().items(Joi.string()),
    attachments: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        url: Joi.string().required(),
        type: Joi.string().required(),
      })
    ),
  }),
};

const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    status: Joi.string().valid('todo', 'in_progress', 'completed'),
    priority: Joi.string().valid('low', 'medium', 'high'),
    dueDate: Joi.date(),
    projectId: Joi.string().custom(objectId),
    assigneeId: Joi.string().custom(objectId),
    tags: Joi.array().items(Joi.string()),
    attachments: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        url: Joi.string().required(),
        type: Joi.string().required(),
      })
    ),
    isArchived: Joi.boolean(),
  })
    .min(1),
};

const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),
};

const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),
};

const getTasks = {
  query: Joi.object().keys({
    status: Joi.alternatives().try(
      Joi.string().valid('todo', 'in_progress', 'completed'),
      Joi.array().items(Joi.string().valid('todo', 'in_progress', 'completed'))
    ),
    priority: Joi.alternatives().try(
      Joi.string().valid('low', 'medium', 'high'),
      Joi.array().items(Joi.string().valid('low', 'medium', 'high'))
    ),
    projectId: Joi.string().custom(objectId),
    assigneeId: Joi.string().custom(objectId),
    dueDate: Joi.date(),
    isArchived: Joi.boolean(),
    search: Joi.string(),
    sort: Joi.string(),
  }),
};

const addComment = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    content: Joi.string().required(),
  }),
};

const batchUpdateTasks = {
  body: Joi.object().keys({
    updates: Joi.array().items(
      Joi.object().keys({
        id: Joi.string().custom(objectId).required(),
        changes: Joi.object().required().min(1),
      })
    ).required().min(1),
  }),
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getTasks,
  addComment,
  batchUpdateTasks,
}; 
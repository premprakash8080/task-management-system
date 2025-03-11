const Task = require('../models/task.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createTask = asyncHandler(async (req, res) => {
  const taskData = req.body;
  
  const task = await Task.create({
    ...taskData,
    assigneeId: taskData.assigneeId || req.user._id,
  });

  const populatedTask = await task.populate([
    { path: 'projectId', select: 'title color icon' },
    { path: 'assigneeId', select: 'name email avatar' },
  ]);

  return res.status(201).json(
    new ApiResponse(201, populatedTask, 'Task created successfully')
  );
});

const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const updates = req.body;

  const task = await Task.findByIdAndUpdate(
    taskId,
    { ...updates, updatedAt: Date.now() },
    { new: true, runValidators: true }
  ).populate([
    { path: 'projectId', select: 'title color icon' },
    { path: 'assigneeId', select: 'name email avatar' },
  ]);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return res.json(
    new ApiResponse(200, task, 'Task updated successfully')
  );
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return res.json(
    new ApiResponse(200, {}, 'Task deleted successfully')
  );
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId).populate([
    { path: 'projectId', select: 'title color icon' },
    { path: 'assigneeId', select: 'name email avatar' },
    { path: 'comments.userId', select: 'name avatar' },
  ]);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return res.json(
    new ApiResponse(200, task, 'Task fetched successfully')
  );
});

const getTasks = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    projectId,
    assigneeId = req.user._id,
    dueDate,
    isArchived,
    search,
    sort = '-updatedAt',
  } = req.query;

  const query = {};

  // Build filter query
  if (status) {
    query.status = { $in: Array.isArray(status) ? status : [status] };
  }
  if (priority) {
    query.priority = { $in: Array.isArray(priority) ? priority : [priority] };
  }
  if (projectId) {
    query.projectId = projectId;
  }
  if (assigneeId) {
    query.assigneeId = assigneeId;
  }
  if (dueDate) {
    const date = new Date(dueDate);
    query.dueDate = {
      $gte: new Date(date.setHours(0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59)),
    };
  }
  if (typeof isArchived === 'boolean') {
    query.isArchived = isArchived;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const tasks = await Task.find(query)
    .sort(sort)
    .populate([
      { path: 'projectId', select: 'title color icon' },
      { path: 'assigneeId', select: 'name email avatar' },
    ]);

  return res.json(
    new ApiResponse(200, tasks, 'Tasks fetched successfully')
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;

  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $push: {
        comments: {
          content,
          userId: req.user._id,
        },
      },
    },
    { new: true }
  ).populate([
    { path: 'comments.userId', select: 'name avatar' },
  ]);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return res.json(
    new ApiResponse(200, task, 'Comment added successfully')
  );
});

const batchUpdateTasks = asyncHandler(async (req, res) => {
  const { updates } = req.body;

  const updatePromises = updates.map(({ id, changes }) =>
    Task.findByIdAndUpdate(
      id,
      { ...changes, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate([
      { path: 'projectId', select: 'title color icon' },
      { path: 'assigneeId', select: 'name email avatar' },
    ])
  );

  const updatedTasks = await Promise.all(updatePromises);

  return res.json(
    new ApiResponse(200, updatedTasks, 'Tasks updated successfully')
  );
});

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getTasks,
  addComment,
  batchUpdateTasks,
}; 
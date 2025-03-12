import { Task } from '../models/task.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createTask = asyncHandler(async (req, res) => {
  const taskData = req.body;
  
  // Get the highest order in the section
  const highestOrderTask = await Task.findOne({
    projectId: taskData.projectId,
    sectionId: taskData.sectionId || null
  }).sort('-order');

  // Set the order to be one more than the highest, or 0 if no tasks exist
  const order = highestOrderTask ? highestOrderTask.order + 1 : 0;

  // Create the task with the calculated order and current user as assignee if not specified
  const task = await Task.create({
    ...taskData,
    order,
    sectionId: taskData.sectionId || null, // Ensure null for unassigned tasks
    assigneeId: taskData.assigneeId || req.user._id,
  });

  // Populate the task with project and assignee details
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
    dueDate,
    isArchived = false,
    search,
    sort = '-updatedAt'
  } = req.query;

  // Build query for tasks assigned to the logged-in user
  const query = {
    assigneeId: req.user._id,
    isArchived: isArchived === 'true'
  };

  // Add filters if provided
  if (status) {
    query.status = Array.isArray(status) ? { $in: status } : status;
  }

  if (priority) {
    query.priority = Array.isArray(priority) ? { $in: priority } : priority;
  }

  if (projectId) {
    query.projectId = projectId;
  }

  if (dueDate) {
    // Convert date string to Date object and get start/end of the day
    const startDate = new Date(dueDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(dueDate);
    endDate.setHours(23, 59, 59, 999);

    query.dueDate = {
      $gte: startDate,
      $lte: endDate
    };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // Get tasks with populated fields
  const tasks = await Task.find(query)
    .sort(sort)
    .populate('projectId', 'title color icon')
    .populate('assigneeId', 'name email avatar')
    .populate({
      path: 'comments.userId',
      select: 'name email avatar'
    });

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

export {
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  getTasks,
  addComment,
  batchUpdateTasks,
}; 
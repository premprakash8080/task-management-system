const Project = require('../models/project.model');
const Task = require('../models/task.model');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createProject = asyncHandler(async (req, res) => {
  const projectData = req.body;
  
  const project = await Project.create({
    ...projectData,
    ownerId: req.user._id,
    members: [{ userId: req.user._id, role: 'owner' }],
  });

  return res.status(201).json(
    new ApiResponse(201, project, 'Project created successfully')
  );
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const updates = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    updates,
    { new: true, runValidators: true }
  );

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  return res.json(
    new ApiResponse(200, project, 'Project updated successfully')
  );
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Delete all tasks associated with this project
  await Task.deleteMany({ projectId });

  return res.json(
    new ApiResponse(200, {}, 'Project and associated tasks deleted successfully')
  );
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId)
    .populate('members.userId', 'name email avatar');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Get project statistics
  const taskStats = await Task.aggregate([
    { $match: { projectId: project._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const stats = {
    total: 0,
    todo: 0,
    in_progress: 0,
    completed: 0,
  };

  taskStats.forEach(({ _id, count }) => {
    stats[_id] = count;
    stats.total += count;
  });

  return res.json(
    new ApiResponse(200, { ...project.toObject(), stats }, 'Project fetched successfully')
  );
});

const getProjects = asyncHandler(async (req, res) => {
  const {
    status,
    search,
    sort = '-updatedAt',
    includeStats = false,
  } = req.query;

  const query = {
    'members.userId': req.user._id,
  };

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  let projects = await Project.find(query)
    .sort(sort)
    .populate('members.userId', 'name email avatar');

  if (includeStats) {
    // Get task statistics for all projects
    const projectIds = projects.map(p => p._id);
    const taskStats = await Task.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      {
        $group: {
          _id: { projectId: '$projectId', status: '$status' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Create a map of project stats
    const projectStats = {};
    taskStats.forEach(({ _id, count }) => {
      const { projectId, status } = _id;
      if (!projectStats[projectId]) {
        projectStats[projectId] = {
          total: 0,
          todo: 0,
          in_progress: 0,
          completed: 0,
        };
      }
      projectStats[projectId][status] = count;
      projectStats[projectId].total += count;
    });

    // Add stats to each project
    projects = projects.map(project => ({
      ...project.toObject(),
      stats: projectStats[project._id] || {
        total: 0,
        todo: 0,
        in_progress: 0,
        completed: 0,
      },
    }));
  }

  return res.json(
    new ApiResponse(200, projects, 'Projects fetched successfully')
  );
});

const addMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { userId, role = 'member' } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      $addToSet: {
        members: { userId, role }
      }
    },
    { new: true }
  ).populate('members.userId', 'name email avatar');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  return res.json(
    new ApiResponse(200, project, 'Member added successfully')
  );
});

const removeMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { userId } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      $pull: {
        members: { userId }
      }
    },
    { new: true }
  ).populate('members.userId', 'name email avatar');

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  return res.json(
    new ApiResponse(200, project, 'Member removed successfully')
  );
});

const updateProjectSettings = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { settings } = req.body;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { settings },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  return res.json(
    new ApiResponse(200, project, 'Project settings updated successfully')
  );
});

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  getProjects,
  addMember,
  removeMember,
  updateProjectSettings,
}; 
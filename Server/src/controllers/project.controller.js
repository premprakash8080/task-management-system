import { Project } from '../models/project.model.js';
import { Task } from '../models/task.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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

const createSection = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Get the highest order number and add 1
  const maxOrder = project.sections.reduce((max, section) => 
    Math.max(max, section.order), -1);

  const newSection = {
    title,
    order: maxOrder + 1,
  };

  project.sections.push(newSection);
  await project.save();

  return res.status(201).json(
    new ApiResponse(201, project, 'Section created successfully')
  );
});

const updateSection = asyncHandler(async (req, res) => {
  const { projectId, sectionId } = req.params;
  const { title } = req.body;

  const project = await Project.findOneAndUpdate(
    { 
      _id: projectId,
      'sections._id': sectionId 
    },
    { 
      $set: { 
        'sections.$.title': title,
        'sections.$.updatedAt': new Date()
      } 
    },
    { new: true }
  );

  if (!project) {
    throw new ApiError(404, 'Project or section not found');
  }

  return res.json(
    new ApiResponse(200, project, 'Section updated successfully')
  );
});

const deleteSection = asyncHandler(async (req, res) => {
  const { projectId, sectionId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Remove the section
  project.sections = project.sections.filter(
    section => section._id.toString() !== sectionId
  );

  // Reorder remaining sections
  project.sections.forEach((section, index) => {
    section.order = index;
  });

  await project.save();

  // Archive tasks in the deleted section
  await Task.updateMany(
    { projectId, sectionId },
    { isArchived: true }
  );

  return res.json(
    new ApiResponse(200, project, 'Section deleted successfully')
  );
});

const reorderSections = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { sectionIds } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  // Create a map of section IDs to their new order
  const orderMap = sectionIds.reduce((map, id, index) => {
    map[id] = index;
    return map;
  }, {});

  // Update the order of each section
  project.sections.forEach(section => {
    const newOrder = orderMap[section._id.toString()];
    if (typeof newOrder === 'number') {
      section.order = newOrder;
    }
  });

  // Sort sections by their new order
  project.sections.sort((a, b) => a.order - b.order);

  await project.save();

  return res.json(
    new ApiResponse(200, project, 'Sections reordered successfully')
  );
});

const getProjectTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status, priority, search, sort = 'order', isArchived = false } = req.query;

  // Verify project exists and user has access
  const project = await Project.findOne({
    _id: projectId,
    'members.userId': req.user._id
  });

  if (!project) {
    throw new ApiError(404, 'Project not found or access denied');
  }

  // Build query
  const query = {
    projectId,
    isArchived
  };

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
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
    .populate('assigneeId', 'name email avatar')
    .populate({
      path: 'comments.userId',
      select: 'name email avatar'
    });

  return res.json(
    new ApiResponse(200, tasks, 'Project tasks fetched successfully')
  );
});

export {
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
}; 
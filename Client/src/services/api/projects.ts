import axios from 'axios';
import { Project, ProjectSection } from '../../types/project';
import { Task } from '../../types/task';
import { api } from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Helper to normalize project data from API
const normalizeProject = (project: any): Project => ({
  id: project._id || project.id,
  title: project.title,
  description: project.description,
  status: project.status || 'active',
  color: project.color,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
  ownerId: project.ownerId,
  members: project.members,
  sections: (project.sections || []).map((section: any) => ({
    id: section._id || section.id,
    title: section.title,
    order: section.order,
    isArchived: section.isArchived,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  })),
});

// Helper to normalize task data from API
const normalizeTask = (task: any): Task => ({
  _id: task._id || task.id,
  title: task.title,
  description: task.description || '',
  status: task.status?.toLowerCase() || 'todo',
  priority: task.priority?.toLowerCase() || 'medium',
  dueDate: task.dueDate,
  projectId: task.projectId,
  projectName: task.projectName,
  sectionId: task.sectionId,
  assigneeId: task.assigneeId,
  parentTaskId: task.parentTaskId || null,
  subtasks: task.subtasks || [],
  attachments: task.attachments || [],
  comments: task.comments || [],
  isArchived: task.isArchived || false,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

const projectsApi = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await api.get('/projects');
      const projectsData = response.data.data || [];
      return projectsData.map(normalizeProject);
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  },

  // Get project by ID
  getProject: async (projectId: string): Promise<Project> => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return normalizeProject(response.data.data);
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  },

  // Get project tasks
  getProjectTasks: async (projectId: string, params?: {
    status?: string
    priority?: string
    search?: string
    sort?: string
    isArchived?: boolean
  }): Promise<Task[]> => {
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/projects/${projectId}/tasks`, { params })
      ]);
      
      const project = projectResponse.data.data;
      const tasks = tasksResponse.data.data;

      return tasks.map((task: any) => normalizeTask({
        ...task,
        projectName: project.title
      }));
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      return []; // Return empty array on error instead of throwing
    }
  },

  // Create new project
  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    try {
      const response = await api.post('/projects', projectData);
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  },

  // Update project
  updateProject: async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
    try {
      const response = await api.patch(`/projects/${projectId}`, projectData);
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<void> => {
    try {
      await api.delete(`/projects/${projectId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  },

  // Add member to project
  addMember: async (projectId: string, userId: string, role: string): Promise<Project> => {
    try {
      const response = await api.post(`/projects/${projectId}/members`, { userId, role });
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add member');
    }
  },

  // Remove member from project
  removeMember: async (projectId: string, userId: string): Promise<Project> => {
    try {
      const response = await api.delete(`/projects/${projectId}/members`, { data: { userId } });
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove member');
    }
  },

  // Section Management
  createSection: async (projectId: string, title: string): Promise<Project> => {
    try {
      const response = await api.post(`/projects/${projectId}/sections`, { title });
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create section');
    }
  },

  updateSection: async (projectId: string, sectionId: string, title: string): Promise<Project> => {
    try {
      const response = await api.patch(`/projects/${projectId}/sections/${sectionId}`, { title });
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update section');
    }
  },

  deleteSection: async (projectId: string, sectionId: string): Promise<Project> => {
    try {
      const response = await api.delete(`/projects/${projectId}/sections/${sectionId}`);
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete section');
    }
  },

  reorderSections: async (projectId: string, sectionIds: string[]): Promise<Project> => {
    try {
      const response = await api.post(`/projects/${projectId}/sections/reorder`, { sectionIds });
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reorder sections');
    }
  },
};

export default projectsApi; 
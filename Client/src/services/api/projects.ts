import axios from 'axios';
import { Project, ProjectSection } from '../../types/project';
import { Task } from '../../types/task';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Helper to normalize project data from API
const normalizeProject = (project: any): Project => ({
  id: project._id || project.id,
  title: project.name || project.title,
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
  id: task._id || task.id,
  title: task.title,
  description: task.description || '',
  status: task.status?.toLowerCase() || 'todo',
  priority: task.priority?.toLowerCase() || 'medium',
  dueDate: task.dueDate,
  projectId: task.projectId,
  assigneeId: task.assignedTo || task.assigneeId,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
  progress: task.progress || 0,
  likesCount: task.likesCount || 0,
  attachments: task.attachments || [],
  comments: task.comments || [],
  tags: task.tags || [],
});

const projectsApi = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      console.log('API Response:', response.data);
      
      // Handle both array response and { data: Project[] } response
      const projectsData = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Normalize each project
      return projectsData.map(normalizeProject);
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  },

  // Get project tasks
  getProjectTasks: async (projectId: string): Promise<Task[]> => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}/tasks`);
      console.log('API Response for project tasks:', projectId, response.data);
      
      // Handle both array response and { data: Task[] } response
      const tasksData = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      // Normalize each task
      return tasksData.map(normalizeTask);
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      return []; // Return empty array on error instead of throwing
    }
  },

  // Get project by ID
  getProjectById: async (projectId: string): Promise<Project> => {
    try {
      const response = await axios.get(`${API_URL}/projects/${projectId}`);
      console.log('API Response for project:', projectId, response.data);
      
      // Handle both direct response and { data: Project } response
      const projectData = response.data.data || response.data;
      return normalizeProject(projectData);
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  },

  // Create new project
  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    try {
      const response = await axios.post(`${API_URL}/projects`, projectData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  },

  // Update project
  updateProject: async (projectId: string, projectData: Partial<Project>): Promise<Project> => {
    try {
      const response = await axios.patch(`${API_URL}/projects/${projectId}`, projectData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  },

  // Delete project
  deleteProject: async (projectId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/projects/${projectId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  },

  // Add member to project
  addMember: async (projectId: string, userId: string, role: string): Promise<Project> => {
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/members`, { userId, role });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add member');
    }
  },

  // Remove member from project
  removeMember: async (projectId: string, userId: string): Promise<Project> => {
    try {
      const response = await axios.delete(`${API_URL}/projects/${projectId}/members`, { data: { userId } });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove member');
    }
  },

  // Section Management
  createSection: async (projectId: string, title: string): Promise<Project> => {
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/sections`, { title });
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create section');
    }
  },

  updateSection: async (projectId: string, sectionId: string, title: string): Promise<Project> => {
    try {
      const response = await axios.patch(`${API_URL}/projects/${projectId}/sections/${sectionId}`, { title });
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update section');
    }
  },

  deleteSection: async (projectId: string, sectionId: string): Promise<Project> => {
    try {
      const response = await axios.delete(`${API_URL}/projects/${projectId}/sections/${sectionId}`);
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete section');
    }
  },

  reorderSections: async (projectId: string, sectionIds: string[]): Promise<Project> => {
    try {
      const response = await axios.post(`${API_URL}/projects/${projectId}/sections/reorder`, { sectionIds });
      return normalizeProject(response.data.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reorder sections');
    }
  },
};

export default projectsApi; 
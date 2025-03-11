import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Task API
export const taskApi = {
  // Get all tasks with optional filters
  getTasks: (filters = {}) => api.get('/tasks', { params: filters }),
  
  // Get single task by ID
  getTask: (taskId) => api.get(`/tasks/${taskId}`),
  
  // Create new task
  createTask: (taskData) => api.post('/tasks', taskData),
  
  // Update task
  updateTask: (taskId, updates) => api.patch(`/tasks/${taskId}`, updates),
  
  // Delete task
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
  
  // Add comment to task
  addComment: (taskId, content) => api.post(`/tasks/${taskId}/comments`, { content }),
  
  // Batch update tasks
  batchUpdateTasks: (updates) => api.post('/tasks/batch-update', { updates }),
};

// Project API
export const projectApi = {
  // Get all projects
  getProjects: (filters = {}) => api.get('/projects', { params: filters }),
  
  // Get single project by ID
  getProject: (projectId) => api.get(`/projects/${projectId}`),
  
  // Create new project
  createProject: (projectData) => api.post('/projects', projectData),
  
  // Update project
  updateProject: (projectId, updates) => api.patch(`/projects/${projectId}`, updates),
  
  // Delete project
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),
  
  // Add member to project
  addMember: (projectId, userId, role) => 
    api.post(`/projects/${projectId}/members`, { userId, role }),
  
  // Remove member from project
  removeMember: (projectId, userId) => 
    api.delete(`/projects/${projectId}/members`, { data: { userId } }),
  
  // Update project settings
  updateSettings: (projectId, settings) => 
    api.patch(`/projects/${projectId}/settings`, { settings }),
};

// Auth API
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (updates) => api.patch('/auth/profile', updates),
}; 
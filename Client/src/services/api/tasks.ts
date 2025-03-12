import { api } from './api'
import { Task, CreateTaskDto } from '../../types/task'

export const tasksApi = {
  getTasks: async (params?: {
    status?: string
    priority?: string
    search?: string
    sort?: string
    isArchived?: boolean
  }): Promise<Task[]> => {
    const response = await api.get('/tasks', { params })
    return response.data.data
  },

  getTaskById: async (taskId: string): Promise<Task> => {
    const response = await api.get(`/tasks/${taskId}`)
    return response.data.data
  },

  createTask: async (task: CreateTaskDto): Promise<Task> => {
    try {
      const response = await api.post('/tasks', task)
      return response.data.data
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error);
      throw error;
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const response = await api.patch(`/tasks/${taskId}`, updates)
    return response.data.data
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`)
  },

  addComment: async (taskId: string, content: string): Promise<Task> => {
    const response = await api.post(`/tasks/${taskId}/comments`, { content })
    return response.data.data
  },

  addAttachment: async (taskId: string, file: File): Promise<Task> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  removeAttachment: async (taskId: string, attachmentId: string): Promise<Task> => {
    const response = await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`)
    return response.data.data
  },

  updateSubtask: async (taskId: string, subtaskId: string, updates: { title?: string; isCompleted?: boolean }): Promise<Task> => {
    const response = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, updates)
    return response.data.data
  },

  reorderSubtasks: async (taskId: string, subtaskIds: string[]): Promise<Task> => {
    const response = await api.post(`/tasks/${taskId}/subtasks/reorder`, { subtaskIds })
    return response.data.data
  }
}

export default tasksApi 
import { api } from './api'
import { Project, ProjectSection } from '../../types/project'
import { Task } from '../../types/task'

export const projectApi = {
  getProject: async (projectId: string): Promise<Project> => {
    const response = await api.get(`/projects/${projectId}`)
    return response.data.data
  },

  updateProject: async (projectId: string, updates: Partial<Project>): Promise<Project> => {
    const response = await api.patch(`/projects/${projectId}`, updates)
    return response.data.data
  },

  createSection: async (projectId: string, title: string): Promise<Project> => {
    const response = await api.post(`/projects/${projectId}/sections`, { title })
    return response.data.data
  },

  updateSection: async (projectId: string, sectionId: string, title: string): Promise<Project> => {
    const response = await api.patch(`/projects/${projectId}/sections/${sectionId}`, { title })
    return response.data.data
  },

  deleteSection: async (projectId: string, sectionId: string): Promise<Project> => {
    const response = await api.delete(`/projects/${projectId}/sections/${sectionId}`)
    return response.data.data
  },

  reorderSections: async (projectId: string, sectionIds: string[]): Promise<Project> => {
    const response = await api.post(`/projects/${projectId}/sections/reorder`, { sectionIds })
    return response.data.data
  },

  getProjectTasks: async (projectId: string, params?: {
    status?: string
    priority?: string
    search?: string
    sort?: string
    isArchived?: boolean
  }): Promise<Task[]> => {
    const [projectResponse, tasksResponse] = await Promise.all([
      api.get(`/projects/${projectId}`),
      api.get(`/projects/${projectId}/tasks`, { params })
    ])
    
    const project = projectResponse.data.data
    const tasks = tasksResponse.data.data

    return tasks.map((task: Task) => ({
      ...task,
      projectName: project.title
    }))
  }
} 
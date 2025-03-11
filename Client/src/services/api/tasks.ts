import { Task, TaskFilters, TaskSortOptions } from '../../types/task'
import { mockTasksApi } from '../mockApi'

const isDevelopment = import.meta.env.MODE === 'development'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const TasksAPI = isDevelopment ? mockTasksApi : {
  // Fetch tasks with filtering and sorting
  fetchTasks: async (filters?: TaskFilters, sort?: TaskSortOptions): Promise<Task[]> => {
    try {
      const queryParams = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, JSON.stringify(value))
        })
      }
      if (sort) {
        queryParams.append('sort', JSON.stringify(sort))
      }
      
      const response = await fetch(`${API_BASE_URL}/tasks?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      return response.json()
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw error
    }
  },

  // Fetch a single task by ID
  fetchTaskById: async (taskId: string): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`)
      if (!response.ok) throw new Error('Failed to fetch task')
      return response.json()
    } catch (error) {
      console.error('Error fetching task:', error)
      throw error
    }
  },

  // Create a new task
  createTask: async (task: Partial<Task>): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })
      if (!response.ok) throw new Error('Failed to create task')
      return response.json()
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  },

  // Update an existing task
  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update task')
      return response.json()
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete task')
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  },

  // Batch update tasks
  batchUpdateTasks: async (updates: { id: string; changes: Partial<Task> }[]): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/batch`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to batch update tasks')
      return response.json()
    } catch (error) {
      console.error('Error batch updating tasks:', error)
      throw error
    }
  },
} 
import { Task, TaskStatus } from '../types/task'
import { v4 as uuidv4 } from 'uuid'

// Initial mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Write and submit the project proposal for review',
    status: 'todo' as TaskStatus,
    priority: 'high',
    dueDate: '2024-03-20',
    projectId: 'project1',
    tags: ['work', 'important'],
    attachments: [],
    comments: [],
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'Review code changes',
    description: 'Review pull requests and provide feedback',
    status: 'in_progress' as TaskStatus,
    priority: 'medium',
    dueDate: '2024-03-15',
    projectId: 'project1',
    tags: ['work', 'review'],
    attachments: [],
    comments: [],
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z'
  }
]

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockTasksApi = {
  fetchTasks: async () => {
    await delay(500) // Simulate network delay
    return [...mockTasks]
  },

  fetchTaskById: async (taskId: string) => {
    await delay(300)
    const task = mockTasks.find(t => t.id === taskId)
    if (!task) throw new Error('Task not found')
    return { ...task }
  },

  createTask: async (task: Partial<Task>) => {
    await delay(500)
    const newTask: Task = {
      id: uuidv4(),
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      tags: task.tags || [],
      attachments: task.attachments || [],
      comments: task.comments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...task
    }
    mockTasks.push(newTask)
    return newTask
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    await delay(300)
    const taskIndex = mockTasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    
    const updatedTask = {
      ...mockTasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    mockTasks[taskIndex] = updatedTask
    return updatedTask
  },

  deleteTask: async (taskId: string) => {
    await delay(300)
    const taskIndex = mockTasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) throw new Error('Task not found')
    mockTasks.splice(taskIndex, 1)
  }
} 
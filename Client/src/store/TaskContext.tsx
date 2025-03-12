import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import { Task, TaskFilters, TaskSortOptions, CreateTaskDto } from '../types/task'
import tasksApi from '../services/api/tasks'

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  filters: TaskFilters
  sort: TaskSortOptions
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: TaskFilters }
  | { type: 'SET_SORT'; payload: TaskSortOptions }

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {},
  sort: '-updatedAt'
}

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        )
      }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload)
      }
    case 'SET_FILTERS':
      return { ...state, filters: action.payload }
    case 'SET_SORT':
      return { ...state, sort: action.payload }
    default:
      return state
  }
}

interface TaskContextValue extends TaskState {
  fetchTasks: (filters?: TaskFilters) => Promise<void>
  getTaskById: (taskId: string) => Promise<Task>
  createTask: (task: CreateTaskDto) => Promise<Task>
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task>
  deleteTask: (taskId: string) => Promise<void>
  setFilters: (filters: TaskFilters) => void
  setSort: (sort: TaskSortOptions) => void
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined)

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const tasks = await tasksApi.getTasks({
        ...state.filters,
        ...filters,
        sort: state.sort
      })
      dispatch({ type: 'SET_TASKS', payload: tasks })
      dispatch({ type: 'SET_ERROR', payload: null })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch tasks' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.filters, state.sort])

  const getTaskById = useCallback(async (taskId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const task = await tasksApi.getTaskById(taskId)
      dispatch({ type: 'SET_ERROR', payload: null })
      return task
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch task' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const createTask = useCallback(async (task: CreateTaskDto) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const newTask = await tasksApi.createTask(task)
      dispatch({ type: 'ADD_TASK', payload: newTask })
      dispatch({ type: 'SET_ERROR', payload: null })
      return newTask
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create task' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const updatedTask = await tasksApi.updateTask(taskId, updates)
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask })
      dispatch({ type: 'SET_ERROR', payload: null })
      return updatedTask
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const deleteTask = useCallback(async (taskId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await tasksApi.deleteTask(taskId)
      dispatch({ type: 'DELETE_TASK', payload: taskId })
      dispatch({ type: 'SET_ERROR', payload: null })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const setFilters = useCallback((filters: TaskFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }, [])

  const setSort = useCallback((sort: TaskSortOptions) => {
    dispatch({ type: 'SET_SORT', payload: sort })
  }, [])

  return (
    <TaskContext.Provider
      value={{
        ...state,
        fetchTasks,
        getTaskById,
        createTask,
        updateTask,
        deleteTask,
        setFilters,
        setSort
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
} 
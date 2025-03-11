import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { Task } from '../../data/sampleData'

interface TasksState {
  tasks: Task[]
  currentView: 'list' | 'board' | 'calendar' | 'files'
  currentTab: string
  selectedTaskId: string | null
  isModalOpen: boolean
}

interface TasksContextType extends TasksState {
  setCurrentView: (view: 'list' | 'board' | 'calendar' | 'files') => void
  setCurrentTab: (tab: string) => void
  setSelectedTaskId: (taskId: string | null) => void
  setIsModalOpen: (isOpen: boolean) => void
  handleTaskClick: (taskId: string) => void
  handleTaskComplete: (taskId: string) => void
  handleTaskUpdate: (task: Task) => void
  handleTaskCreate: (task: Omit<Task, 'id'>) => void
}

type TasksAction =
  | { type: 'SET_VIEW'; payload: 'list' | 'board' | 'calendar' | 'files' }
  | { type: 'SET_TAB'; payload: string }
  | { type: 'SELECT_TASK'; payload: string | null }
  | { type: 'SET_MODAL'; payload: boolean }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'CREATE_TASK'; payload: Task }

const tasksReducer = (state: TasksState, action: TasksAction): TasksState => {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload }
    case 'SET_TAB':
      return { ...state, currentTab: action.payload }
    case 'SELECT_TASK':
      return { 
        ...state, 
        selectedTaskId: action.payload,
        isModalOpen: !!action.payload 
      }
    case 'SET_MODAL':
      return { ...state, isModalOpen: action.payload }
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, status: task.status === 'completed' ? 'todo' : 'completed' }
            : task
        )
      }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      }
    case 'CREATE_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      }
    default:
      return state
  }
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

interface TasksProviderProps {
  children: React.ReactNode
  initialTasks: Task[]
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children, initialTasks }) => {
  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: initialTasks,
    currentView: 'list',
    currentTab: 'all',
    selectedTaskId: null,
    isModalOpen: false
  })

  const setCurrentView = useCallback((view: 'list' | 'board' | 'calendar' | 'files') => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }, [])

  const setCurrentTab = useCallback((tab: string) => {
    dispatch({ type: 'SET_TAB', payload: tab })
  }, [])

  const setSelectedTaskId = useCallback((taskId: string | null) => {
    dispatch({ type: 'SELECT_TASK', payload: taskId })
  }, [])

  const setIsModalOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_MODAL', payload: isOpen })
  }, [])

  const handleTaskClick = useCallback((taskId: string) => {
    dispatch({ type: 'SELECT_TASK', payload: taskId })
  }, [])

  const handleTaskComplete = useCallback((taskId: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: taskId })
  }, [])

  const handleTaskUpdate = useCallback((task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task })
  }, [])

  const handleTaskCreate = useCallback((newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
    }
    dispatch({ type: 'CREATE_TASK', payload: task })
  }, [])

  const value = useMemo(() => ({
    ...state,
    setCurrentView,
    setCurrentTab,
    setSelectedTaskId,
    setIsModalOpen,
    handleTaskClick,
    handleTaskComplete,
    handleTaskUpdate,
    handleTaskCreate,
  }), [
    state,
    setCurrentView,
    setCurrentTab,
    setSelectedTaskId,
    setIsModalOpen,
    handleTaskClick,
    handleTaskComplete,
    handleTaskUpdate,
    handleTaskCreate,
  ])

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export const useTasksContext = () => {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasksContext must be used within a TasksProvider')
  }
  return context
} 
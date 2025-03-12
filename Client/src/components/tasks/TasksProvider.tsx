import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react'
import { Task, CreateTaskDto } from '../../types/task'

interface TasksState {
  tasks: Task[]
  currentView: 'list' | 'board' | 'calendar' | 'files'
  currentTab: string
  selectedTaskId: string | null
  isModalOpen: boolean
}

interface TasksContextType {
  state: TasksState
  dispatch: React.Dispatch<TasksAction>
  handleTaskClick: (taskId: string) => void
  handleTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  handleTaskCreate: (task: CreateTaskDto) => Promise<void>
  handleTaskComplete: (taskId: string) => Promise<void>
  handleViewChange: (view: TasksState['currentView']) => void
  handleTabChange: (tab: string) => void
  handleModalClose: () => void
}

type TasksAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'UPDATE_TASK'; payload: { taskId: string; updates: Partial<Task> } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'SET_VIEW'; payload: TasksState['currentView'] }
  | { type: 'SET_TAB'; payload: string }
  | { type: 'SET_SELECTED_TASK'; payload: string | null }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }

const initialState: TasksState = {
  tasks: [],
  currentView: 'list',
  currentTab: 'all',
  selectedTaskId: null,
  isModalOpen: false,
}

const tasksReducer = (state: TasksState, action: TasksAction): TasksState => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload.taskId
            ? { ...task, ...action.payload.updates }
            : task
        ),
      }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'SET_VIEW':
      return { ...state, currentView: action.payload }
    case 'SET_TAB':
      return { ...state, currentTab: action.payload }
    case 'SET_SELECTED_TASK':
      return { ...state, selectedTaskId: action.payload }
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload }
    default:
      return state
  }
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

interface TasksProviderProps {
  children: React.ReactNode
  initialTasks: Task[]
}

export const TasksProvider: React.FC<TasksProviderProps> = ({
  children,
  initialTasks,
}) => {
  const [state, dispatch] = useReducer(tasksReducer, {
    ...initialState,
    tasks: initialTasks,
  })

  const handleTaskClick = useCallback((taskId: string) => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: taskId })
    dispatch({ type: 'SET_MODAL_OPEN', payload: true })
  }, [])

  const handleTaskUpdate = useCallback(async (taskId: string, updates: Partial<Task>) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: { taskId, updates },
    })
  }, [])

  const handleTaskCreate = useCallback(async (task: CreateTaskDto) => {
    // In a real app, you would make an API call here
    const newTask: Task = {
      _id: Math.random().toString(),
      title: task.title,
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate,
      assigneeId: task.assigneeId ? { _id: task.assigneeId, email: '' } : undefined,
      projectId: task.projectId,
      sectionId: task.sectionId || undefined,
      parentTaskId: task.parentTaskId || null,
      subtasks: [],
      attachments: [],
      comments: [],
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_TASK', payload: newTask })
  }, [])

  const handleTaskComplete = useCallback(async (taskId: string) => {
    const task = state.tasks.find(t => t._id === taskId)
    if (task) {
      await handleTaskUpdate(taskId, {
        status: task.status === 'completed' ? 'todo' : 'completed'
      })
    }
  }, [state.tasks, handleTaskUpdate])

  const handleViewChange = useCallback((view: TasksState['currentView']) => {
    dispatch({ type: 'SET_VIEW', payload: view })
  }, [])

  const handleTabChange = useCallback((tab: string) => {
    dispatch({ type: 'SET_TAB', payload: tab })
  }, [])

  const handleModalClose = useCallback(() => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: false })
  }, [])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      handleTaskClick,
      handleTaskUpdate,
      handleTaskCreate,
      handleTaskComplete,
      handleViewChange,
      handleTabChange,
      handleModalClose,
    }),
    [
      state,
      handleTaskClick,
      handleTaskUpdate,
      handleTaskCreate,
      handleTaskComplete,
      handleViewChange,
      handleTabChange,
      handleModalClose,
    ]
  )

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export const useTasks = () => {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
}

export default TasksProvider 
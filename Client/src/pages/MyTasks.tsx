import { Box } from '@chakra-ui/react'
import TaskDetails from '../components/tasks/TaskDetails'
import TaskContainer from '../components/tasks/TaskContainer'
import TasksHeader from '../components/tasks/header/TasksHeader'
import { TaskProvider, useTaskContext } from '../store/TaskContext'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { Task, CreateTaskDto } from '../types/task'
import { useAuth } from '../hooks/useAuth'

const TasksContent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTaskContext()

  const [currentView, setCurrentView] = useState<'list' | 'board' | 'calendar' | 'files'>('list')
  const [currentTab, setCurrentTab] = useState<'all' | 'assigned' | 'created'>('assigned')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Update view based on URL
  useEffect(() => {
    const path = location.pathname
    if (path === '/my_tasks' || path === '/my_tasks/list') {
      setCurrentView('list')
    } else if (path === '/my_tasks/board') {
      setCurrentView('board')
    } else if (path === '/my_tasks/calendar') {
      setCurrentView('calendar')
    } else if (path === '/my_tasks/files') {
      setCurrentView('files')
    }
  }, [location.pathname])

  // Fetch tasks when tab changes
  useEffect(() => {
    if (!currentUser?._id) return;
    
    const filters = {
      ...(currentTab === 'assigned' ? { assigneeId: [currentUser._id] } : {}),
      ...(currentTab === 'created' ? { createdBy: currentUser._id } : {})
    }
    fetchTasks(filters)
  }, [currentTab, fetchTasks, currentUser])

  // Update URL when view changes
  const handleViewChange = (view: 'list' | 'board' | 'calendar' | 'files') => {
    setCurrentView(view)
    if (view === 'list') {
      navigate('/my_tasks/list')
    } else {
      navigate(`/my_tasks/${view}`)
    }
  }

  // Handle task click
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsModalOpen(true)
  }

  // Handle task complete
  const handleTaskComplete = async (taskId: string) => {
    const task = tasks.find(t => t._id === taskId)
    if (task) {
      await updateTask(taskId, {
        status: task.status === 'completed' ? 'todo' : 'completed'
      })
    }
  }

  // Handle task create
  const handleTaskCreate = async (task: CreateTaskDto) => {
    await createTask(task)
  }

  // Handle task update
  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    const updatedTask = await updateTask(taskId, updates)
    // Update the selected task ID if the task ID changed
    if (updatedTask._id !== selectedTaskId) {
      setSelectedTaskId(updatedTask._id)
    }
  }

  if (loading) {
    return <Box p={6}>Loading...</Box>
  }

  if (error) {
    return <Box p={6}>Error: {error}</Box>
  }

  return (
    <Box h="100%" p={6}>
      <TasksHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        currentTab={currentTab}
        onTabChange={(tab: 'all' | 'assigned' | 'created') => setCurrentTab(tab)}
      />

      <TaskContainer
        tasks={tasks}
        onTaskClick={handleTaskClick}
        onTaskUpdate={handleTaskUpdate}
        onTaskCreate={handleTaskCreate}
        currentView={currentView}
      />

      {selectedTaskId && (
        <TaskDetails
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTaskId(null)
          }}
          taskId={selectedTaskId}
          onTaskComplete={handleTaskComplete}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </Box>
  )
}

export default function MyTasks() {
  return (
    <PageLayout>
      <TaskProvider>
        <TasksContent />
      </TaskProvider>
    </PageLayout>
  )
} 
import { Box } from '@chakra-ui/react'
import TaskDetails from '../components/tasks/TaskDetails'
import TaskContainer from '../components/tasks/TaskContainer'
import TasksHeader from '../components/tasks/header/TasksHeader'
import { TasksProvider, useTasksContext } from '../components/tasks/TasksProvider'
import { sampleData } from '../data/sampleData'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const TasksContent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    tasks,
    currentView,
    currentTab,
    selectedTaskId,
    isModalOpen,
    setCurrentView,
    setCurrentTab,
    handleTaskClick,
    handleTaskComplete,
    handleTaskUpdate,
    handleTaskCreate,
    setIsModalOpen,
    setSelectedTaskId,
  } = useTasksContext()

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
  }, [location.pathname, setCurrentView])

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
  const handleTaskClickWrapper = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsModalOpen(true)
  }

  // Handle task update
  const handleTaskUpdateWrapper = (updatedTask: Task) => {
    handleTaskUpdate(updatedTask)
    // Update the selected task ID if the task ID changed
    if (updatedTask.id !== selectedTaskId) {
      setSelectedTaskId(updatedTask.id)
    }
  }

  return (
    <Box h="100%" p={6}>
      <TasksHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      <TaskContainer
        tasks={tasks}
        onTaskClick={handleTaskClickWrapper}
        onTaskUpdate={handleTaskUpdateWrapper}
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
          onTaskUpdate={handleTaskUpdateWrapper}
        />
      )}
    </Box>
  )
}

export default function MyTasks() {
  const initialTasks = sampleData.tasks
  
  return (
    <TasksProvider initialTasks={initialTasks}>
      <TasksContent />
    </TasksProvider>
  )
} 
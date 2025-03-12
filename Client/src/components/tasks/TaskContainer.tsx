import { Box, Flex } from '@chakra-ui/react'
import TaskList from './list/TaskList'
import TaskBoard from './TaskBoard'
import TaskCalendar from './TaskCalendar'
import TaskFiles from './TaskFiles'
import { Task, CreateTaskDto } from '../../types/task'
import { ProjectSection } from '../../types/project'
import { memo, useEffect, useMemo } from 'react'
import { projectApi } from '../../services/api/project'

interface TaskContainerProps {
  tasks: Task[]
  sections: ProjectSection[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (task: Task) => Promise<void>
  onTaskCreate: (task: CreateTaskDto) => Promise<void>
  onSectionUpdate: (sectionId: string, title: string) => Promise<void>
  onSectionCreate: (title: string) => Promise<void>
  currentView: 'list' | 'board' | 'calendar' | 'files'
  selectedProjectId?: string
}

const TaskContainer = memo(({
  tasks,
  sections,
  onTaskClick,
  onTaskUpdate,
  onTaskCreate,
  onSectionUpdate,
  onSectionCreate,
  currentView,
  selectedProjectId
}: TaskContainerProps) => {
  // Filter tasks by project
  const filteredTasks = useMemo(() => {
    if (!selectedProjectId) return tasks
    return tasks.filter(task => task.projectId === selectedProjectId)
  }, [tasks, selectedProjectId])

  useEffect(() => {
    console.log('Current view changed:', currentView)
    console.log('Selected project:', selectedProjectId)
  }, [currentView, selectedProjectId])

  const handleTaskComplete = (taskId: string) => {
    const task = tasks.find(t => t._id === taskId)
    if (task) {
      onTaskUpdate({
        ...task,
        status: task.status === 'completed' ? 'todo' : 'completed'
      })
    }
  }

  const handleTaskProjectChange = (taskId: string, projectId: string) => {
    const task = tasks.find(t => t._id === taskId)
    if (task) {
      onTaskUpdate({
        ...task,
        projectId
      })
    }
  }

  const handleTaskSectionChange = (taskId: string, sectionId: string) => {
    const task = tasks.find(t => t._id === taskId)
    if (task) {
      onTaskUpdate({
        ...task,
        sectionId
      })
    }
  }

  const handleTaskCreate = async (task: CreateTaskDto) => {
    if (!selectedProjectId) return
    
    try {
      await onTaskCreate({
        ...task,
        projectId: selectedProjectId,
      })
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleSectionReorder = async (sectionIds: string[]) => {
    if (!selectedProjectId) return
    try {
      await projectApi.reorderSections(selectedProjectId, sectionIds)
    } catch (error) {
      console.error('Failed to reorder sections:', error)
    }
  }

  const commonProps = useMemo(() => ({
    tasks: filteredTasks,
    sections,
    onTaskClick,
    onTaskUpdate,
    onTaskCreate: handleTaskCreate,
    onTaskComplete: handleTaskComplete,
    onTaskProjectChange: handleTaskProjectChange,
    onTaskSectionChange: handleTaskSectionChange,
    onSectionUpdate,
    onSectionCreate,
    onSectionReorder: handleSectionReorder,
    projectId: selectedProjectId || '',
  }), [
    filteredTasks,
    sections,
    onTaskClick,
    onTaskUpdate,
    handleTaskCreate,
    handleTaskComplete,
    handleTaskProjectChange,
    handleTaskSectionChange,
    onSectionUpdate,
    onSectionCreate,
    handleSectionReorder,
    selectedProjectId,
  ])

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return <TaskList {...commonProps} />
      case 'board':
        return <TaskBoard {...commonProps} />
      case 'calendar':
        return <TaskCalendar {...commonProps} />
      case 'files':
        return <TaskFiles tasks={filteredTasks} onTaskClick={onTaskClick} />
      default:
        return <TaskList {...commonProps} />
    }
  }

  return (
    <Flex
      flex={1}
      h="full"
      direction="column"
      bg="white"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      mt={4}
    >
      {renderView()}
    </Flex>
  )
})

TaskContainer.displayName = 'TaskContainer'

export default TaskContainer 
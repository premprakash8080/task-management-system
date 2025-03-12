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
  sections?: ProjectSection[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onTaskCreate: (task: CreateTaskDto) => Promise<void>
  onTaskComplete: (taskId: string) => Promise<void>
  onSectionUpdate: (sectionId: string, title: string) => Promise<void>
  onSectionCreate: (title: string) => Promise<void>
  currentView: 'list' | 'board' | 'calendar' | 'files'
  selectedProjectId?: string
}

const TaskContainer = memo(({
  tasks,
  sections = [],
  onTaskClick,
  onTaskUpdate,
  onTaskCreate,
  onTaskComplete,
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

  const handleTaskProjectChange = async (taskId: string, projectId: string) => {
    await onTaskUpdate(taskId, { projectId })
  }

  const handleTaskSectionChange = async (taskId: string, sectionId: string) => {
    await onTaskUpdate(taskId, { sectionId })
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

  // Wrapper for task updates to match the expected function signature for TaskList
  const handleTaskUpdateForList = async (task: Task) => {
    const { _id, ...updates } = task
    await onTaskUpdate(_id, updates)
  }

  const listProps = {
    tasks: filteredTasks,
    sections,
    onTaskClick,
    onTaskUpdate: handleTaskUpdateForList,
    onTaskCreate: handleTaskCreate,
    onTaskComplete,
    onTaskProjectChange: handleTaskProjectChange,
    onTaskSectionChange: handleTaskSectionChange,
    onSectionUpdate,
    onSectionCreate,
    onSectionReorder: handleSectionReorder,
    projectId: selectedProjectId || '',
  }

  const otherViewProps = {
    tasks: filteredTasks,
    sections,
    onTaskClick,
    onTaskUpdate,
    onTaskCreate: handleTaskCreate,
    onTaskComplete,
    onTaskProjectChange: handleTaskProjectChange,
    onTaskSectionChange: handleTaskSectionChange,
    onSectionUpdate,
    onSectionCreate,
    onSectionReorder: handleSectionReorder,
    projectId: selectedProjectId || '',
  }

  const renderView = () => {
    switch (currentView) {
      case 'list':
        return <TaskList {...listProps} />
      case 'board':
        return <TaskBoard {...otherViewProps} />
      case 'calendar':
        return <TaskCalendar {...otherViewProps} />
      case 'files':
        return <TaskFiles {...otherViewProps} />
      default:
        return <TaskList {...listProps} />
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
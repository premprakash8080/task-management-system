import { Box, Flex } from '@chakra-ui/react'
import TaskList from './list/TaskList'
import TaskBoard from './TaskBoard'
import TaskCalendar from './TaskCalendar'
import TaskFiles from './TaskFiles'
import { Task } from '../../data/sampleData'
import { memo, useEffect, useMemo } from 'react'

interface TaskContainerProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (task: Task) => void
  onTaskCreate: (task: Omit<Task, 'id'>) => void
  currentView: 'list' | 'board' | 'calendar' | 'files'
  selectedProjectId?: string
}

const TaskContainer = memo(({
  tasks,
  onTaskClick,
  onTaskUpdate,
  onTaskCreate,
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
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      onTaskUpdate({
        ...task,
        status: task.status === 'completed' ? 'todo' : 'completed'
      })
    }
  }

  const handleTaskProjectChange = (taskId: string, projectId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      onTaskUpdate({
        ...task,
        projectId
      })
    }
  }

  const handleTaskSectionChange = (taskId: string, section: Task['status']) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      onTaskUpdate({
        ...task,
        status: section
      })
    }
  }

  const handleTaskCreate = (newTask: Partial<Task>) => {
    onTaskCreate({
      ...newTask,
      title: newTask.title || '',
      description: newTask.description || '',
      status: newTask.status || 'todo',
      projectId: selectedProjectId || newTask.projectId || '',
      tags: newTask.tags || [],
      attachments: newTask.attachments || [],
      comments: newTask.comments || [],
      createdAt: newTask.createdAt || new Date().toISOString(),
      updatedAt: newTask.updatedAt || new Date().toISOString(),
    } as Omit<Task, 'id'>)
  }

  const renderView = () => {
    const commonProps = {
      tasks: filteredTasks,
      onTaskClick,
      onTaskUpdate,
      onTaskCreate: handleTaskCreate
    }

    switch (currentView) {
      case 'list':
        return (
          <TaskList
            {...commonProps}
            onTaskComplete={handleTaskComplete}
            onTaskProjectChange={handleTaskProjectChange}
            onTaskSectionChange={handleTaskSectionChange}
          />
        )
      case 'board':
        return (
          <TaskBoard
            {...commonProps}
          />
        )
      case 'calendar':
        return (
          <TaskCalendar
            {...commonProps}
          />
        )
      case 'files':
        return (
          <TaskFiles
            tasks={filteredTasks}
            onTaskClick={onTaskClick}
          />
        )
      default:
        return (
          <TaskList
            {...commonProps}
            onTaskComplete={handleTaskComplete}
            onTaskProjectChange={handleTaskProjectChange}
            onTaskSectionChange={handleTaskSectionChange}
          />
        )
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
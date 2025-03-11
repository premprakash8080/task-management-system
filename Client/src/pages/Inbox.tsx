import {
  Box,
  VStack,
  Text,
  HStack,
  Icon,
  useColorModeValue,
  Heading,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { 
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineInbox,
  AiOutlineCheck,
  AiOutlineProject,
} from 'react-icons/ai'
import { Task } from '../types/task'
import TaskDetails from '../components/tasks/TaskDetails'
import TaskListItem from '../components/tasks/list/TaskListItem'
import { format, isToday, isTomorrow, parseISO } from 'date-fns'
import { useTasks } from '../hooks/useTasks'

interface TaskGroup {
  title: string
  icon: any
  tasks: Task[]
  color?: string
}

export default function Inbox() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState<'activity' | 'archived'>('activity')

  // Use our custom hook for task operations
  const {
    tasks,
    isLoading,
    error,
    updateTask,
    isUpdating,
  } = useTasks({
    status: currentTab === 'archived' ? ['completed'] : ['todo', 'in_progress'],
  })

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsTaskDetailOpen(true)
  }

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      await updateTask({ taskId: updatedTask.id, updates: updatedTask })
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  // Group tasks based on current tab
  const groupedTasks = useMemo(() => {
    if (!tasks) return []

    const groups: TaskGroup[] = []
    const isArchived = currentTab === 'archived'
    
    if (!isArchived) {
      // Your Tasks (no due date)
      const yourTasks = tasks.filter(task => !task.dueDate)
      if (yourTasks.length > 0) {
        groups.push({ 
          title: 'Your Tasks',
          icon: AiOutlineInbox,
          tasks: yourTasks,
          color: 'blue.500'
        })
      }

      // Due Today
      const todayTasks = tasks.filter(task => 
        task.dueDate && isToday(parseISO(task.dueDate))
      )
      if (todayTasks.length > 0) {
        groups.push({ 
          title: 'Due Today',
          icon: AiOutlineClockCircle,
          tasks: todayTasks,
          color: 'red.500'
        })
      }

      // Due Tomorrow
      const tomorrowTasks = tasks.filter(task => 
        task.dueDate && isTomorrow(parseISO(task.dueDate))
      )
      if (tomorrowTasks.length > 0) {
        groups.push({ 
          title: 'Due Tomorrow',
          icon: AiOutlineCalendar,
          tasks: tomorrowTasks,
          color: 'orange.500'
        })
      }

      // Group future tasks by project
      const futureTasks = tasks.filter(task => {
        if (!task.dueDate) return false
        const date = parseISO(task.dueDate)
        return !isToday(date) && !isTomorrow(date)
      })

      // Group by project
      const projectGroups = new Map<string, Task[]>()
      futureTasks.forEach(task => {
        if (!task.projectId) return
        if (!projectGroups.has(task.projectId)) {
          projectGroups.set(task.projectId, [])
        }
        projectGroups.get(task.projectId)?.push(task)
      })

      projectGroups.forEach((tasks, projectId) => {
        const project = tasks[0]?.project
        if (project) {
          groups.push({
            title: project.title,
            icon: AiOutlineProject,
            tasks: tasks,
            color: project.color
          })
        }
      })
    } else {
      // Group archived tasks
      groups.push({ 
        title: 'Archived Tasks',
        icon: AiOutlineCheck,
        tasks: tasks,
        color: 'gray.500'
      })
    }

    return groups
  }, [tasks, currentTab])

  if (isLoading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          Failed to load tasks. Please try again later.
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      {/* Main Content */}
      <Box p={6}>
        {/* Task groups */}
        <VStack spacing={6} align="stretch">
          {groupedTasks.map((group, index) => (
            <Box key={index}>
              <HStack mb={4} spacing={2}>
                <Icon 
                  as={group.icon} 
                  color={group.color} 
                  boxSize={5}
                />
                <Heading size="sm" color="gray.600">
                  {group.title}
                </Heading>
                <Badge 
                  colorScheme={group.color?.split('.')[0]} 
                  variant="subtle"
                >
                  {group.tasks.length}
                </Badge>
              </HStack>
              <VStack spacing={2} align="stretch" pl={7}>
                {group.tasks.map(task => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    onTaskClick={() => handleTaskClick(task.id)}
                    onComplete={async (taskId) => {
                      await handleTaskUpdate({
                        ...task,
                        status: task.status === 'completed' ? 'todo' : 'completed'
                      })
                    }}
                  />
                ))}
              </VStack>
            </Box>
          ))}
          
          {groupedTasks.length === 0 && (
            <Box 
              textAlign="center" 
              py={8} 
              color="gray.500"
              borderRadius="lg"
              bg={useColorModeValue('gray.50', 'gray.700')}
            >
              <Icon 
                as={currentTab === 'activity' ? AiOutlineInbox : AiOutlineCheck} 
                boxSize={8} 
                mb={3}
              />
              <Text>No {currentTab === 'activity' ? 'active' : 'archived'} tasks found</Text>
            </Box>
          )}
        </VStack>

        {/* Task Detail Panel */}
        {selectedTaskId && (
          <TaskDetails
            isOpen={isTaskDetailOpen}
            onClose={() => {
              setIsTaskDetailOpen(false)
              setSelectedTaskId(null)
            }}
            taskId={selectedTaskId}
            onTaskUpdate={handleTaskUpdate}
          />
        )}
      </Box>
    </Box>
  )
} 
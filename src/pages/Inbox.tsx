import {
  Box,
  VStack,
  Text,
  HStack,
  Icon,
  useColorModeValue,
  Heading,
  Badge,
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { 
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineInbox,
  AiOutlineCheck,
  AiOutlineProject,
} from 'react-icons/ai'
import { Task, Project, sampleData } from '../data/sampleData'
import TaskDetails from '../components/tasks/TaskDetails'
import TaskListItem from '../components/tasks/list/TaskListItem'
import { format, isToday, isTomorrow, parseISO, addDays } from 'date-fns'

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

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsTaskDetailOpen(true)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    // Handle task update logic here
    console.log('Task updated:', updatedTask)
  }

  // Get project details for a task
  const getProjectDetails = (projectId: string): Project | undefined => {
    return sampleData.projects.find(p => p.id === projectId)
  }

  // Filter and group tasks based on current tab
  const groupedTasks = useMemo(() => {
    const isArchived = currentTab === 'archived'
    const filteredTasks = sampleData.tasks.filter(task => 
      isArchived ? task.status === 'completed' : task.status !== 'completed'
    )

    const groups: TaskGroup[] = []
    
    if (!isArchived) {
      // Your Tasks (no due date)
      const yourTasks = filteredTasks.filter(task => !task.dueDate)
      if (yourTasks.length > 0) {
        groups.push({ 
          title: 'Your Tasks',
          icon: AiOutlineInbox,
          tasks: yourTasks,
          color: 'blue.500'
        })
      }

      // Due Today
      const todayTasks = filteredTasks.filter(task => 
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
      const tomorrowTasks = filteredTasks.filter(task => 
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
      const futureTasks = filteredTasks.filter(task => {
        if (!task.dueDate) return false
        const date = parseISO(task.dueDate)
        return !isToday(date) && !isTomorrow(date)
      })

      // Group by project
      const projectGroups = new Map<string, Task[]>()
      futureTasks.forEach(task => {
        const projectId = task.projectId
        if (!projectGroups.has(projectId)) {
          projectGroups.set(projectId, [])
        }
        projectGroups.get(projectId)?.push(task)
      })

      projectGroups.forEach((tasks, projectId) => {
        const project = getProjectDetails(projectId)
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
      // Group archived tasks by completion date
      groups.push({ 
        title: 'Archived Tasks',
        icon: AiOutlineCheck,
        tasks: filteredTasks,
        color: 'gray.500'
      })
    }

    return groups
  }, [currentTab])

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
                    onComplete={() => handleTaskClick(task.id)}
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
        <TaskDetails
          isOpen={isTaskDetailOpen}
          onClose={() => {
            setIsTaskDetailOpen(false)
            setSelectedTaskId(null)
          }}
          taskId={selectedTaskId || ''}
          onTaskUpdate={handleTaskUpdate}
        />
      </Box>
    </Box>
  )
} 
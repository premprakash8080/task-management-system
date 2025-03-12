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
  useDisclosure,
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { 
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineInbox,
  AiOutlineCheck,
  AiOutlineProject,
  AiOutlineStar,
} from 'react-icons/ai'
import { Task, TaskStatus } from '../types/task'
import TaskDetails from '../components/tasks/TaskDetails'
import TaskListItem from '../components/tasks/list/TaskListItem'
import { format, isToday, isTomorrow, parseISO } from 'date-fns'
import { useTasks } from '../hooks/useTasks'
import { PageLayout } from '../components/layout/PageLayout'
import { Comment, Attachment } from '../data/sampleData'

interface TaskGroup {
  title: string;
  icon: any;
  color: string;
  tasks: Task[];
}

// Helper function to convert status
const convertStatus = (status: TaskStatus): 'todo' | 'completed' | 'in-progress' => {
  switch (status) {
    case 'in_progress':
      return 'in-progress'
    default:
      return status
  }
}

export default function Inbox() {
  const { tasks = [], updateTask, isLoading } = useTasks()
  const { isOpen: isTaskDetailOpen, onOpen: onTaskDetailOpen, onClose: onTaskDetailClose } = useDisclosure()
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState<'activity' | 'archived'>('activity')

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    onTaskDetailOpen()
  }

  const handleTaskComplete = async (taskId: string) => {
    const task = (tasks as Task[]).find(t => t.id === taskId)
    if (task) {
      await updateTask({
        taskId,
        updates: {
          status: task.status === 'completed' ? 'todo' : 'completed' as TaskStatus
        }
      })
    }
  }

  // Filter and group tasks
  const activeTasks = (tasks as Task[]).filter(task => task.status !== 'completed')
  const archivedTasks = (tasks as Task[]).filter(task => task.status === 'completed')
  const currentTasks = currentTab === 'activity' ? activeTasks : archivedTasks

  const todayTasks = currentTasks.filter(task => {
    const dueDate = task.dueDate ? parseISO(task.dueDate) : null
    return dueDate && isToday(dueDate)
  })

  const tomorrowTasks = currentTasks.filter(task => {
    const dueDate = task.dueDate ? parseISO(task.dueDate) : null
    return dueDate && isTomorrow(dueDate)
  })

  const upcomingTasks = currentTasks.filter(task => {
    const dueDate = task.dueDate ? parseISO(task.dueDate) : null
    return dueDate && !isToday(dueDate) && !isTomorrow(dueDate)
  })

  const noDateTasks = currentTasks.filter(task => !task.dueDate)

  const groupedTasks: TaskGroup[] = [
    {
      title: 'Today',
      icon: AiOutlineStar,
      color: 'yellow.500',
      tasks: todayTasks
    },
    {
      title: 'Tomorrow',
      icon: AiOutlineProject,
      color: 'blue.500',
      tasks: tomorrowTasks
    },
    {
      title: 'Upcoming',
      icon: AiOutlineInbox,
      color: 'purple.500',
      tasks: upcomingTasks
    },
    {
      title: 'No Due Date',
      icon: AiOutlineCheck,
      color: 'gray.500',
      tasks: noDateTasks
    }
  ].filter(group => group.tasks.length > 0)

  if (isLoading) {
    return (
      <PageLayout>
        <Box textAlign="center" py={8}>
          <Text>Loading tasks...</Text>
        </Box>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
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
                      task={{
                        id: task.id,
                        title: task.title,
                        description: task.description || '',
                        status: convertStatus(task.status),
                        priority: task.priority || 'medium',
                        dueDate: task.dueDate || '',
                        projectId: task.projectId || '',
                        assigneeId: task.assigneeId || '',
                        likesCount: task.likesCount || 0,
                        tags: task.tags || [],
                        attachments: (task.attachments || []).map(attachment => 
                          typeof attachment === 'string' 
                            ? {
                                id: attachment,
                                name: attachment,
                                url: attachment,
                                type: 'unknown',
                                size: 0
                              } as Attachment
                            : attachment
                        ),
                        comments: (task.comments || []).map(comment => 
                          'content' in comment
                            ? {
                                id: comment.id,
                                text: comment.content,
                                userId: comment.userId,
                                createdAt: comment.createdAt
                              } as Comment
                            : comment
                        ),
                        createdAt: task.createdAt || new Date().toISOString(),
                        updatedAt: task.updatedAt || new Date().toISOString()
                      }}
                      onTaskClick={handleTaskClick}
                      onComplete={handleTaskComplete}
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
                onTaskDetailClose()
                setSelectedTaskId(null)
              }}
              taskId={selectedTaskId}
              onTaskUpdate={(updates: Partial<Task>) => {
                if (updates.id) {
                  // Convert status back to TaskStatus type if it exists
                  if (updates.status === 'in-progress') {
                    updates.status = 'in_progress' as TaskStatus;
                  }
                  updateTask({ taskId: updates.id, updates })
                }
              }}
            />
          )}
        </Box>
      </Box>
    </PageLayout>
  )
} 
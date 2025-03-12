import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { Task, CreateTaskDto } from '../../types/task'
import { ProjectSection } from '../../types/project'
import { format } from 'date-fns'

interface TaskCalendarProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onTaskCreate: (task: CreateTaskDto) => Promise<void>
  onTaskComplete: (taskId: string) => Promise<void>
  onTaskProjectChange: (taskId: string, projectId: string) => Promise<void>
  onTaskSectionChange: (taskId: string, sectionId: string) => Promise<void>
  projectId: string
  sections: ProjectSection[]
  onSectionUpdate?: (sectionId: string, title: string) => Promise<void>
  onSectionCreate?: (title: string) => Promise<void>
  onSectionReorder?: (sectionIds: string[]) => Promise<void>
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({
  tasks,
  onTaskClick,
  onTaskUpdate,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')

  const getTasksByDate = () => {
    const tasksByDate: { [key: string]: Task[] } = {}
    tasks.forEach(task => {
      if (task.dueDate) {
        const date = format(new Date(task.dueDate), 'yyyy-MM-dd')
        if (!tasksByDate[date]) {
          tasksByDate[date] = []
        }
        tasksByDate[date].push(task)
      }
    })
    return tasksByDate
  }

  const tasksByDate = getTasksByDate()

  return (
    <Box p={4}>
      {Object.entries(tasksByDate).map(([date, dateTasks]) => (
        <Box key={date} mb={6}>
          <Heading size="md" mb={4}>
            {format(new Date(date), 'MMMM d, yyyy')}
          </Heading>
          <SimpleGrid columns={1} spacing={4}>
            {dateTasks.map(task => (
              <Box
                key={task._id}
                p={4}
                bg={bgColor}
                borderRadius="md"
                boxShadow="sm"
                cursor="pointer"
                onClick={() => onTaskClick(task._id)}
                _hover={{ boxShadow: 'md' }}
              >
                <Text fontWeight="medium">{task.title}</Text>
                {task.description && (
                  <Text fontSize="sm" color="gray.500" noOfLines={2} mt={1}>
                    {task.description}
                  </Text>
                )}
                <Box mt={2}>
                  <Badge
                    colorScheme={
                      task.priority === 'high'
                        ? 'red'
                        : task.priority === 'medium'
                        ? 'yellow'
                        : 'green'
                    }
                    mr={2}
                  >
                    {task.priority}
                  </Badge>
                  <Badge
                    colorScheme={
                      task.status === 'completed'
                        ? 'green'
                        : task.status === 'in_progress'
                        ? 'yellow'
                        : 'gray'
                    }
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Box>
  )
}

export default TaskCalendar 
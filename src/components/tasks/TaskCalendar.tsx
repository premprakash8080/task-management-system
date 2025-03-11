import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { Task } from '../../store/initialData'
import { useState } from 'react'

interface TaskCalendarProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onTaskUpdate?: (task: Task) => void
  onTaskCreate?: (task: Partial<Task>) => void
}

const TaskCalendar = ({
  tasks,
  onTaskClick,
  onTaskUpdate,
  onTaskCreate,
}: TaskCalendarProps) => {
  const [currentDate] = useState(new Date())
  const bgColor = useColorModeValue('white', 'gray.800')

  // Get the first day of the month
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const startingDay = firstDay.getDay()

  // Get the last day of the month
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const totalDays = lastDay.getDate()

  // Create calendar days array
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDay + 1
    if (dayNumber < 1 || dayNumber > totalDays) return null
    return dayNumber
  })

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.dueDate) return acc
    const date = new Date(task.dueDate)
    if (
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    ) {
      const key = date.getDate()
      if (!acc[key]) acc[key] = []
      acc[key].push(task)
    }
    return acc
  }, {} as Record<number, Task[]>)

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Box>
      {/* Calendar Header */}
      <SimpleGrid columns={7} spacing={1} mb={1}>
        {weekDays.map(day => (
          <Box
            key={day}
            p={2}
            textAlign="center"
            fontWeight="medium"
            color="gray.600"
          >
            {day}
          </Box>
        ))}
      </SimpleGrid>

      {/* Calendar Grid */}
      <SimpleGrid columns={7} spacing={1}>
        {days.map((day, index) => (
          <Box
            key={index}
            bg={bgColor}
            p={2}
            minH="120px"
            borderRadius="md"
            opacity={day ? 1 : 0.3}
            cursor={day ? 'pointer' : 'default'}
            onClick={() => {
              if (day && onTaskCreate) {
                const newDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                )
                onTaskCreate({
                  dueDate: newDate.toISOString().split('T')[0],
                })
              }
            }}
          >
            <Text fontSize="sm" mb={2}>
              {day}
            </Text>
            {day && tasksByDate[day] && (
              <VStack align="stretch" spacing={1}>
                {tasksByDate[day].map(task => (
                  <Box
                    key={task.id}
                    p={1}
                    bg="gray.50"
                    borderRadius="sm"
                    fontSize="xs"
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTaskClick?.(task)
                    }}
                    _hover={{ bg: 'gray.100' }}
                  >
                    <Text noOfLines={1}>{task.title}</Text>
                    {task.project && (
                      <Badge
                        size="sm"
                        colorScheme={task.project.color.split('.')[0]}
                        variant="subtle"
                      >
                        {task.project.name}
                      </Badge>
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default TaskCalendar 
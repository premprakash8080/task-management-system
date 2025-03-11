import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'

interface TasksDueSoonProps {
  tasks: Array<{
    id: string
    title: string
    project?: {
      name: string
      color: string
    }
    dueDate?: string
    isCompleted?: boolean
  }>
  showHeader?: boolean
  onTaskClick?: (taskId: string) => void
}

export default function TasksDueSoon({ tasks, showHeader = true, onTaskClick }: TasksDueSoonProps) {
  const bgHover = useColorModeValue('gray.50', 'whiteAlpha.100')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const handleTaskClick = (taskId: string) => {
    onTaskClick?.(taskId)
  }

  return (
    <VStack align="stretch" spacing={0}>
      {showHeader && (
        <HStack justify="space-between" mb={2}>
          <Text fontSize="lg" fontWeight="medium">
            Tasks Due Soon
          </Text>
          <Button size="sm" variant="ghost">
            View all
          </Button>
        </HStack>
      )}

      {tasks.map((task, index) => (
        <Box
          key={task.id}
          p={3}
          borderTopWidth={index === 0 ? "1px" : "0"}
          borderBottomWidth="1px"
          borderColor={borderColor}
          cursor="pointer"
          onClick={() => handleTaskClick(task.id)}
          _hover={{ bg: bgHover }}
          transition="all 0.2s"
        >
          <HStack justify="space-between" width="100%">
            <HStack spacing={2}>
              <Text fontSize="sm" fontWeight="medium">
                {task.title}
              </Text>
            </HStack>
            <HStack spacing={3}>
              {task.project && (
                <HStack spacing={2}>
                  <Box w={2} h={2} borderRadius="full" bg={task.project.color} />
                  <Text fontSize="xs" color="gray.600">
                    {task.project.name}
                  </Text>
                </HStack>
              )}
              {task.dueDate && (
                <Text fontSize="xs" color="gray.600">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              )}
              {task.isCompleted && (
                <Badge colorScheme="green" variant="subtle">
                  Completed
                </Badge>
              )}
            </HStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  )
} 
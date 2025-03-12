import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Badge,
  useColorModeValue,
  Icon,
  Flex,
} from '@chakra-ui/react'
import { Task, CreateTaskDto } from '../../types/task'
import { ProjectSection } from '../../types/project'
import { FiFile, FiImage, FiPaperclip } from 'react-icons/fi'
import { format } from 'date-fns'

interface TaskFilesProps {
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

const TaskFiles: React.FC<TaskFilesProps> = ({
  tasks,
  onTaskClick,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return FiImage
    }
    return FiFile
  }

  const tasksWithFiles = tasks.filter(task => task.attachments.length > 0)

  return (
    <Box p={4}>
      <Heading size="md" mb={6}>
        Files ({tasksWithFiles.length})
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {tasksWithFiles.map(task => (
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
            <Text fontWeight="medium" mb={2}>
              {task.title}
            </Text>
            {task.attachments.map((attachment, index) => (
              <Flex
                key={index}
                align="center"
                p={2}
                bg="gray.50"
                borderRadius="md"
                mb={2}
              >
                <Icon as={getFileIcon(attachment)} mr={2} />
                <Text fontSize="sm" noOfLines={1}>
                  {attachment}
                </Text>
              </Flex>
            ))}
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
  )
}

export default TaskFiles 
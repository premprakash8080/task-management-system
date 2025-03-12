import {
  Box,
  Text,
  IconButton,
  useColorModeValue,
  Checkbox,
  Flex,
  Avatar,
  Tooltip,
  HStack,
} from '@chakra-ui/react'
import { Task } from '../../../types/task'
import { FiEdit2 } from 'react-icons/fi'
import { format } from 'date-fns'
import { memo } from 'react'

export interface TaskListItemProps {
  task: Task
  onClick: () => void
  onUpdate: (task: Task) => Promise<void>
  onComplete: () => void
  onProjectChange: (projectId: string) => void
  onSectionChange: (sectionId: string) => void
  projectName?: string
}

const TaskListItem = memo(({
  task,
  onClick,
  onComplete,
  projectName,
}: TaskListItemProps) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), 'MMM dd, yyyy')
    } catch (error) {
      return ''
    }
  }

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      mb={2}
      _hover={{ bg: hoverBg }}
      transition="background-color 0.2s"
      cursor="pointer"
      onClick={onClick}
    >
      <Flex p={3} align="center">
        <Box flex="0 0 40px" textAlign="center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            isChecked={task.status === 'completed'}
            onChange={onComplete}
          />
        </Box>
        
        <Box flex={2} px={2}>
          <Text
            fontSize="sm"
            textDecoration={task.status === 'completed' ? 'line-through' : 'none'}
            color={task.status === 'completed' ? 'gray.500' : 'inherit'}
            noOfLines={1}
          >
            {task.title}
          </Text>
        </Box>

        <Box w="150px" px={2}>
          <Text fontSize="sm" color="gray.600" noOfLines={1}>
            {projectName || 'Untitled Project'}
          </Text>
        </Box>

        <Box w="120px" px={2}>
          {task.dueDate && (
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {formatDate(task.dueDate)}
            </Text>
          )}
        </Box>

        <Box w="120px" px={2}>
          {task.assigneeId && typeof task.assigneeId === 'object' && (
            <HStack spacing={2}>
              <Avatar 
                size="xs" 
                name={task.assigneeId.email}
                title={task.assigneeId.email}
              />
              <Text fontSize="sm" color="gray.600" noOfLines={1}>
                {task.assigneeId.email.split('@')[0]}
              </Text>
            </HStack>
          )}
        </Box>

        <Box w="40px" textAlign="center" onClick={(e) => e.stopPropagation()}>
          <IconButton
            icon={<FiEdit2 />}
            aria-label="Edit task"
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          />
        </Box>
      </Flex>
    </Box>
  )
})

TaskListItem.displayName = 'TaskListItem'

export default TaskListItem 
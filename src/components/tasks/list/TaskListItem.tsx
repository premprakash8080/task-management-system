import {
  Flex,
  Box,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  useColorModeValue,
  Badge,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { AiOutlineCheck } from 'react-icons/ai'
import { Task } from '../../../data/sampleData'
import { sampleData } from '../../../data/sampleData'

interface TaskListItemProps {
  task: Task
  onComplete?: (taskId: string) => void
  onProjectChange?: (taskId: string, projectId: string) => void
  onSectionChange?: (taskId: string, status: Task['status']) => void
  onTaskClick?: (taskId: string) => void
}

const TaskListItem = ({
  task,
  onComplete,
  onProjectChange,
  onSectionChange,
  onTaskClick,
}: TaskListItemProps) => {
  const bgHover = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const isCompleted = task.status === 'completed'

  const project = sampleData.projects.find(p => p.id === task.projectId)
  const taskTags = task.tags || []
  const tags = sampleData.tags.filter(t => taskTags.includes(t.id))

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click event from bubbling up when clicking menu items or checkbox
    if (
      (e.target as HTMLElement).closest('.chakra-menu__menu-button') ||
      (e.target as HTMLElement).closest('.chakra-checkbox')
    ) {
      return
    }
    onTaskClick?.(task.id)
  }

  return (
    <Flex
      px={3}
      py={2}
      borderBottom="1px solid"
      borderColor={borderColor}
      alignItems="center"
      bg={isCompleted ? 'gray.50' : 'white'}
      _hover={{ bg: bgHover }}
      transition="background 0.2s"
      cursor="pointer"
      onClick={handleClick}
    >
      <Box flex="0 0 40px">
        <Checkbox
          isChecked={isCompleted}
          colorScheme="green"
          onChange={() => onComplete?.(task.id)}
          size="md"
          variant="outline"
        />
      </Box>

      <Box flex={2} px={2}>
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            rightIcon={<ChevronDownIcon />}
            textAlign="left"
            px={2}
            h="auto"
            _hover={{ bg: 'transparent' }}
          >
            <Text
              fontSize="sm"
              textDecoration={isCompleted ? 'line-through' : 'none'}
              color={isCompleted ? 'gray.500' : 'inherit'}
            >
              {task.title}
            </Text>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => onSectionChange?.(task.id, 'todo')}>
              Move to To Do
            </MenuItem>
            <MenuItem onClick={() => onSectionChange?.(task.id, 'in-progress')}>
              Move to In Progress
            </MenuItem>
            <MenuItem onClick={() => onSectionChange?.(task.id, 'completed')}>
              Move to Completed
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <Box flex={1} px={2}>
        <Text fontSize="sm" color="gray.600">
          {task.dueDate}
        </Text>
      </Box>

      <Box w="200px" px={2}>
        <Menu>
          <MenuButton
            as={Button}
            size="sm"
            variant="outline"
            width="full"
            rightIcon={<ChevronDownIcon />}
          >
            <Text fontSize="sm" noOfLines={1}>
              {project?.title || 'No Project'}
            </Text>
          </MenuButton>
          <MenuList>
            {sampleData.projects.map(proj => (
              <MenuItem 
                key={proj.id}
                onClick={() => onProjectChange?.(task.id, proj.id)}
              >
                {proj.title}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>

      <Box w="120px" px={2}>
        {tags.length > 0 && (
          <HStack spacing={1} overflow="hidden">
            {tags.map(tag => (
              <Badge
                key={tag.id}
                colorScheme={tag.colorScheme}
                variant="subtle"
                fontSize="xs"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {tag.label}
              </Badge>
            ))}
          </HStack>
        )}
      </Box>
    </Flex>
  )
}

export default TaskListItem 
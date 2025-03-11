import {
  Flex,
  Box,
  Input,
  Button,
  useColorModeValue,
  HStack,
  IconButton,
  Collapse,
} from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { Task } from '../../../data/sampleData'

interface TaskListNewItemProps {
  onTaskCreate: (task: Partial<Task>) => void
  isCreating: boolean
  onStartCreating: () => void
  onCancelCreating: () => void
}

const TaskListNewItem = ({
  onTaskCreate,
  isCreating,
  onStartCreating,
  onCancelCreating,
}: TaskListNewItemProps) => {
  const [taskName, setTaskName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const bgHover = useColorModeValue('gray.50', 'gray.700')
  const placeholderColor = useColorModeValue('gray.500', 'gray.400')

  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isCreating])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (taskName.trim()) {
      onTaskCreate({
        title: taskName.trim(),
      })
      setTaskName('')
    }
  }

  if (!isCreating) {
    return (
      <Flex
        px={4}
        py={2}
        borderBottom="1px solid"
        borderColor={borderColor}
        alignItems="center"
        _hover={{ bg: bgHover }}
        transition="all 0.2s"
        cursor="pointer"
        onClick={onStartCreating}
        role="button"
        aria-label="Add new task"
      >
        <IconButton
          icon={<AiOutlinePlus />}
          aria-label="Add task"
          size="sm"
          variant="ghost"
          colorScheme="gray"
          mr={2}
        />
        <Box color={placeholderColor}>Add new task...</Box>
      </Flex>
    )
  }

  return (
    <Collapse in={isCreating} animateOpacity>
      <form onSubmit={handleSubmit}>
        <Flex
          px={4}
          py={2}
          borderBottom="1px solid"
          borderColor={borderColor}
          alignItems="center"
          bg={bgHover}
          transition="all 0.2s"
        >
          <IconButton
            icon={<AiOutlinePlus />}
            aria-label="Add task"
            size="sm"
            variant="ghost"
            colorScheme="gray"
            mr={2}
          />
          <Box flex={1} pr={4}>
            <Input
              ref={inputRef}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What needs to be done?"
              variant="unstyled"
              size="sm"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onCancelCreating()
                }
              }}
            />
          </Box>
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme="blue"
              type="submit"
              isDisabled={!taskName.trim()}
            >
              Add Task
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setTaskName('')
                onCancelCreating()
              }}
            >
              Cancel
            </Button>
          </HStack>
        </Flex>
      </form>
    </Collapse>
  )
}

export default TaskListNewItem 
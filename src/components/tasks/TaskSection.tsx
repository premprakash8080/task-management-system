import {
  Box,
  Flex,
  Heading,
  IconButton,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react'
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'
import TaskList, { Task } from './TaskList'

interface TaskSectionProps {
  title: string
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  defaultIsOpen?: boolean
  showCount?: boolean
}

const TaskSection = ({
  title,
  tasks,
  onTaskClick,
  defaultIsOpen = true,
  showCount = true,
}: TaskSectionProps) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen })

  return (
    <Box mb={6}>
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        cursor="pointer"
        onClick={onToggle}
      >
        <Heading size="md">
          {title} {showCount && `(${tasks.length})`}
        </Heading>
        <IconButton
          icon={isOpen ? <AiOutlineUp /> : <AiOutlineDown />}
          variant="ghost"
          aria-label={isOpen ? "Collapse section" : "Expand section"}
          size="sm"
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box bg="white" borderRadius="lg" boxShadow="sm">
          <TaskList
            tasks={tasks}
            onTaskClick={onTaskClick}
            showHeaders={true}
          />
        </Box>
      </Collapse>
    </Box>
  )
}

export default TaskSection 
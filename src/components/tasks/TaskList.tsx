import { Box, VStack, useColorModeValue, useMemo } from '@chakra-ui/react'
import TaskListHeader from './list/TaskListHeader'
import TaskListItem from './list/TaskListItem'
import { Task } from '../../store/initialData'

interface TaskListProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onTaskComplete?: (taskId: string | number) => void
  onTaskProjectChange?: (taskId: string | number, project: string) => void
  onTaskSectionChange?: (taskId: string | number, section: string) => void
}

const TaskList = ({
  tasks,
  onTaskComplete,
  onTaskProjectChange,
  onTaskSectionChange,
}: TaskListProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const task = useMemo(() => state.task, [state.task])

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
    >
      <TaskListHeader />
      <VStack spacing={0} align="stretch" divider={<Box borderColor={borderColor} />}>
        {tasks.map(task => (
          <TaskListItem
            key={task.id}
            task={task}
            onComplete={onTaskComplete}
            onProjectChange={onTaskProjectChange}
            onSectionChange={onTaskSectionChange}
          />
        ))}
      </VStack>
    </Box>
  )
}

export default TaskList 
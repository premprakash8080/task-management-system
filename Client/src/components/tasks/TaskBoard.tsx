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
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'

interface TaskBoardProps {
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

const columns = [
  { id: 'todo', title: 'To Do', color: 'gray.500' },
  { id: 'in-progress', title: 'In Progress', color: 'blue.500' },
  { id: 'completed', title: 'Done', color: 'green.500' },
] as const

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskClick,
  onTaskUpdate,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const columnBgColor = useColorModeValue('gray.50', 'gray.700')

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const task = tasks.find(t => t._id === draggableId)
    if (!task) return

    onTaskUpdate(task._id, {
      status: destination.droppableId as Task['status']
    })
  }

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <SimpleGrid columns={3} spacing={4} p={4}>
        {['todo', 'in_progress', 'completed'].map(status => (
          <Box key={status}>
            <Heading size="md" mb={4} textTransform="capitalize">
              {status.replace('_', ' ')}
            </Heading>
            <Droppable droppableId={status}>
              {(provided: DroppableProvided) => (
                <VStack
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  spacing={2}
                  align="stretch"
                  minH="200px"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  p={2}
                  borderRadius="md"
                >
                  {getTasksByStatus(status as Task['status']).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          p={3}
                          bg={useColorModeValue('white', 'gray.600')}
                          boxShadow="sm"
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => onTaskClick(task._id)}
                          _hover={{ boxShadow: 'md' }}
                          opacity={snapshot.isDragging ? 0.5 : 1}
                        >
                          <Text fontWeight="medium">{task.title}</Text>
                          {task.description && (
                            <Text fontSize="sm" color="gray.500" noOfLines={2}>
                              {task.description}
                            </Text>
                          )}
                          <Box mt={2}>
                            <Badge colorScheme={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}>
                              {task.priority}
                            </Badge>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </VStack>
              )}
            </Droppable>
          </Box>
        ))}
      </SimpleGrid>
    </DragDropContext>
  )
}

export default TaskBoard 
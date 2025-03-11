import {
  Box,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { Task, Tag } from '../../data/sampleData'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd'
import { sampleData } from '../../data/sampleData'

interface TaskBoardProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (task: Task) => void
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'gray.500' },
  { id: 'in-progress', title: 'In Progress', color: 'blue.500' },
  { id: 'completed', title: 'Done', color: 'green.500' },
] as const

const TaskBoard = ({ tasks, onTaskClick, onTaskUpdate }: TaskBoardProps) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const columnBgColor = useColorModeValue('gray.50', 'gray.700')

  // Group tasks by status
  const groupedTasks = columns.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id)
    return acc
  }, {} as Record<typeof columns[number]['id'], Task[]>)

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onTaskUpdate) return

    const { source, destination, draggableId } = result
    if (source.droppableId === destination.droppableId) return

    const task = tasks.find(t => t.id === draggableId)
    if (!task) return

    onTaskUpdate({
      ...task,
      status: destination.droppableId as Task['status']
    })
  }

  const getTaskTags = (task: Task): Tag[] => {
    return sampleData.tags.filter(tag => task.tags.includes(tag.id))
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <SimpleGrid columns={3} spacing={6}>
        {columns.map(column => (
          <Box key={column.id}>
            <Heading size="sm" mb={4} color={column.color}>
              {column.title} ({groupedTasks[column.id]?.length || 0})
            </Heading>
            <Droppable droppableId={column.id}>
              {(provided: DroppableProvided) => (
                <VStack
                  align="stretch"
                  spacing={3}
                  minH="200px"
                  bg={columnBgColor}
                  p={4}
                  borderRadius="lg"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {groupedTasks[column.id]?.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          bg={bgColor}
                          p={4}
                          borderRadius="md"
                          boxShadow="sm"
                          cursor="pointer"
                          onClick={() => onTaskClick(task.id)}
                          opacity={snapshot.isDragging ? 0.8 : 1}
                          _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                          transition="all 0.2s"
                        >
                          <Text fontWeight="medium" mb={2}>
                            {task.title}
                          </Text>
                          <Box>
                            {task.projectId && (
                              <Badge
                                colorScheme="blue"
                                mr={2}
                              >
                                {task.projectId}
                              </Badge>
                            )}
                            {getTaskTags(task).map(tag => (
                              <Badge
                                key={tag.id}
                                colorScheme={tag.colorScheme}
                                ml={2}
                              >
                                {tag.label}
                              </Badge>
                            ))}
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
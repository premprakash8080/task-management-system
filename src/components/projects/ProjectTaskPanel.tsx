import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
  Heading,
  HStack,
  Text,
  Badge,
  Icon,
} from '@chakra-ui/react'
import { Task, Project } from '../../data/sampleData'
import TaskList from '../tasks/list/TaskList'
import { AiOutlineProject } from 'react-icons/ai'
import { useMemo } from 'react'

interface ProjectTaskPanelProps {
  isOpen: boolean
  onClose: () => void
  project?: Project
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (task: Task) => void
  onTaskCreate: (task: Partial<Task>) => void
}

const ProjectTaskPanel = ({
  isOpen,
  onClose,
  project,
  tasks,
  onTaskClick,
  onTaskUpdate,
  onTaskCreate,
}: ProjectTaskPanelProps) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Filter tasks for this project
  const projectTasks = useMemo(() => {
    if (!project) return []
    return tasks.filter(task => task.projectId === project.id)
  }, [tasks, project])

  // Calculate project statistics
  const stats = useMemo(() => {
    const total = projectTasks.length
    const completed = projectTasks.filter(t => t.status === 'completed').length
    const inProgress = projectTasks.filter(t => t.status === 'in-progress').length
    const todo = projectTasks.filter(t => t.status === 'todo').length
    const progress = total ? Math.round((completed / total) * 100) : 0

    return { total, completed, inProgress, todo, progress }
  }, [projectTasks])

  if (!project) return null

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent bg={bgColor}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
          <HStack spacing={3}>
            <Box
              w="8"
              h="8"
              bg={project.color}
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={AiOutlineProject} color="white" boxSize={5} />
            </Box>
            <Box>
              <Heading size="md">{project.title}</Heading>
              <Text fontSize="sm" color="gray.500" mt={1}>
                {project.description}
              </Text>
            </Box>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={0}>
          {/* Project Stats */}
          <Box p={4} borderBottom="1px" borderColor={borderColor}>
            <HStack spacing={4}>
              <Badge colorScheme="green">
                {stats.progress}% Complete
              </Badge>
              <Text fontSize="sm" color="gray.500">
                {stats.completed} of {stats.total} tasks completed
              </Text>
            </HStack>
            <HStack mt={2} spacing={4}>
              <Badge colorScheme="blue">
                {stats.todo} To Do
              </Badge>
              <Badge colorScheme="orange">
                {stats.inProgress} In Progress
              </Badge>
              <Badge colorScheme="green">
                {stats.completed} Completed
              </Badge>
            </HStack>
          </Box>

          {/* Task List */}
          <Box p={4}>
            <TaskList
              tasks={projectTasks}
              onTaskClick={onTaskClick}
              onTaskUpdate={onTaskUpdate}
              onTaskCreate={(task) => onTaskCreate({ ...task, projectId: project.id })}
              onSectionUpdate={(oldName, newName) => {
                console.log('Section name updated:', oldName, newName)
              }}
            />
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default ProjectTaskPanel 
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  Badge,
  HStack,
  Center,
  Spinner,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'
import { Task, CreateTaskDto } from '../../types/task'
import { ProjectSection } from '../../types/project'
import TaskList from '../tasks/list/TaskList'
import { useEffect, useState } from 'react'
import { projectApi } from '../../services/api/project'
import { tasksApi } from '../../services/api/tasks'

interface ProjectTaskPanelProps {
  projectId: string
  isOpen: boolean
  onClose: () => void
  onTaskClick: (taskId: string) => void
}

interface ProjectStats {
  total: number
  completed: number
  todo: number
  inProgress: number
  progress: number
}

const ProjectTaskPanel = ({
  projectId,
  isOpen,
  onClose,
  onTaskClick,
}: ProjectTaskPanelProps) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [sections, setSections] = useState<ProjectSection[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [stats, setStats] = useState<ProjectStats>({
    total: 0,
    completed: 0,
    todo: 0,
    inProgress: 0,
    progress: 0,
  })
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    if (isOpen && projectId) {
      loadProjectData()
    }
  }, [isOpen, projectId])

  const loadProjectData = async () => {
    setIsLoadingTasks(true)
    try {
      const [projectData, tasksData] = await Promise.all([
        projectApi.getProject(projectId),
        projectApi.getProjectTasks(projectId),
      ])

      setTasks(tasksData)
      setSections(projectData.sections)

      // Calculate stats
      const total = tasksData.length
      const completed = tasksData.filter((task: Task) => task.status === 'completed').length
      const inProgress = tasksData.filter((task: Task) => task.status === 'in_progress').length
      const todo = tasksData.filter((task: Task) => task.status === 'todo').length
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0

      setStats({ total, completed, todo, inProgress, progress })
    } catch (error) {
      console.error('Failed to load project data:', error)
      toast({
        title: 'Error loading project data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoadingTasks(false)
    }
  }

  const handleTaskUpdate = async (task: Task) => {
    try {
      await tasksApi.updateTask(task.id, task)
      setTasks(prev => prev.map(t => t.id === task.id ? task : t))
      loadProjectData() // Refresh stats
    } catch (error) {
      console.error('Failed to update task:', error)
      toast({
        title: 'Error updating task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleTaskCreate = async (task: CreateTaskDto) => {
    try {
      const newTask = await tasksApi.createTask({ ...task, projectId })
      setTasks(prev => [...prev, newTask])
      loadProjectData() // Refresh stats
    } catch (error) {
      console.error('Failed to create task:', error)
      toast({
        title: 'Error creating task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleSectionUpdate = async (sectionId: string, title: string) => {
    try {
      const updatedProject = await projectApi.updateSection(projectId, sectionId, title)
      setSections(updatedProject.sections)
    } catch (error) {
      console.error('Failed to update section:', error)
      toast({
        title: 'Error updating section',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleSectionCreate = async (title: string) => {
    try {
      const updatedProject = await projectApi.createSection(projectId, title)
      setSections(updatedProject.sections)
    } catch (error) {
      console.error('Failed to create section:', error)
      toast({
        title: 'Error creating section',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleSectionReorder = async (sectionIds: string[]) => {
    try {
      const updatedProject = await projectApi.reorderSections(projectId, sectionIds)
      setSections(updatedProject.sections)
    } catch (error) {
      console.error('Failed to reorder sections:', error)
      toast({
        title: 'Error reordering sections',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (!projectId) return null

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
        <DrawerHeader>Project Tasks</DrawerHeader>

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
            {isLoadingTasks ? (
              <Center py={8}>
                <Spinner size="lg" color="blue.500" />
              </Center>
            ) : (
              <TaskList
                tasks={tasks}
                sections={sections}
                onTaskClick={onTaskClick}
                onTaskUpdate={handleTaskUpdate}
                onTaskCreate={handleTaskCreate}
                onTaskComplete={(taskId) => {
                  const task = tasks.find(t => t.id === taskId)
                  if (task) {
                    handleTaskUpdate({
                      ...task,
                      status: task.status === 'completed' ? 'todo' : 'completed'
                    })
                  }
                }}
                onTaskProjectChange={(taskId, projectId) => {
                  const task = tasks.find(t => t.id === taskId)
                  if (task) {
                    handleTaskUpdate({
                      ...task,
                      projectId
                    })
                  }
                }}
                onTaskSectionChange={(taskId, sectionId) => {
                  const task = tasks.find(t => t.id === taskId)
                  if (task) {
                    handleTaskUpdate({
                      ...task,
                      sectionId
                    })
                  }
                }}
                onSectionUpdate={handleSectionUpdate}
                onSectionCreate={handleSectionCreate}
                onSectionReorder={handleSectionReorder}
              />
            )}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default ProjectTaskPanel 
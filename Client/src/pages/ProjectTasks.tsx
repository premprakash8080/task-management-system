import {
  Box,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  Button,
  useToast,
} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PageLayout } from '../components/layout/PageLayout'
import TaskDetails from '../components/tasks/TaskDetails'
import TaskContainer from '../components/tasks/TaskContainer'
import TasksHeader from '../components/tasks/header/TasksHeader'
import { TasksProvider, useTasksContext } from '../components/tasks/TasksProvider'
import projectsApi from '../services/api/projects'
import tasksApi from '../services/api/tasks'
import { Task, TaskStatus, TaskPriority, CreateTaskDto } from '../types/task'
import { Project, ProjectSection } from '../types/project'

const ProjectTasksContent = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const {
    currentView,
    currentTab,
    selectedTaskId,
    isModalOpen,
    setCurrentView,
    setCurrentTab,
    handleTaskComplete,
    handleTaskUpdate,
    handleTaskCreate,
    setIsModalOpen,
    setSelectedTaskId,
  } = useTasksContext()

  // Fetch project data
  const { data: project, isLoading: isLoadingProject } = useQuery<Project>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID is required');
      return projectsApi.getProjectById(projectId);
    },
    enabled: !!projectId,
  })

  // Fetch project tasks
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      try {
        const result = await projectsApi.getProjectTasks(projectId);
        console.log('Fetched tasks:', result);
        return Array.isArray(result) ? result : [];
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    },
    enabled: !!projectId,
  })

  if (!projectId) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          <Text>Invalid project ID. Please select a valid project.</Text>
        </Alert>
        <Button mt={4} onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Box>
    )
  }

  if (isLoadingProject || isLoadingTasks) {
    return (
      <Box p={8} display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
        <Text ml={4}>Loading project data...</Text>
      </Box>
    )
  }

  if (!project) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          <Text>Project not found.</Text>
        </Alert>
        <Button mt={4} onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </Box>
    )
  }

  // Handle task click
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsModalOpen(true)
  }

  // Handle task update
  const handleTaskUpdateWrapper = async (updatedTask: Task) => {
    try {
      // Update task in the backend
      await tasksApi.updateTask(updatedTask.id, updatedTask)
      // Update local state
      handleTaskUpdate(updatedTask)
      if (updatedTask.id !== selectedTaskId) {
        setSelectedTaskId(updatedTask.id)
      }
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

  // Handle task create
  const handleTaskCreateWrapper = async (task: CreateTaskDto) => {
    try {
      // Ensure required fields are present
      if (!task.title?.trim()) {
        throw new Error('Task title is required');
      }

      const newTask: CreateTaskDto = {
        title: task.title.trim(),
        description: task.description || '',
        projectId,
        sectionId: task.sectionId,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate,
      }

      // Create task in the backend
      const createdTask = await tasksApi.createTask(newTask)
      // Update local state
      handleTaskCreate(createdTask)
    } catch (error) {
      console.error('Failed to create task:', error)
      toast({
        title: 'Error creating task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      throw error;
    }
  }

  // Handle section update
  const handleSectionUpdate = async (sectionId: string, title: string) => {
    try {
      await projectsApi.updateSection(projectId, sectionId, title)
      // Invalidate project query to refresh data
      queryClient.invalidateQueries(['project', projectId])
      toast({
        title: 'Section updated',
        status: 'success',
        duration: 2000,
      })
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

  // Handle section create
  const handleSectionCreate = async (title: string) => {
    try {
      await projectsApi.createSection(projectId, title)
      // Invalidate project query to refresh data
      queryClient.invalidateQueries(['project', projectId])
      toast({
        title: 'Section created',
        status: 'success',
        duration: 2000,
      })
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

  return (
    <Box h="100%" p={6}>
      <TasksHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      <TaskContainer
        tasks={tasks}
        sections={project.sections}
        onTaskClick={handleTaskClick}
        onTaskUpdate={handleTaskUpdateWrapper}
        onTaskCreate={handleTaskCreateWrapper}
        onSectionUpdate={handleSectionUpdate}
        onSectionCreate={handleSectionCreate}
        currentView={currentView}
      />

      {selectedTaskId && (
        <TaskDetails
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTaskId(null)
          }}
          taskId={selectedTaskId}
          onTaskComplete={handleTaskComplete}
          onTaskUpdate={handleTaskUpdateWrapper}
        />
      )}
    </Box>
  )
}

export default function ProjectTasks() {
  return (
    <PageLayout>
      <TasksProvider initialTasks={[]}>
        <ProjectTasksContent />
      </TasksProvider>
    </PageLayout>
  )
} 
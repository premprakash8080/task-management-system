import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Stack,
  VStack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { sampleData } from '../data/sampleData'
import TaskCard from '../components/tasks/TaskCard'
import TasksDueSoon from '../components/tasks/TasksDueSoon'
import TaskDetails from '../components/tasks/TaskDetails'
import { useState } from 'react'
import { Task } from '../data/sampleData'
import { PageLayout } from '../components/layout/PageLayout'
import { useAuth } from '../store/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Calculate statistics
  const totalTasks = sampleData.tasks.length
  const completedTasks = sampleData.tasks.filter(task => task.status === 'completed').length
  const inProgressTasks = sampleData.tasks.filter(task => task.status === 'in-progress').length
  const dueTodayTasks = sampleData.tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0]
    return task.dueDate === today
  }).length

  // Get recent tasks
  const recentTasks = sampleData.tasks
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3)
    .map(task => ({
      id: task.id,
      title: task.title,
      project: {
        name: sampleData.projects.find(p => p.id === task.projectId)?.title || '',
        color: sampleData.projects.find(p => p.id === task.projectId)?.color || 'gray.500',
      },
      dueDate: task.dueDate,
      isCompleted: task.status === 'completed',
    }))

  // Get tasks due soon
  const tasksDueSoon = sampleData.tasks
    .filter(task => task.status !== 'completed')
    .map(task => ({
      id: task.id,
      title: task.title,
      project: {
        name: sampleData.projects.find(p => p.id === task.projectId)?.title || '',
        color: sampleData.projects.find(p => p.id === task.projectId)?.color || 'gray.500',
      },
      dueDate: task.dueDate,
      isCompleted: task.status === 'completed',
    }))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const handleTaskClick = (taskId: string) => {
    const task = Object.values(sampleData.tasks).find(t => t.id === taskId)
    if (task) {
      setSelectedTask(task)
      onOpen()
    }
  }

  const handleTaskComplete = (taskId: string) => {
    // Handle task completion logic here
    console.log('Task completed:', taskId)
  }

  return (
    <PageLayout>
      <Heading fontSize="xl" mb={6}>
        Welcome Back, {user?.fullName || 'User'}!
      </Heading>
      
      {/* Overview Stats */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Total Tasks
                </Text>
              </StatLabel>
              <StatNumber>
                <Text fontSize="lg" fontWeight="semibold">
                  {totalTasks}
                </Text>
              </StatNumber>
              <StatHelpText>
                <Text fontSize="sm">
                  {completedTasks} completed
                </Text>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Due Today
                </Text>
              </StatLabel>
              <StatNumber>
                <Text fontSize="lg" fontWeight="semibold">
                  {dueTodayTasks}
                </Text>
              </StatNumber>
              <StatHelpText>
                <Text fontSize="sm">
                  Tasks to complete
                </Text>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  In Progress
                </Text>
              </StatLabel>
              <StatNumber>
                <Text fontSize="lg" fontWeight="semibold">
                  {inProgressTasks}
                </Text>
              </StatNumber>
              <StatHelpText>
                <Text fontSize="sm">
                  Active tasks
                </Text>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Projects
                </Text>
              </StatLabel>
              <StatNumber>
                <Text fontSize="lg" fontWeight="semibold">
                  {sampleData.projects.length}
                </Text>
              </StatNumber>
              <StatHelpText>
                <Text fontSize="sm">
                  Active projects
                </Text>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Tasks Sections */}
      <VStack spacing={6} align="stretch">
        {/* Recent Tasks Section */}
        <Card>
          <CardBody>
            <Heading fontSize="xl" mb={4}>Recent Tasks</Heading>
            <TasksDueSoon 
              tasks={recentTasks} 
              showHeader={false} 
              onTaskClick={handleTaskClick}
            />
          </CardBody>
        </Card>

        {/* Tasks Due Soon Section */}
        <Card>
          <CardBody>
            <Heading fontSize="xl" mb={4}>Tasks Due Soon</Heading>
            <TasksDueSoon 
              tasks={tasksDueSoon} 
              showHeader={false} 
              onTaskClick={handleTaskClick}
            />
          </CardBody>
        </Card>
      </VStack>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetails
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setSelectedTask(null);
          }}
          taskId={selectedTask.id}
          onTaskComplete={handleTaskComplete}
          onTaskUpdate={(updatedTask) => {
            // Handle task update if needed
            console.log('Task updated:', updatedTask);
          }}
        />
      )}
    </PageLayout>
  )
} 
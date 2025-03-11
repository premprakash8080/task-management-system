import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Progress,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react'

interface Goal {
  id: string
  title: string
  description: string
  progress: number
  status: 'on-track' | 'at-risk' | 'behind'
  dueDate: string
}

const goals: Goal[] = [
  {
    id: '1',
    title: 'Increase Customer Satisfaction',
    description: 'Achieve a customer satisfaction score of 95% by Q4',
    progress: 75,
    status: 'on-track',
    dueDate: '2024-12-31',
  },
  {
    id: '2',
    title: 'Launch Mobile App',
    description: 'Complete development and launch mobile app in App Store',
    progress: 45,
    status: 'at-risk',
    dueDate: '2024-06-30',
  },
  {
    id: '3',
    title: 'Expand Market Presence',
    description: 'Enter 3 new markets in the APAC region',
    progress: 20,
    status: 'behind',
    dueDate: '2024-09-30',
  },
]

const getStatusColor = (status: Goal['status']) => {
  switch (status) {
    case 'on-track':
      return 'green'
    case 'at-risk':
      return 'yellow'
    case 'behind':
      return 'red'
    default:
      return 'gray'
  }
}

export default function Goals() {
  return (
    <Box p={6}>
      <Heading fontSize="xl" mb={6}>
        Goals & Objectives
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {goals.map(goal => (
          <Card key={goal.id}>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading fontSize="xl">
                  {goal.title}
                </Heading>
                
                <Text variant="task-item">
                  {goal.description}
                </Text>

                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text variant="task-item" fontWeight="medium">
                      Progress
                    </Text>
                    <Text variant="task-item">
                      {goal.progress}%
                    </Text>
                  </HStack>
                  <Progress value={goal.progress} colorScheme={getStatusColor(goal.status)} />
                </Box>

                <HStack justify="space-between">
                  <Badge colorScheme={getStatusColor(goal.status)}>
                    {goal.status}
                  </Badge>
                  <Text variant="task-item" color="gray.600">
                    Due {new Date(goal.dueDate).toLocaleDateString()}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  )
} 
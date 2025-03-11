import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
} from '@chakra-ui/react'

interface Portfolio {
  id: string
  title: string
  description: string
  progress: number
  status: 'active' | 'on-hold' | 'completed'
  taskCount: number
  teamSize: number
}

const portfolios: Portfolio[] = [
  {
    id: '1',
    title: 'Digital Transformation',
    description: 'Enterprise-wide digital transformation initiatives',
    progress: 65,
    status: 'active',
    taskCount: 124,
    teamSize: 15,
  },
  {
    id: '2',
    title: 'Product Launch 2024',
    description: 'New product line launch for Q2 2024',
    progress: 45,
    status: 'active',
    taskCount: 89,
    teamSize: 8,
  },
  {
    id: '3',
    title: 'Infrastructure Upgrade',
    description: 'Legacy system modernization project',
    progress: 30,
    status: 'on-hold',
    taskCount: 56,
    teamSize: 12,
  },
]

const getStatusColor = (status: Portfolio['status']) => {
  switch (status) {
    case 'active':
      return 'green'
    case 'on-hold':
      return 'yellow'
    case 'completed':
      return 'blue'
    default:
      return 'gray'
  }
}

export default function Portfolios() {
  return (
    <Box p={6}>
      <Heading fontSize="xl" mb={6}>
        Portfolios
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {portfolios.map(portfolio => (
          <Card key={portfolio.id}>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading fontSize="xl">
                  {portfolio.title}
                </Heading>
                
                <Text variant="task-item">
                  {portfolio.description}
                </Text>

                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text variant="task-item" fontWeight="medium">
                      Progress
                    </Text>
                    <Text variant="task-item">
                      {portfolio.progress}%
                    </Text>
                  </HStack>
                  <Progress value={portfolio.progress} colorScheme={getStatusColor(portfolio.status)} />
                </Box>

                <HStack justify="space-between">
                  <Badge colorScheme={getStatusColor(portfolio.status)}>
                    {portfolio.status}
                  </Badge>
                  <HStack spacing={4}>
                    <Text variant="task-item" color="gray.600">
                      {portfolio.taskCount} tasks
                    </Text>
                    <Text variant="task-item" color="gray.600">
                      {portfolio.teamSize} members
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  )
} 
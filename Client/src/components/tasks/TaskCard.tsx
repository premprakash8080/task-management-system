import {
  Box,
  Flex,
  Text,
  Badge,
  Icon,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from '@chakra-ui/react'
import {
  AiOutlineLike,
  AiOutlineMessage,
  AiOutlineMore,
  AiOutlineCheckCircle,
} from 'react-icons/ai'

interface Tag {
  label: string
  colorScheme: string
}

interface TaskCardProps {
  title: string
  dueDate: string
  project: {
    name: string
    color: string
  }
  tags: Tag[]
  commentsCount: number
  likesCount: number
  status: 'todo' | 'in-progress' | 'completed'
  onOpenDetails?: () => void
}

const TaskCard = ({
  title,
  dueDate,
  project,
  tags,
  commentsCount,
  likesCount,
  status,
  onOpenDetails,
}: TaskCardProps) => {
  return (
    <Box
      p={4}
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      _hover={{ boxShadow: 'md' }}
      cursor="pointer"
      onClick={onOpenDetails}
    >
      <Flex justify="space-between" align="start" mb={3}>
        <Box>
          <Text fontWeight="medium" mb={2}>
            {title}
          </Text>
          <HStack spacing={2} mb={3}>
            <Flex align="center">
              <Box w={2} h={2} borderRadius="full" bg={project.color} mr={2} />
              <Text fontSize="sm" color="gray.600">
                {project.name}
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.500">
              Due {dueDate}
            </Text>
          </HStack>
          <HStack spacing={2}>
            {tags.map((tag, index) => (
              <Badge key={index} colorScheme={tag.colorScheme} fontSize="xs">
                {tag.label}
              </Badge>
            ))}
          </HStack>
        </Box>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Icon as={AiOutlineMore} />}
            variant="ghost"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          />
          <MenuList>
            <MenuItem>Edit Task</MenuItem>
            <MenuItem>Move to Project</MenuItem>
            <MenuItem color="red.500">Delete Task</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          <Flex align="center" color="gray.500">
            <Icon as={AiOutlineLike} mr={1} />
            <Text fontSize="sm">{likesCount}</Text>
          </Flex>
          <Flex align="center" color="gray.500">
            <Icon as={AiOutlineMessage} mr={1} />
            <Text fontSize="sm">{commentsCount}</Text>
          </Flex>
        </HStack>
        <Badge
          colorScheme={
            status === 'completed'
              ? 'green'
              : status === 'in-progress'
              ? 'orange'
              : 'gray'
          }
        >
          {status}
        </Badge>
      </Flex>
    </Box>
  )
}

export default TaskCard 
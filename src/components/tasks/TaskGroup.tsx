import {
  Box,
  Flex,
  Text,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  VStack,
} from '@chakra-ui/react'
import { AiOutlinePlus } from 'react-icons/ai'
import TaskCard from './TaskCard'

interface TaskGroupProps {
  title: string
  tasksCount: number
  tasks: Array<any> // Replace with proper task type
  onAddTask?: (task: string) => void
}

const TaskGroup = ({ title, tasksCount, tasks, onAddTask }: TaskGroupProps) => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      <AccordionItem border="none">
        <AccordionButton
          px={4}
          py={3}
          _hover={{ bg: 'gray.50' }}
          borderRadius="md"
        >
          <Box flex="1">
            <Flex align="center" justify="space-between">
              <Text fontWeight="medium">{title}</Text>
              <Text fontSize="sm" color="gray.500">
                {tasksCount} tasks
              </Text>
            </Flex>
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          <VStack spacing={4} align="stretch">
            {tasks.map((task, index) => (
              <TaskCard key={index} {...task} />
            ))}

            {/* Add Task Input */}
            <Box>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={AiOutlinePlus} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Add a task..."
                  variant="filled"
                  bg="white"
                  _hover={{ bg: 'gray.50' }}
                  _focus={{ bg: 'white', borderColor: 'blue.500' }}
                />
              </InputGroup>
            </Box>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default TaskGroup 
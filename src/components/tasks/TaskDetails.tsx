import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Textarea,
  Input,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  VStack,
  HStack,
  Tooltip,
  useToast,
  Badge,
  Icon,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Grid,
  GridItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Task, Tag, Project, User } from '../../data/sampleData';
import RightSidebar from '../layout/RightSidebar';
import { sampleData } from '../../data/sampleData';
import {
  AiOutlineCheck,
  AiOutlineHeart,
  AiOutlinePaperClip,
  AiOutlinePlus,
  AiOutlineCopy,
  AiOutlineMore,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineFolder,
  AiOutlineTag,
  AiOutlineClockCircle,
  AiOutlineMessage,
  AiOutlineDownload,
} from 'react-icons/ai';

interface Comment {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
}

interface TaskDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  onTaskComplete?: (taskId: string) => void;
  onTaskUpdate?: (task: Task) => void;
}

interface TaskDetailsState {
  task: Task | null;
  loading: boolean;
  error: string | null;
}

// Cache for task data
const taskCache = new Map<string, { data: Task; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

const TaskDetails = ({ isOpen, onClose, taskId, onTaskComplete, onTaskUpdate }: TaskDetailsProps) => {
  // State hooks - keep these at the top
  const [state, setState] = useState<TaskDetailsState>({
    task: null,
    loading: false,
    error: null,
  });
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [comment, setComment] = useState('');

  // UI hooks
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Memoized values
  const task = useMemo(() => state.task, [state.task]);
  
  const { project, assignee, taskTags } = useMemo(() => {
    if (!task) {
      return { project: null, assignee: null, taskTags: [] };
    }

    const taskTags = task.tags 
      ? sampleData.tags.filter(tag => task.tags?.includes(tag.id)) 
      : [];

    return {
      project: task.projectId ? sampleData.projects.find(p => p.id === task.projectId) : null,
      assignee: task.assigneeId ? sampleData.users.find(u => u.id === task.assigneeId) : null,
      taskTags,
    };
  }, [task]);

  // Callbacks
  const fetchTaskDetails = useCallback(async () => {
    const cached = taskCache.get(taskId);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      setState({
        task: cached.data,
        loading: false,
        error: null,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const task = sampleData.tasks.find(t => t.id === taskId);

      if (!task) {
        throw new Error('Task not found');
      }

      taskCache.set(taskId, {
        data: task,
        timestamp: now,
      });

      setState({
        task,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        task: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch task details',
      });
      toast({
        title: 'Error',
        description: 'Failed to load task details',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [taskId, toast]);

  const handleCompleteTask = useCallback(async () => {
    if (!task) return;

    try {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      const updatedTask = { ...task, status: newStatus as Task['status'] };

      setState(prev => ({ ...prev, task: updatedTask }));
      
      taskCache.set(taskId, {
        data: updatedTask,
        timestamp: Date.now(),
      });

      onTaskComplete?.(taskId);

      toast({
        title: newStatus === 'completed' ? 'Task Completed' : 'Task Reopened',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setState(prev => ({ ...prev, task }));
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [task, taskId, onTaskComplete, toast]);

  const handleTaskUpdate = useCallback(async (updates: Partial<Task>) => {
    if (!task) return;

    try {
      const updatedTask = { ...task, ...updates };

      setState(prev => ({ ...prev, task: updatedTask }));
      
      taskCache.set(taskId, {
        data: updatedTask,
        timestamp: Date.now(),
      });

      onTaskUpdate?.(updatedTask);

      toast({
        title: 'Success',
        description: 'Task updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      setState(prev => ({ ...prev, task }));
      toast({
        title: 'Error',
        description: 'Failed to update task',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [task, taskId, onTaskUpdate, toast]);

  // Effects
  useEffect(() => {
    if (taskId && isOpen) {
      fetchTaskDetails();
    }
  }, [taskId, isOpen, fetchTaskDetails]);

  useEffect(() => {
    if (task) {
      setTaskName(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate || '');
    }
  }, [task]);

  // Memoized header content
  const headerContent = useMemo(() => {
    if (!task) return null;
    
    return (
      <HStack justify="space-between" w="full">
        <HStack spacing={4}>
          <Button
            colorScheme={task.status === 'completed' ? 'gray' : 'green'}
            leftIcon={
              <Icon 
                as={AiOutlineCheck}
                boxSize={4}
                color="current"
              />
            }
            onClick={handleCompleteTask}
            variant={task.status === 'completed' ? 'outline' : 'solid'}
            size="sm"
          >
            {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
          <Badge
            colorScheme={task.status === 'completed' ? 'green' : task.status === 'in-progress' ? 'blue' : 'gray'}
            variant="subtle"
            px={3}
            py={1}
            borderRadius="full"
          >
            {task.status}
          </Badge>
        </HStack>
        <Menu>
          <MenuButton as={IconButton} icon={<Icon as={AiOutlineMore} />} aria-label="More Actions" variant="ghost" size="sm" />
          <MenuList>
            <MenuItem>Move to Trash</MenuItem>
            <MenuItem>Duplicate Task</MenuItem>
            <MenuItem>Print Task</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    );
  }, [task, handleCompleteTask]);

  if (!task) return null;

  return (
    <RightSidebar
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Input
          fontSize="xl"
          fontWeight="bold"
          variant="unstyled"
          value={taskName}
          onChange={(e) => {
            setTaskName(e.target.value);
            handleTaskUpdate({ title: e.target.value });
          }}
          placeholder="Task title"
          size="lg"
          _placeholder={{ color: 'gray.400' }}
        />
      }
      headerContent={headerContent}
      width={isMobile ? "100%" : "50%"}
    >
      <Box p={6}>
        <VStack align="stretch" spacing={6}>
          {/* Due Date */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>Due Date</Text>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                leftIcon={<Icon as={AiOutlineCalendar} />}
                w="full"
                justifyContent="flex-start"
                bg="white"
                h="40px"
                _hover={{ bg: 'gray.50' }}
              >
                {dueDate || 'Set due date'}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleTaskUpdate({ dueDate: 'Tomorrow' })}>Tomorrow</MenuItem>
                <MenuItem onClick={() => handleTaskUpdate({ dueDate: 'Next Week' })}>Next Week</MenuItem>
                <MenuItem onClick={() => handleTaskUpdate({ dueDate: 'No Due Date' })}>No Due Date</MenuItem>
              </MenuList>
            </Menu>
          </Box>

          {/* Assignee */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>Assignee</Text>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                leftIcon={<Icon as={AiOutlineUser} />}
                w="full"
                justifyContent="flex-start"
                bg="white"
                h="40px"
                _hover={{ bg: 'gray.50' }}
              >
                <HStack>
                  {assignee && <Avatar size="xs" src={assignee.avatar} />}
                  <Text>{assignee?.name || 'Unassigned'}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                {sampleData.users.map(user => (
                  <MenuItem
                    key={user.id}
                    onClick={() => handleTaskUpdate({ assigneeId: user.id })}
                  >
                    <HStack>
                      <Avatar size="xs" src={user.avatar} />
                      <Text>{user.name}</Text>
                    </HStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>

          {/* Project */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>Project</Text>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                leftIcon={<Icon as={AiOutlineFolder} />}
                w="full"
                justifyContent="flex-start"
                bg="white"
                h="40px"
                _hover={{ bg: 'gray.50' }}
              >
                <HStack>
                  {project && <Box w={2} h={2} borderRadius="full" bg={project.color} />}
                  <Text>{project?.title || 'No Project'}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                {sampleData.projects.map(proj => (
                  <MenuItem
                    key={proj.id}
                    onClick={() => handleTaskUpdate({ projectId: proj.id })}
                  >
                    <HStack>
                      <Box w={2} h={2} borderRadius="full" bg={proj.color} />
                      <Text>{proj.title}</Text>
                    </HStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>

          {/* Tags */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>Tags</Text>
            <HStack spacing={2} flexWrap="wrap">
              {taskTags.map(tag => (
                <Badge
                  key={tag.id}
                  colorScheme={tag.colorScheme}
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {tag.label}
                </Badge>
              ))}
              <IconButton
                aria-label="Add tag"
                icon={<Icon as={AiOutlineTag} />}
                size="sm"
                variant="ghost"
                _hover={{ bg: 'gray.100' }}
              />
            </HStack>
          </Box>

          {/* Description */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>Description</Text>
            <Textarea
              placeholder="Add more detail to this task..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                handleTaskUpdate({ description: e.target.value });
              }}
              minH="120px"
              variant="filled"
              bg="gray.50"
              _hover={{ bg: 'gray.100' }}
              _focus={{ bg: 'white', borderColor: 'blue.500' }}
              p={4}
              fontSize="sm"
            />
          </Box>

          {/* Attachments */}
          <Box>
            <HStack justify="space-between" mb={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">Attachments</Text>
              <Button 
                leftIcon={<Icon as={AiOutlinePaperClip} />}
                variant="ghost" 
                size="sm"
                _hover={{ bg: 'gray.100' }}
              >
                Add Files
              </Button>
            </HStack>
            <VStack align="stretch" spacing={2}>
              {task.attachments.map((attachment, index) => (
                <HStack
                  key={index}
                  p={3}
                  bg="gray.50"
                  borderRadius="md"
                  _hover={{ bg: 'gray.100' }}
                  transition="all 0.2s"
                >
                  <Icon as={AiOutlinePaperClip} color="gray.500" />
                  <Text fontSize="sm" flex={1}>{attachment.name}</Text>
                  <Text fontSize="xs" color="gray.500" mr={2}>
                    {Math.round(attachment.size / 1024)} KB
                  </Text>
                  <IconButton
                    aria-label="Download file"
                    icon={<Icon as={AiOutlineDownload} />}
                    size="sm"
                    variant="ghost"
                    _hover={{ bg: 'gray.200' }}
                  />
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* Comments */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={4}>Comments</Text>
            <VStack align="stretch" spacing={4}>
              {task.comments?.map((comment, index) => {
                const user = sampleData.users.find(u => u.id === comment.userId);
                return (
                  <Box key={index} p={4} bg="gray.50" borderRadius="lg">
                    <HStack mb={2} justify="space-between">
                      <HStack>
                        <Avatar size="sm" src={user?.avatar} />
                        <Box>
                          <Text fontSize="sm" fontWeight="medium">{user?.name}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </Box>
                      </HStack>
                      <IconButton
                        aria-label="More options"
                        icon={<Icon as={AiOutlineMore} />}
                        size="sm"
                        variant="ghost"
                        _hover={{ bg: 'gray.200' }}
                      />
                    </HStack>
                    <Text fontSize="sm" color="gray.700">{comment.text}</Text>
                  </Box>
                );
              })}
              <Box>
                <Textarea
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  size="sm"
                  variant="filled"
                  bg="gray.50"
                  _hover={{ bg: 'gray.100' }}
                  _focus={{ bg: 'white', borderColor: 'blue.500' }}
                  mb={2}
                  p={4}
                  minH="80px"
                />
                <Button 
                  size="sm" 
                  colorScheme="blue"
                  leftIcon={<Icon as={AiOutlineMessage} />}
                >
                  Comment
                </Button>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </RightSidebar>
  );
};

export default React.memo(TaskDetails); 
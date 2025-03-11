import React from 'react';
import { Box, Text, Badge, VStack, HStack } from '@chakra-ui/react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  index: number;
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'green';
    default:
      return 'gray';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          bg={snapshot.isDragging ? 'gray.100' : 'white'}
          p={4}
          mb={2}
          borderRadius="md"
          boxShadow="sm"
          border="1px"
          borderColor="gray.200"
          _hover={{ boxShadow: 'md' }}
        >
          <VStack align="stretch" spacing={2}>
            <Text fontWeight="bold">{task.title}</Text>
            {task.description && (
              <Text fontSize="sm" color="gray.600">
                {task.description}
              </Text>
            )}
            <HStack spacing={2}>
              <Badge colorScheme={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              {task.dueDate && (
                <Badge colorScheme="blue">
                  {new Date(task.dueDate).toLocaleDateString()}
                </Badge>
              )}
            </HStack>
          </VStack>
        </Box>
      )}
    </Draggable>
  );
};

export default TaskCard; 
import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Task, Column as ColumnType } from '../types/task';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ column, tasks }) => {
  return (
    <Box
      width="300px"
      bg="gray.50"
      p={4}
      borderRadius="lg"
      minH="500px"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        {column.title}
      </Text>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            minH="400px"
            bg={snapshot.isDraggingOver ? 'gray.100' : 'gray.50'}
            borderRadius="md"
            p={2}
          >
            <VStack spacing={2} align="stretch">
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
            </VStack>
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
};

export default Column; 
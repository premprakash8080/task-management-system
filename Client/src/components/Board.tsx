import React, { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Box, Flex } from '@chakra-ui/react';
import Column from './Column';
import initialData from '../store/initialData';
import { Board as BoardType } from '../types/task';

const Board: React.FC = () => {
  const [board, setBoard] = useState<BoardType>(initialData);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = board.columns[source.droppableId];
    const destinationColumn = board.columns[destination.droppableId];

    if (sourceColumn === destinationColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      setBoard({
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    // Moving between columns
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };

    const destinationTaskIds = Array.from(destinationColumn.taskIds);
    destinationTaskIds.splice(destination.index, 0, draggableId);
    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: destinationTaskIds,
    };

    setBoard({
      ...board,
      columns: {
        ...board.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn,
      },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex gap={8} p={8}>
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          const tasks = column.taskIds.map((taskId) => board.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </Flex>
    </DragDropContext>
  );
};

export default Board; 
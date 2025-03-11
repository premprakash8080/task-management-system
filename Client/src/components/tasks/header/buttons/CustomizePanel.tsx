import {
  VStack,
  HStack,
  Text,
  Switch,
  Box,
  useColorModeValue,
} from '@chakra-ui/react'
import { DragHandleIcon } from '@chakra-ui/icons'
import RightSidebar from '../../../layout/RightSidebar'
import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

interface CustomizePanelProps {
  isOpen: boolean
  onClose: () => void
}

interface CustomizeOption {
  id: string
  label: string
  enabled: boolean
}

const CustomizePanel = ({ isOpen, onClose }: CustomizePanelProps) => {
  const [options, setOptions] = useState<CustomizeOption[]>([
    { id: 'dueDate', label: 'Due Date', enabled: true },
    { id: 'project', label: 'Project', enabled: true },
    { id: 'tags', label: 'Tags', enabled: true },
    { id: 'priority', label: 'Priority', enabled: true },
    { id: 'assignee', label: 'Assignee', enabled: true },
    { id: 'status', label: 'Status', enabled: true },
  ])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(options)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setOptions(items)
  }

  const handleToggle = (id: string) => {
    setOptions(prev =>
      prev.map(option =>
        option.id === id
          ? { ...option, enabled: !option.enabled }
          : option
      )
    )
  }

  const itemBg = useColorModeValue('gray.50', 'gray.700')
  const itemBgHover = useColorModeValue('gray.100', 'gray.600')

  return (
    <RightSidebar
      isOpen={isOpen}
      onClose={onClose}
      title="Customize View"
      width="400px"
    >
      <VStack align="stretch" spacing={4} p={6}>
        <Text fontSize="sm" color="gray.600">
          Drag to reorder or toggle to show/hide fields
        </Text>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="customize-options">
            {(provided) => (
              <VStack
                align="stretch"
                spacing={2}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {options.map((option, index) => (
                  <Draggable 
                    key={option.id} 
                    draggableId={option.id} 
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        bg={snapshot.isDragging ? itemBgHover : itemBg}
                        p={3}
                        borderRadius="md"
                        transition="background 0.2s"
                        _hover={{ bg: itemBgHover }}
                      >
                        <HStack justify="space-between">
                          <HStack>
                            <Box 
                              {...provided.dragHandleProps}
                              color="gray.500"
                              cursor="grab"
                            >
                              <DragHandleIcon />
                            </Box>
                            <Text>{option.label}</Text>
                          </HStack>
                          <Switch
                            checked={option.enabled}
                            onChange={() => handleToggle(option.id)}
                            colorScheme="blue"
                            size="sm"
                            aria-label={`Toggle ${option.label}`}
                          />
                        </HStack>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </VStack>
            )}
          </Droppable>
        </DragDropContext>
      </VStack>
    </RightSidebar>
  )
}

export default CustomizePanel 
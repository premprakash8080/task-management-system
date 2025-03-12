import {
  Flex,
  Icon,
  Text,
  Input,
  useColorModeValue,
  IconButton,
  Box,
  Badge,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useState, useRef, useEffect } from 'react'
import { DragHandleIcon } from '@chakra-ui/icons'
import { useDrag, useDrop } from 'react-dnd'

interface TaskListSectionHeaderProps {
  title: string
  count: number
  isExpanded: boolean
  sectionId: string
  index: number
  onToggle: () => void
  onSectionNameChange: (newName: string) => void
  onSectionMove: (dragIndex: number, hoverIndex: number) => void
}

const TaskListSectionHeader = ({
  title,
  count,
  isExpanded,
  sectionId,
  index,
  onToggle,
  onSectionNameChange,
  onSectionMove,
}: TaskListSectionHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const sectionBg = useColorModeValue('gray.50', 'gray.700')
  const sectionHoverBg = useColorModeValue('gray.100', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'white')
  const dragHandleColor = useColorModeValue('gray.400', 'gray.500')
  const countBgColor = useColorModeValue('gray.200', 'gray.600')

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'SECTION',
    item: { type: 'SECTION', id: sectionId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'SECTION',
    hover(item: { type: string; id: string; index: number }) {
      if (item.index === index) {
        return
      }
      onSectionMove(item.index, index)
      item.index = index
    },
  })

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setEditedTitle(title)
  }

  const handleEditComplete = () => {
    if (editedTitle.trim() && editedTitle !== title) {
      onSectionNameChange(editedTitle.trim())
    } else {
      setEditedTitle(title)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      handleEditComplete()
    } else if (e.key === 'Escape') {
      setEditedTitle(title)
      setIsEditing(false)
    }
  }

  return (
    <Flex
      ref={(node) => drag(drop(node))}
      py={2}
      px={4}
      bg={sectionBg}
      alignItems="center"
      cursor="pointer"
      onClick={onToggle}
      _hover={{ bg: sectionHoverBg }}
      transition="all 0.2s"
      role="button"
      aria-expanded={isExpanded}
      opacity={isDragging ? 0.5 : 1}
      borderRadius="md"
      boxShadow="sm"
      position="relative"
    >
      <Icon
        as={DragHandleIcon}
        mr={2}
        color={dragHandleColor}
        cursor="grab"
        _active={{ cursor: 'grabbing' }}
        onClick={(e) => e.stopPropagation()}
        opacity={0.6}
        _hover={{ opacity: 1 }}
      />
      
      <IconButton
        icon={<Icon as={isExpanded ? ChevronDownIcon : ChevronRightIcon} />}
        aria-label={isExpanded ? "Collapse section" : "Expand section"}
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        mr={2}
      />
      
      {isEditing ? (
        <Input
          ref={inputRef}
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleEditComplete}
          onKeyDown={handleKeyDown}
          size="sm"
          width="auto"
          minWidth="150px"
          onClick={(e) => e.stopPropagation()}
          variant="filled"
          bg="white"
          _hover={{ bg: 'white' }}
          _focus={{ bg: 'white', borderColor: 'blue.500' }}
          autoComplete="off"
        />
      ) : (
        <Text
          fontWeight="medium"
          color={textColor}
          onClick={handleEditStart}
          _hover={{ textDecoration: 'underline' }}
          cursor="text"
          flex={1}
        >
          {title}
        </Text>
      )}
      
      <Badge
        ml={2}
        px={2}
        py={1}
        borderRadius="full"
        bg={countBgColor}
        color={textColor}
        fontSize="xs"
        fontWeight="medium"
      >
        {count}
      </Badge>
    </Flex>
  )
}

export default TaskListSectionHeader 
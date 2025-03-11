import {
  Flex,
  Icon,
  Text,
  Input,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react'
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useState, useRef, useEffect } from 'react'

interface TaskListSectionHeaderProps {
  title: string
  count: number
  isExpanded: boolean
  onToggle: () => void
  onSectionNameChange: (newName: string) => void
}

const TaskListSectionHeader = ({
  title,
  count,
  isExpanded,
  onToggle,
  onSectionNameChange,
}: TaskListSectionHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const sectionBg = useColorModeValue('gray.50', 'gray.700')
  const sectionHoverBg = useColorModeValue('gray.100', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'white')

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
    >
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
          _focus={{ bg: 'white' }}
          autoComplete="off"
        />
      ) : (
        <Text
          fontWeight="medium"
          color={textColor}
          onClick={handleEditStart}
          _hover={{ textDecoration: 'underline' }}
          cursor="text"
        >
          {title}
        </Text>
      )}
      
      <Text
        ml={2}
        color="gray.500"
        fontSize="sm"
      >
        ({count})
      </Text>
    </Flex>
  )
}

export default TaskListSectionHeader 
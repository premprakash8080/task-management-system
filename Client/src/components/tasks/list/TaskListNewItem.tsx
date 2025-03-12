import { Box, Input, Button, HStack, useColorModeValue } from '@chakra-ui/react'
import { useState, memo } from 'react'

export interface TaskListNewItemProps {
  onSubmit: (title: string) => void
  onCancel: () => void
}

const TaskListNewItem = memo(({ onSubmit, onCancel }: TaskListNewItemProps) => {
  const [title, setTitle] = useState('')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title.trim())
      setTitle('')
    }
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={3}
      mb={2}
    >
      <HStack spacing={2}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          size="sm"
          autoFocus
        />
        <Button type="submit" size="sm" colorScheme="blue" isDisabled={!title.trim()}>
          Add
        </Button>
        <Button size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </HStack>
    </Box>
  )
})

TaskListNewItem.displayName = 'TaskListNewItem'

export default TaskListNewItem 
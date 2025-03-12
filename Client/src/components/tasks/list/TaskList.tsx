import { Box, Input, VStack, useToast } from '@chakra-ui/react'
import { Task, CreateTaskDto } from '../../../types/task'
import { ProjectSection } from '../../../types/project'
import TaskListItem from './TaskListItem'
import TaskListHeader from './TaskListHeader'
import TaskListSectionHeader from './TaskListSectionHeader'
import { memo, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export interface TaskListProps {
  tasks: Task[]
  sections: ProjectSection[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (task: Task) => Promise<void>
  onTaskCreate: (task: CreateTaskDto) => Promise<void>
  onTaskComplete: (taskId: string) => void
  onTaskProjectChange: (taskId: string, projectId: string) => void
  onTaskSectionChange: (taskId: string, sectionId: string) => void
  onSectionUpdate: (sectionId: string, title: string) => Promise<void>
  onSectionCreate: (title: string) => Promise<void>
  onSectionReorder: (sectionIds: string[]) => Promise<void>
  projectId: string
}

const TaskList = memo(({
  tasks,
  sections,
  onTaskClick,
  onTaskUpdate,
  onTaskCreate,
  onTaskComplete,
  onTaskProjectChange,
  onTaskSectionChange,
  onSectionUpdate,
  onSectionCreate,
  onSectionReorder,
  projectId
}: TaskListProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map(s => s.id)))
  const [newTaskInputs, setNewTaskInputs] = useState<{ [key: string]: string }>({})
  const toast = useToast()

  const handleCreateTask = async (sectionId: string | null, title: string) => {
    if (!title.trim() || !projectId) return

    try {
      const newTask: CreateTaskDto = {
        title: title.trim(),
        description: '',
        status: 'todo',
        priority: 'medium',
        projectId,
        sectionId: sectionId || null // Explicitly set to null for unassigned tasks
      }

      await onTaskCreate(newTask)
      setNewTaskInputs(prev => ({ ...prev, [sectionId || 'unassigned']: '' }))
    } catch (error: any) {
      console.error('Task creation error:', error);
      toast({
        title: 'Error creating task',
        description: error.response?.data?.message || 'Failed to create task. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleSectionMove = (dragIndex: number, hoverIndex: number) => {
    const reorderedSections = [...sections]
    const [movedSection] = reorderedSections.splice(dragIndex, 1)
    reorderedSections.splice(hoverIndex, 0, movedSection)
    onSectionReorder(reorderedSections.map(s => s.id))
  }

  const handleSectionToggle = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  const renderSection = (section: ProjectSection, index: number) => {
    const sectionTasks = tasks.filter(task => task.sectionId === section.id)
    const isExpanded = expandedSections.has(section.id)
    
    return (
      <Box key={section.id} mb={4}>
        <TaskListSectionHeader
          title={section.title}
          count={sectionTasks.length}
          isExpanded={isExpanded}
          sectionId={section.id}
          index={index}
          onToggle={() => handleSectionToggle(section.id)}
          onSectionNameChange={(newTitle) => onSectionUpdate(section.id, newTitle)}
          onSectionMove={handleSectionMove}
        />
        {isExpanded && (
          <VStack spacing={2} mt={2} pl={10}>
            {sectionTasks.map(task => (
              <TaskListItem
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
                onUpdate={onTaskUpdate}
                onComplete={() => onTaskComplete(task._id)}
                onProjectChange={(projectId) => onTaskProjectChange(task._id, projectId)}
                onSectionChange={(sectionId) => onTaskSectionChange(task._id, sectionId)}
              />
            ))}
            <Input
              placeholder="Press Enter to add a new task"
              size="sm"
              value={newTaskInputs[section.id] || ''}
              onChange={(e) => setNewTaskInputs(prev => ({ ...prev, [section.id]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateTask(section.id, newTaskInputs[section.id] || '')
                }
              }}
              _placeholder={{ color: 'gray.500' }}
              bg="white"
              _hover={{ bg: 'gray.50' }}
              _focus={{ bg: 'white', borderColor: 'blue.500' }}
            />
          </VStack>
        )}
      </Box>
    )
  }

  const unassignedTasks = tasks.filter(task => !task.sectionId)

  return (
    <DndProvider backend={HTML5Backend}>
      <Box p={4}>
        <TaskListHeader onAddSection={() => {
          const title = window.prompt('Enter section name:')
          if (title) onSectionCreate(title)
        }} />
        
        <VStack spacing={4} align="stretch">
          {sections.map((section, index) => renderSection(section, index))}
          
          {/* Unassigned Tasks Section */}
          {unassignedTasks.length > 0 && (
            <Box mt={4}>
              <TaskListSectionHeader
                title="Unassigned Tasks"
                count={unassignedTasks.length}
                isExpanded={true}
                sectionId="unassigned"
                index={-1}
                onToggle={() => {}}
                onSectionNameChange={() => {}}
                onSectionMove={() => {}}
              />
              <VStack spacing={2} mt={2} pl={10}>
                {unassignedTasks.map(task => (
                  <TaskListItem
                    key={task._id}
                    task={task}
                    onClick={() => onTaskClick(task._id)}
                    onUpdate={onTaskUpdate}
                    onComplete={() => onTaskComplete(task._id)}
                    onProjectChange={(projectId) => onTaskProjectChange(task._id, projectId)}
                    onSectionChange={(sectionId) => onTaskSectionChange(task._id, sectionId)}
                    projectName={task.projectName}
                  />
                ))}
                <Input
                  placeholder="Press Enter to add a new task"
                  size="sm"
                  value={newTaskInputs['unassigned'] || ''}
                  onChange={(e) => setNewTaskInputs(prev => ({ ...prev, 'unassigned': e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateTask(null, newTaskInputs['unassigned'] || '')
                    }
                  }}
                  _placeholder={{ color: 'gray.500' }}
                  bg="white"
                  _hover={{ bg: 'gray.50' }}
                  _focus={{ bg: 'white', borderColor: 'blue.500' }}
                />
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </DndProvider>
  )
})

TaskList.displayName = 'TaskList'

export default TaskList 
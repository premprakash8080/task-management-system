import { VStack, Box, useColorModeValue } from '@chakra-ui/react'
import TaskListHeader from './TaskListHeader'
import TaskListItem from './TaskListItem'
import TaskListNewItem from './TaskListNewItem'
import TaskListSectionHeader from './TaskListSectionHeader'
import { Task } from '../../../data/sampleData'
import { useState, useMemo } from 'react'

interface TaskListProps {
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  onTaskUpdate: (task: Task) => void
  onTaskCreate: (task: Partial<Task>) => void
  onSectionUpdate?: (oldName: string, newName: string) => void
}

interface SectionState {
  [key: string]: {
    isExpanded: boolean;
    displayName: string;
  };
}

const DEFAULT_SECTIONS = {
  'todo': { isExpanded: true, displayName: 'To Do' },
  'in-progress': { isExpanded: true, displayName: 'In Progress' },
  'completed': { isExpanded: true, displayName: 'Completed' }
}

const TaskList = ({
  tasks,
  onTaskClick,
  onTaskUpdate,
  onTaskCreate,
  onSectionUpdate
}: TaskListProps) => {
  const [sections, setSections] = useState<SectionState>(DEFAULT_SECTIONS)
  const [creatingInSection, setCreatingInSection] = useState<string | null>(null)

  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Group tasks by section
  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: Task[] } = {
      'todo': [],
      'in-progress': [],
      'completed': []
    }
    
    tasks.forEach(task => {
      if (groups[task.status]) {
        groups[task.status].push(task)
      }
    })
    
    return groups
  }, [tasks])

  const handleTaskComplete = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      onTaskUpdate({
        ...task,
        status: task.status === 'completed' ? 'todo' : 'completed',
      })
    }
  }

  const handleProjectChange = (taskId: string, projectId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      onTaskUpdate({
        ...task,
        projectId,
      })
    }
  }

  const handleSectionChange = (taskId: string, status: Task['status']) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      onTaskUpdate({
        ...task,
        status,
      })
    }
  }

  const toggleSection = (section: string) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        isExpanded: !prev[section].isExpanded
      }
    }))
  }

  const handleSectionNameChange = (section: string, newName: string) => {
    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        displayName: newName
      }
    }))
    onSectionUpdate?.(section, newName)
  }

  const handleCreateInSection = (section: string, taskName: string) => {
    onTaskCreate({
      title: taskName,
      status: section as Task['status'],
      description: '',
      tags: [],
      attachments: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setCreatingInSection(null)
  }

  const renderSection = (section: string) => {
    const tasks = groupedTasks[section] || []
    const { isExpanded, displayName } = sections[section]

    return (
      <Box key={section} borderBottom="1px solid" borderColor={borderColor}>
        <TaskListSectionHeader
          title={displayName}
          count={tasks.length}
          isExpanded={isExpanded}
          onToggle={() => toggleSection(section)}
          onSectionNameChange={(newName) => handleSectionNameChange(section, newName)}
        />
        
        <Box
          style={{
            maxHeight: isExpanded ? '2000px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in-out, opacity 0.2s ease-in-out',
            opacity: isExpanded ? 1 : 0
          }}
        >
          {tasks.map(task => (
            <TaskListItem
              key={task.id}
              task={task}
              onComplete={handleTaskComplete}
              onProjectChange={handleProjectChange}
              onSectionChange={handleSectionChange}
              onTaskClick={onTaskClick}
            />
          ))}
          <TaskListNewItem
            onTaskCreate={(task) => handleCreateInSection(section, task.title!)}
            isCreating={creatingInSection === section}
            onStartCreating={() => setCreatingInSection(section)}
            onCancelCreating={() => setCreatingInSection(null)}
          />
        </Box>
      </Box>
    )
  }

  return (
    <VStack align="stretch" spacing={0}>
      <TaskListHeader />
      {renderSection('todo')}
      {renderSection('in-progress')}
      {renderSection('completed')}
    </VStack>
  )
}

export default TaskList 
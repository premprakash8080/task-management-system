import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons'
import {
  HStack,
  Tabs,
  TabList,
  Tab,
  Button,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'
import { BiHorizontalCenter } from 'react-icons/bi'

interface TasksHeaderLeftProps {
  currentView: 'list' | 'board' | 'calendar' | 'files'
  onViewChange: (view: 'list' | 'board' | 'calendar' | 'files') => void
  onAddSection: () => void
}

const TasksHeaderLeft = ({ currentView, onViewChange, onAddSection }: TasksHeaderLeftProps) => {
  const getViewIndex = (view: string) => {
    const views = ['list', 'board', 'calendar', 'files']
    return views.indexOf(view)
  }

  const handleViewTabChange = (index: number) => {
    const views = ['list', 'board', 'calendar', 'files']
    onViewChange(views[index] as 'list' | 'board' | 'calendar' | 'files')
  }

  return (
    <HStack spacing={4}>
      <Button leftIcon={<AddIcon />} colorScheme="blue">
        Add Task
      </Button>
      
      <Button
        leftIcon={<BiHorizontalCenter />}
        variant="outline"
        onClick={onAddSection}
      >
        Add Section
      </Button>
    </HStack>
  )
}

export default TasksHeaderLeft 
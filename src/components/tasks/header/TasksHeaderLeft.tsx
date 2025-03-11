import { ChevronDownIcon } from '@chakra-ui/icons'
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
}

const TasksHeaderLeft = ({ currentView, onViewChange }: TasksHeaderLeftProps) => {
  const getViewIndex = (view: string) => {
    const views = ['list', 'board', 'calendar', 'files']
    return views.indexOf(view)
  }

  const handleViewTabChange = (index: number) => {
    const views = ['list', 'board', 'calendar', 'files']
    onViewChange(views[index] as 'list' | 'board' | 'calendar' | 'files')
  }

  return (
    <HStack spacing={0}>
      <Button>Add Task</Button>
      <Divider orientation="vertical" />
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        
        </MenuButton>
        <MenuList>
          <MenuItem>Add Section</MenuItem>
        </MenuList>
      </Menu>
      
    </HStack>
  )
}

export default TasksHeaderLeft 
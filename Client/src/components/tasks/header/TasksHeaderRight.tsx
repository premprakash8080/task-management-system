import { HStack } from '@chakra-ui/react'
import { AddTaskButton, CustomizeButton } from './buttons'
import { IncompleteTasksMenu, SortMenu } from './menus'

interface TasksHeaderRightProps {
  currentTab?: string
  onTabChange?: (tab: string) => void
}

const TasksHeaderRight = ({ currentTab, onTabChange }: TasksHeaderRightProps) => {
  return (
    <HStack spacing={2}>
      <IncompleteTasksMenu 
        currentTab={currentTab}
        onTabChange={onTabChange}
      />
      <SortMenu />
      <CustomizeButton />
     
    </HStack>
  )
}

export default TasksHeaderRight 
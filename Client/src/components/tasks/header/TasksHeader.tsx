import { Flex, HStack } from '@chakra-ui/react'
import { TasksHeaderLeft } from '.'
import { TasksHeaderRight } from '.'

interface TasksHeaderProps {
  currentView: 'list' | 'board' | 'calendar' | 'files'
  onViewChange: (view: 'list' | 'board' | 'calendar' | 'files') => void
  currentTab?: string
  onTabChange?: (tab: string) => void
}

const TasksHeader = ({ currentView, onViewChange, currentTab, onTabChange }: TasksHeaderProps) => {
  return (
    <Flex justify="space-between" align="center" w="full" mb={4}>
      <TasksHeaderLeft 
        currentView={currentView}
        onViewChange={onViewChange}
      />
      <TasksHeaderRight 
        currentTab={currentTab}
        onTabChange={onTabChange}
      />
    </Flex>
  )
}

export default TasksHeader 
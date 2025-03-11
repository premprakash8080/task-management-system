import {
  ButtonGroup,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import {
  AiOutlineUnorderedList,
  AiOutlineAppstore,
  AiOutlineCalendar,
  AiOutlinePaperClip,
} from 'react-icons/ai'

export type TaskView = 'list' | 'board' | 'calendar' | 'files'

interface TaskViewSelectorProps {
  currentView: TaskView
  onViewChange: (view: TaskView) => void
}

const TaskViewSelector = ({ currentView, onViewChange }: TaskViewSelectorProps) => {
  const views: Array<{
    id: TaskView
    icon: typeof AiOutlineUnorderedList
    label: string
  }> = [
    {
      id: 'list',
      icon: AiOutlineUnorderedList,
      label: 'List View',
    },
    {
      id: 'board',
      icon: AiOutlineAppstore,
      label: 'Board View',
    },
    {
      id: 'calendar',
      icon: AiOutlineCalendar,
      label: 'Calendar View',
    },
    {
      id: 'files',
      icon: AiOutlinePaperClip,
      label: 'Files View',
    },
  ]

  return (
    <ButtonGroup size="sm" isAttached variant="outline">
      {views.map((view) => (
        <Tooltip key={view.id} label={view.label}>
          <IconButton
            icon={<view.icon />}
            aria-label={view.label}
            isActive={currentView === view.id}
            onClick={() => onViewChange(view.id)}
          />
        </Tooltip>
      ))}
    </ButtonGroup>
  )
}

export default TaskViewSelector 
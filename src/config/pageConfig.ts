import {
  AiOutlineHome,
  AiOutlineInbox,
  AiOutlineFolder,
  AiOutlineFlag,
  AiOutlineUnorderedList,
  AiOutlineAppstore,
  AiOutlineCalendar,
  AiOutlinePaperClip,
  AiOutlineBell,
  AiOutlineInbox as AiOutlineArchive,
} from 'react-icons/ai'
import { TaskView } from '../components/tasks/TaskViewSelector'

export interface PageTab {
  id: string
  label: string
  icon: any
}

export interface PageConfig {
  path: string
  title: string
  icon: any
  tabs?: PageTab[]
  defaultTab?: string
}

export const pageConfigs: Record<string, PageConfig> = {
  '/': {
    path: '/',
    title: 'Home',
    icon: AiOutlineHome,
  },
  '/tasks': {
    path: '/tasks',
    title: 'My Tasks',
    icon: AiOutlineUnorderedList,
    tabs: [
      { id: 'list', label: 'List', icon: AiOutlineUnorderedList },
      { id: 'board', label: 'Board', icon: AiOutlineAppstore },
      { id: 'calendar', label: 'Calendar', icon: AiOutlineCalendar },
      { id: 'files', label: 'Files', icon: AiOutlinePaperClip },
    ],
    defaultTab: 'list',
  },
  '/inbox': {
    path: '/inbox',
    title: 'Inbox',
    icon: AiOutlineInbox,
    tabs: [
      { id: 'activity', label: 'Activity', icon: AiOutlineBell },
      { id: 'archive', label: 'Archive', icon: AiOutlineArchive },
    ],
    defaultTab: 'activity',
  },
  '/portfolios': {
    path: '/portfolios',
    title: 'Portfolios',
    icon: AiOutlineFolder,
  },
  '/goals': {
    path: '/goals',
    title: 'Goals',
    icon: AiOutlineFlag,
  },
} 
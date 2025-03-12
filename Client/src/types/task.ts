import { Project } from '../data/sampleData'

export type TaskStatus = 'todo' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskView = 'list' | 'board' | 'calendar' | 'files'

export interface User {
  _id: string
  email: string
}

export interface Task {
  _id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  assigneeId?: User
  projectId: string
  projectName?: string
  sectionId?: string
  parentTaskId?: string | null
  subtasks: Task[]
  attachments: string[]
  comments: Comment[]
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface Comment {
  _id: string
  content: string
  author: User
  createdAt: string
  updatedAt: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  assigneeId?: string
  projectId: string
  sectionId?: string | null
  parentTaskId?: string | null
  tags?: string[]
}

export interface UpdateTaskDto extends Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> {}

export interface TaskComment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  attachments?: TaskAttachment[];
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface TaskGroup {
  id: string;
  title: string;
  tasks: Task[];
  order: number;
}

export interface TaskSection {
  id: string;
  title: string;
  groups: TaskGroup[];
  order: number;
}

export interface TaskFilters {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assigneeId?: string[]
  dueDate?: {
    start?: string
    end?: string
  }
  search?: string
  isArchived?: boolean
}

export type TaskSortOptions = 'dueDate' | 'priority' | 'status' | 'title' | 'createdAt' | 'updatedAt'

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
} 
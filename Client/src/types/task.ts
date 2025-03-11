import { Project } from '../data/sampleData'

export type TaskStatus = 'todo' | 'in_progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskView = 'list' | 'board' | 'calendar' | 'files'

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  projectId?: string;
  project?: Project;
  tags: string[];
  attachments: string[];
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
  parentTaskId?: string;
  subtasks?: Task[];
  dependencies?: string[];
}

export interface TaskComment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
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
  status?: TaskStatus[];
  priority?: TaskPriority[];
  projectId?: string;
  dueDate?: {
    start: string;
    end: string;
  };
  tags?: string[];
  search?: string;
}

export interface TaskSortOptions {
  field: 'title' | 'dueDate' | 'priority' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

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
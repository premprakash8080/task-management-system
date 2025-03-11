import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  assignees?: string[];
  project?: {
    id: string;
    name: string;
    color: string;
  };
  tags?: string[];
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
  }>;
  comments?: Array<{
    id: string;
    text: string;
    userId: string;
    createdAt: string;
  }>;
  assigneeId?: string;
  projectId?: string;
  likesCount: number;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  tasks: { [key: string]: Task }
  columns: {
    todo: { id: string; title: string; taskIds: string[] }
    'in-progress': { id: string; title: string; taskIds: string[] }
    completed: { id: string; title: string; taskIds: string[] }
  }
  columnOrder: string[]
}

export interface CalendarView {
  tasks: { [key: string]: string[] }; // Grouped by date with task IDs
  range: {
    start: Date;
    end: Date;
  };
}

export interface FileView {
  files: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
    taskId: string;
    projectId?: string;
  }>;
}

const initialData: Board = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Design the Login Page',
      description: 'Create a modern and user-friendly login interface',
      status: 'todo',
      priority: 'high',
      dueDate: '2024-03-15',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-09',
      assigneeId: 'user1',
      projectId: 'proj1',
      tags: ['tag1', 'tag2'],
      comments: [],
      attachments: [],
      likesCount: 0
    },
    'task-2': {
      id: 'task-2',
      title: 'Create API Endpoints',
      description: 'Implement RESTful API endpoints for user authentication',
      status: 'in-progress',
      priority: 'medium',
      dueDate: '2024-03-20',
      createdAt: '2024-03-02',
      updatedAt: '2024-03-10',
      assigneeId: 'user2',
      projectId: 'proj2',
      tags: ['tag3', 'tag4'],
      comments: [],
      attachments: [],
      likesCount: 0
    },
    'task-3': {
      id: 'task-3',
      title: 'Setup Database Schema',
      description: 'Design and implement the database schema for the application',
      status: 'done',
      priority: 'high',
      dueDate: '2024-03-10',
      createdAt: '2024-02-28',
      updatedAt: '2024-03-08',
      assigneeId: 'user1',
      projectId: 'proj1',
      tags: ['tag2'],
      comments: [],
      attachments: [],
      likesCount: 0
    }
  },
  columns: {
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: ['task-1']
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      taskIds: ['task-2']
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      taskIds: ['task-3']
    }
  },
  columnOrder: ['todo', 'in-progress', 'completed']
};

export default initialData; 
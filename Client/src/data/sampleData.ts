export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  assigneeId: string;
  projectId: string;
  tags: string[];
  comments: Comment[];
  attachments: Attachment[];
  likesCount: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
  teamCount: number;
  dueDate: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  status: 'on-track' | 'at-risk' | 'completed';
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Tag {
  id: string;
  label: string;
  colorScheme: string;
}

export interface Notification {
  id: string;
  type: 'message' | 'notification';
  title: string;
  description: string;
  time: string;
  read: boolean;
  relatedId?: string;
}

// Sample Data
export const sampleData = {
  users: [
    {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://bit.ly/dan-abramov',
      role: 'admin',
    },
    {
      id: 'user2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      avatar: 'https://bit.ly/sage-adebayo',
      role: 'member',
    },
  ] as User[],

  tasks: [
    {
      id: 'task1',
      title: 'Update user interface design',
      description: 'Implement new design system across all pages',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-03-15',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-09',
      assigneeId: 'user1',
      projectId: 'proj1',
      tags: ['tag1', 'tag2'],
      comments: [
        {
          id: 'comment1',
          text: 'Looking good! Just a few minor tweaks needed.',
          userId: 'user2',
          createdAt: '2024-03-09T10:00:00Z',
        },
      ],
      attachments: [
        {
          id: 'attach1',
          name: 'design-spec.pdf',
          url: '/files/design-spec.pdf',
          type: 'application/pdf',
          size: 2048576,
        },
      ],
      likesCount: 3,
    },
  ] as Task[],

  projects: [
    {
      id: 'proj1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      progress: 75,
      status: 'active',
      teamCount: 6,
      dueDate: '2024-12-31',
      color: 'blue.500',
    },
    {
      id: 'proj2',
      title: 'Mobile App Development',
      description: 'Native mobile app for iOS and Android platforms',
      progress: 45,
      status: 'active',
      teamCount: 8,
      dueDate: '2024-03-15',
      color: 'green.500',
    },
  ] as Project[],

  goals: [
    {
      id: 'goal1',
      title: 'Increase Team Productivity',
      description: 'Improve team efficiency by 25% through process optimization',
      progress: 65,
      dueDate: '2024-12-31',
      status: 'on-track',
      milestones: [
        {
          id: 'ms1',
          title: 'Analyze current workflow',
          completed: true,
          dueDate: '2024-02-28',
        },
        {
          id: 'ms2',
          title: 'Implement new tools',
          completed: true,
          dueDate: '2024-03-31',
        },
        {
          id: 'ms3',
          title: 'Team training',
          completed: false,
          dueDate: '2024-04-30',
        },
      ],
    },
  ] as Goal[],

  tags: [
    { id: 'tag1', label: 'Design', colorScheme: 'purple' },
    { id: 'tag2', label: 'High Priority', colorScheme: 'red' },
    { id: 'tag3', label: 'Bug', colorScheme: 'orange' },
    { id: 'tag4', label: 'Feature', colorScheme: 'green' },
  ] as Tag[],

  notifications: [
    {
      id: 'notif1',
      type: 'message',
      title: 'New comment on "Website Redesign"',
      description: 'Sarah commented: "The new design looks great! Just a few tweaks..."',
      time: '5 minutes ago',
      read: false,
      relatedId: 'task1',
    },
    {
      id: 'notif2',
      type: 'notification',
      title: 'Task assigned to you',
      description: 'Alex assigned you to "Update API Documentation"',
      time: '1 hour ago',
      read: false,
      relatedId: 'task2',
    },
  ] as Notification[],
}; 
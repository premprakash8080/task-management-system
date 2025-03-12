export interface ProjectSection {
  id: string;
  title: string;
  order: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'archived' | 'completed';
  color?: string;
  icon?: string;
  ownerId: string;
  members: {
    userId: string;
    role: 'owner' | 'admin' | 'member';
  }[];
  sections: ProjectSection[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface ProjectSettings {
  isPrivate: boolean;
  allowGuestAccess: boolean;
  defaultView: 'list' | 'board' | 'calendar' | 'files';
  theme?: {
    primaryColor: string;
    accentColor: string;
  };
  taskStatuses: {
    name: string;
    color: string;
    order: number;
  }[];
} 
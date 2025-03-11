import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.projectListeners = new Map();
  }

  connect() {
    if (this.socket) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:8000', {
      auth: { token },
    });

    // Handle connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      if (error.message === 'Authentication error') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    });

    // Set up default listeners
    this.setupDefaultListeners();
  }

  disconnect() {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
    this.projectListeners.clear();
  }

  setupDefaultListeners() {
    // User presence events
    this.socket.on('user:joined', ({ userId, projectId }) => {
      this.notifyProjectListeners(projectId, 'user:joined', { userId });
    });

    this.socket.on('user:left', ({ userId, projectId }) => {
      this.notifyProjectListeners(projectId, 'user:left', { userId });
    });

    // Task events
    this.socket.on('task:updated', (data) => {
      this.notifyProjectListeners(data.projectId, 'task:updated', data);
    });

    // Project events
    this.socket.on('project:updated', (data) => {
      this.notifyProjectListeners(data.projectId, 'project:updated', data);
    });
  }

  // Join a project room
  joinProject(projectId, listeners = {}) {
    if (!this.socket) this.connect();
    
    this.socket.emit('join-project', projectId);
    this.projectListeners.set(projectId, listeners);
  }

  // Leave a project room
  leaveProject(projectId) {
    if (!this.socket) return;
    
    this.socket.emit('leave-project', projectId);
    this.projectListeners.delete(projectId);
  }

  // Notify project-specific listeners
  notifyProjectListeners(projectId, event, data) {
    const listeners = this.projectListeners.get(projectId);
    if (listeners && listeners[event]) {
      listeners[event](data);
    }
  }

  // Emit task update
  emitTaskUpdate(projectId, taskData) {
    if (!this.socket) return;
    this.socket.emit('task:update', { projectId, ...taskData });
  }

  // Emit project update
  emitProjectUpdate(projectId, projectData) {
    if (!this.socket) return;
    this.socket.emit('project:update', { projectId, ...projectData });
  }
}

export const socketService = new SocketService(); 
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
const connectedUsers = new Map(); // Store user connections in memory
const projectSubscriptions = new Map(); // Store project subscriptions

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Store user connection
    connectedUsers.set(socket.user._id.toString(), socket.id);

    // Join project-specific rooms
    socket.on('join-project', (projectId) => {
      const room = `project:${projectId}`;
      socket.join(room);
      
      // Store project subscription
      const userSubs = projectSubscriptions.get(socket.user._id.toString()) || new Set();
      userSubs.add(projectId);
      projectSubscriptions.set(socket.user._id.toString(), userSubs);
      
      // Notify other project members
      socket.to(room).emit('user:joined', {
        userId: socket.user._id,
        projectId,
      });
    });

    // Leave project-specific rooms
    socket.on('leave-project', (projectId) => {
      const room = `project:${projectId}`;
      socket.leave(room);
      
      // Remove project subscription
      const userSubs = projectSubscriptions.get(socket.user._id.toString());
      if (userSubs) {
        userSubs.delete(projectId);
        if (userSubs.size === 0) {
          projectSubscriptions.delete(socket.user._id.toString());
        }
      }
      
      // Notify other project members
      socket.to(room).emit('user:left', {
        userId: socket.user._id,
        projectId,
      });
    });

    // Handle task updates
    socket.on('task:update', (data) => {
      const room = `project:${data.projectId}`;
      socket.to(room).emit('task:updated', data);
    });

    // Handle project updates
    socket.on('project:update', (data) => {
      const room = `project:${data.projectId}`;
      socket.to(room).emit('project:updated', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Clean up user connection and subscriptions
      const userId = socket.user._id.toString();
      connectedUsers.delete(userId);
      
      const userSubs = projectSubscriptions.get(userId);
      if (userSubs) {
        // Notify all projects that the user has left
        userSubs.forEach(projectId => {
          const room = `project:${projectId}`;
          socket.to(room).emit('user:left', {
            userId: socket.user._id,
            projectId,
          });
        });
        projectSubscriptions.delete(userId);
      }
    });
  });

  return io;
};

const emitProjectUpdate = (projectId, event, data) => {
  if (!io) return;
  io.to(`project:${projectId}`).emit(event, data);
};

const emitTaskUpdate = (projectId, event, data) => {
  if (!io) return;
  io.to(`project:${projectId}`).emit(event, data);
};

const getUserSocketId = (userId) => {
  return connectedUsers.get(userId.toString());
};

const isUserOnline = (userId) => {
  return connectedUsers.has(userId.toString());
};

const getUserProjects = (userId) => {
  return Array.from(projectSubscriptions.get(userId.toString()) || []);
};

module.exports = {
  initializeSocket,
  emitProjectUpdate,
  emitTaskUpdate,
  getUserSocketId,
  isUserOnline,
  getUserProjects,
}; 
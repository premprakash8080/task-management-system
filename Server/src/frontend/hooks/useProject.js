import { useState, useEffect, useCallback } from 'react';
import { projectApi } from '../services/api.service';
import { socketService } from '../services/socket.service';

export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineMembers, setOnlineMembers] = useState(new Set());

  // Fetch project data
  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectApi.getProject(projectId);
      setProject(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch project tasks
  const fetchTasks = useCallback(async () => {
    try {
      const data = await projectApi.getTasks({ projectId });
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  }, [projectId]);

  // Update project
  const updateProject = useCallback(async (updates) => {
    try {
      const updatedProject = await projectApi.updateProject(projectId, updates);
      setProject(updatedProject);
      socketService.emitProjectUpdate(projectId, updatedProject);
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  // Add member
  const addMember = useCallback(async (userId, role) => {
    try {
      const updatedProject = await projectApi.addMember(projectId, userId, role);
      setProject(updatedProject);
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  // Remove member
  const removeMember = useCallback(async (userId) => {
    try {
      const updatedProject = await projectApi.removeMember(projectId, userId);
      setProject(updatedProject);
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  // Update settings
  const updateSettings = useCallback(async (settings) => {
    try {
      const updatedProject = await projectApi.updateSettings(projectId, settings);
      setProject(updatedProject);
      return updatedProject;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [projectId]);

  // Setup WebSocket listeners
  useEffect(() => {
    if (!projectId) return;

    const listeners = {
      'user:joined': ({ userId }) => {
        setOnlineMembers(prev => new Set([...prev, userId]));
      },
      'user:left': ({ userId }) => {
        setOnlineMembers(prev => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      },
      'project:updated': (data) => {
        setProject(data);
      },
      'task:updated': (data) => {
        setTasks(prev => prev.map(task => 
          task._id === data._id ? data : task
        ));
      },
    };

    socketService.joinProject(projectId, listeners);

    return () => {
      socketService.leaveProject(projectId);
    };
  }, [projectId]);

  // Initial data fetch
  useEffect(() => {
    if (!projectId) return;
    
    fetchProject();
    fetchTasks();
  }, [projectId, fetchProject, fetchTasks]);

  return {
    project,
    tasks,
    loading,
    error,
    onlineMembers,
    updateProject,
    addMember,
    removeMember,
    updateSettings,
    refreshProject: fetchProject,
    refreshTasks: fetchTasks,
  };
}; 
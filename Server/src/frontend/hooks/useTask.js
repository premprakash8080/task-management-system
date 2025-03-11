import { useState, useEffect, useCallback } from 'react';
import { taskApi } from '../services/api.service';
import { socketService } from '../services/socket.service';

export const useTask = (taskId) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch task data
  const fetchTask = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      const data = await taskApi.getTask(taskId);
      setTask(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  // Update task
  const updateTask = useCallback(async (updates) => {
    try {
      const updatedTask = await taskApi.updateTask(taskId, updates);
      setTask(updatedTask);
      socketService.emitTaskUpdate(updatedTask.projectId, updatedTask);
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [taskId]);

  // Add comment
  const addComment = useCallback(async (content) => {
    try {
      const updatedTask = await taskApi.addComment(taskId, content);
      setTask(updatedTask);
      socketService.emitTaskUpdate(updatedTask.projectId, updatedTask);
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [taskId]);

  // Delete task
  const deleteTask = useCallback(async () => {
    try {
      await taskApi.deleteTask(taskId);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [taskId]);

  // Initial data fetch
  useEffect(() => {
    if (!taskId) return;
    fetchTask();
  }, [taskId, fetchTask]);

  return {
    task,
    loading,
    error,
    updateTask,
    addComment,
    deleteTask,
    refreshTask: fetchTask,
  };
};

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskApi.getTasks(filters);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create task
  const createTask = useCallback(async (taskData) => {
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      socketService.emitTaskUpdate(newTask.projectId, newTask);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Batch update tasks
  const batchUpdateTasks = useCallback(async (updates) => {
    try {
      const updatedTasks = await taskApi.batchUpdateTasks(updates);
      setTasks(prev => {
        const taskMap = new Map(updatedTasks.map(task => [task._id, task]));
        return prev.map(task => taskMap.get(task._id) || task);
      });
      return updatedTasks;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    createTask,
    batchUpdateTasks,
    refreshTasks: fetchTasks,
  };
}; 
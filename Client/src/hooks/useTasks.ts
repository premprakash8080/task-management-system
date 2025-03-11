import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTaskContext } from '../store/TaskContext'
import { Task, TaskFilters, TaskSortOptions } from '../types/task'

export const useTasks = (filters?: TaskFilters, sort?: TaskSortOptions) => {
  const queryClient = useQueryClient()
  const { fetchTasks, createTask, updateTask, deleteTask } = useTaskContext()

  // Fetch tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', filters, sort],
    queryFn: () => fetchTasks(),
  })

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (newTask: Partial<Task>) => createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
      updateTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isLoading,
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,
  }
}

// Hook for single task operations
export const useTask = (taskId: string) => {
  const queryClient = useQueryClient()
  const { fetchTaskById, updateTask, deleteTask } = useTaskContext()

  // Fetch single task
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => fetchTaskById(taskId),
    enabled: !!taskId,
  })

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: (updates: Partial<Task>) => updateTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  return {
    task,
    isLoading,
    error,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    isUpdating: updateTaskMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,
  }
} 
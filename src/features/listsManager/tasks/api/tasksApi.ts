import { type MaybeRefOrGetter, toValue } from 'vue'
import {
  useApi,
  useApiPost,
  useApiPatch,
  useApiDelete,
  type UseApiOptions,
} from '@ametie/vue-muza-use'

export default () => {
  const getAllTasksInList = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApi(`/tasks/lists/${toValue(id)}`, options)
  }

  const postNewTask = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApiPost(`/tasks/lists/${toValue(id)}`, options)
  }

  const getTaskById = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApi(() => `/tasks/${toValue(id)}`, options)
  }

  const updateTaskById = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApiPatch(() => `/tasks/${toValue(id)}`, options)
  }

  const deleteTaskById = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApiDelete(() => `/tasks/${toValue(id)}`, options)
  }

  const toggleTaskStatus = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApiPatch(() => `/tasks/${toValue(id)}/complete`, options)
  }

  const toggleStarredTasks = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApiPatch(() => `/tasks/starred/${toValue(id)}/toggle-star`, options)
  }

  const toggleTaskWeeklyStatus = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApiPatch(() => `/tasks/${toValue(id)}/toggle-weekly-goal`, options)
  }

  const getAllUpcomingDeadlinesTasks = (options?: UseApiOptions) => {
    return useApi(() => `/tasks/deadline`, options)
  }

  const getAllWeeklyGoalTasks = (options?: UseApiOptions) => {
    return useApi(() => `/tasks/weekly-goals`, options)
  }

  const getAllStarredTasks = (options?: UseApiOptions) => {
    return useApi(() => `/tasks/starred/all`, options)
  }

  return {
    getAllTasksInList,
    postNewTask,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    toggleTaskStatus,
    toggleStarredTasks,
    toggleTaskWeeklyStatus,
    getAllUpcomingDeadlinesTasks,
    getAllWeeklyGoalTasks,
    getAllStarredTasks,
  }
}

import type { ListItem } from '../types/lists'

export type ListUrgency = 'overdue' | 'soon' | 'rest'

const SOON_THRESHOLD_MS = 1000 * 60 * 60 * 48

export const getListUrgency = (list: ListItem): ListUrgency => {
  if (!list.deadline) {
    return 'rest'
  }

  const deadlineTime = new Date(list.deadline).getTime()
  const now = Date.now()

  if (deadlineTime < now) {
    return 'overdue'
  }

  if (deadlineTime - now < SOON_THRESHOLD_MS) {
    return 'soon'
  }

  return 'rest'
}

export const getListPercent = (list: ListItem): number =>
  list.totalTasks > 0 ? Math.round((list.completedTasks / list.totalTasks) * 100) : 0

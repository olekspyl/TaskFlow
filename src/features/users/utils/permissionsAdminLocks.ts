import { PermsTypes } from '@/features/users/types'

export const lockPermissionRow = (
  currentLocks: Record<string, boolean>,
  row: PermsTypes.PermissionRow,
) => {
  return {
    ...currentLocks,
    [row.id]: true,
  }
}

export const unlockPermissionRow = (
  currentLocks: Record<string, boolean>,
  row: PermsTypes.PermissionRow,
) => {
  return {
    ...currentLocks,
    [row.id]: false,
  }
}

export const unlockAllPermissionRows = () => {
  return {}
}

export const isPermissionRowLocked = (
  lockedRows: Record<string, boolean>,
  row: PermsTypes.PermissionRow,
) => {
  return Boolean(lockedRows[row.id])
}

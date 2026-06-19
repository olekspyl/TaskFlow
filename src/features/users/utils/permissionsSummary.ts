export const getPermissionsSummary = (
  userPermissions: Record<string, boolean>,
): { granted: number; total: number } => {
  const values = Object.values(userPermissions)

  return {
    granted: values.filter(Boolean).length,
    total: values.length,
  }
}

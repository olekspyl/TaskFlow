export const formatPermissionsToArr = (permissions: Record<string, boolean>) => {
  return {
    permissions: Object.entries(permissions).reduce<string[]>((acc, [key, value]) => {
      if (value) {
        acc.push(key)
      }

      return acc
    }, []),
  }
}

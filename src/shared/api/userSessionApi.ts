import { useApiPost, useApi, type UseApiOptions } from '@ametie/vue-muza-use'
import { MeTypes } from '@/shared/types'

export default () => {
  const fetchUserMe = (options?: UseApiOptions<MeTypes.Response>) => {
    return useApi('/me', options)
  }

  const fetchLogoutUser = (options?: UseApiOptions) => {
    return useApiPost('/auth/logout', options)
  }

  return {
    fetchUserMe,
    fetchLogoutUser,
  }
}

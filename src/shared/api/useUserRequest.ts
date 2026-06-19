import { useApiPost, useApi, type UseApiOptions } from '@ametie/vue-muza-use'

import type { MeResponse } from '../types/user'
export default () => {
  const fetchUserMe = (options?: UseApiOptions<MeResponse>) => {
    return useApi('/me', options)
  }

  // types - deafault response type
  const fetchLogoutUser = (options?: UseApiOptions) => {
    return useApiPost('/auth/logout', options)
  }

  return {
    fetchUserMe,
    fetchLogoutUser,
  }
}

// абстракція на запити (шар апі)

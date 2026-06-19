import { useApiPost, type UseApiOptions } from '@ametie/vue-muza-use'

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/features/auth/types/auth'

export default () => {
  const fetchLoginUser = (options?: UseApiOptions<LoginResponse, LoginRequest>) => {
    return useApiPost('/auth/login', options)
  }

  const fetchRegisterUser = (options?: UseApiOptions<RegisterResponse, RegisterRequest>) => {
    return useApiPost('/auth/register', options)
  }

  return {
    fetchLoginUser,
    fetchRegisterUser,
  }
}

// абстракція на запити (шар апі)

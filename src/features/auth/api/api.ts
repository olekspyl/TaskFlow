import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  skipAuthRefresh?: boolean
}

const BASE_URL = 'https://todo-list-backend-seven-mauve.vercel.app/api'

// ==================== TOKEN ====================

let isSessionExpired = false

export function setAccessToken(token: string | null) {
  if (token) {
    localStorage.setItem('accessToken', token)
    isSessionExpired = false // 🔥 відновлюємо сесію
  } else {
    localStorage.removeItem('accessToken')
  }
}

export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

// ==================== API ====================

export const api = axios.create({
  baseURL: BASE_URL,
})

export const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

// ==================== REQUEST ====================

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (!config.headers) {
    config.headers = {} as InternalAxiosRequestConfig['headers']
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

// ==================== REFRESH ====================

async function refreshAccessToken() {
  const { data } = await refreshApi.post<{ accessToken: string }>('/auth/refresh', undefined, {
    skipAuthRefresh: true,
  } as RetryableRequestConfig)

  setAccessToken(data.accessToken)
  return data.accessToken
}

let refreshPromise: Promise<string> | null = null

// ==================== RESPONSE ====================

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (!error.response || !originalRequest) {
      return Promise.reject(error)
    }

    const status = error.response.status

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      !isSessionExpired
    ) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null
          })
        }

        const newAccessToken = await refreshPromise

        if (!originalRequest.headers) {
          originalRequest.headers = {} as InternalAxiosRequestConfig['headers']
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        setAccessToken(null)
        isSessionExpired = true // 🔥 блокуємо наступні refresh

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export function resetAuthState() {
  refreshPromise = null
  isSessionExpired = false
}

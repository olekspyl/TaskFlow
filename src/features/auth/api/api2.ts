import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  skipAuthRefresh?: boolean
}

type QueuedRequest = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

const BASE_URL = 'https://todo-list-backend-seven-mauve.vercel.app/api'

export const api = axios.create({
  baseURL: BASE_URL,
})

export const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

export function setAccessToken(token: string | null) {
  if (token) {
    localStorage.setItem('accessToken', token)
  } else {
    localStorage.removeItem('accessToken')
  }
}

export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

function setAuthHeader(config: RetryableRequestConfig, token: string) {
  if (!config.headers) {
    config.headers = {} as InternalAxiosRequestConfig['headers']
  }

  config.headers.Authorization = `Bearer ${token}`
}

async function refreshAccessToken() {
  const { data } = await refreshApi.post<{ accessToken: string }>('/auth/refresh', undefined, {
    skipAuthRefresh: true,
  } as RetryableRequestConfig)

  setAccessToken(data.accessToken)
  return data.accessToken
}

let isRefreshing = false
let failedQueue: QueuedRequest[] = []

function processQueue(error: unknown, token: string | null = null) {
  const queue = [...failedQueue]
  failedQueue = []

  for (const item of queue) {
    if (error) {
      item.reject(error)
    } else if (token) {
      item.resolve(token)
    }
  }
}

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    setAuthHeader(config as RetryableRequestConfig, accessToken)
  }

  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (!error.response || !originalRequest) {
      return Promise.reject(error)
    }

    if (
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.skipAuthRefresh
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken: string) => {
            setAuthHeader(originalRequest, newToken)
            resolve(api(originalRequest))
          },
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      const newToken = await refreshAccessToken()

      processQueue(null, newToken)

      setAuthHeader(originalRequest, newToken)
      return api(originalRequest)
    } catch (refreshError) {
      setAccessToken(null)
      processQueue(refreshError, null)

      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export function resetAuthState() {
  isRefreshing = false
  failedQueue = []
}

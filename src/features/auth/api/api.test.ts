import { describe, it, expect, beforeEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { api, refreshApi, setAccessToken, getAccessToken } from './api'

describe('api refresh token', () => {
  let apiMock: MockAdapter
  let refreshMock: MockAdapter

  beforeEach(() => {
    localStorage.clear()

    apiMock = new MockAdapter(api, { delayResponse: 50 })
    refreshMock = new MockAdapter(refreshApi, { delayResponse: 100 })
  })

  it('should call refresh only once for 6 parallel requests', async () => {
    setAccessToken('expired-token')

    let refreshCount = 0

    refreshMock.onPost('/auth/refresh').reply(() => {
      refreshCount += 1
      return [200, { accessToken: 'fresh-token' }]
    })

    apiMock.onGet('/tasks').reply((config) => {
      const authHeader = config.headers?.Authorization

      if (authHeader === 'Bearer fresh-token') {
        return [200, { success: true }]
      }

      return [401, { message: 'Unauthorized' }]
    })

    const requests = [
      api.get('/tasks'),
      api.get('/tasks'),
      api.get('/tasks'),
      api.get('/tasks'),
      api.get('/tasks'),
      api.get('/tasks'),
    ]

    const responses = await Promise.all(requests)

    expect(refreshCount).toBe(1)
    expect(getAccessToken()).toBe('fresh-token')

    for (const response of responses) {
      expect(response.status).toBe(200)
      expect(response.data).toEqual({ success: true })
    }
  })

  it('should clear token and reject all requests if refresh fails', async () => {
    setAccessToken('expired-token')

    let refreshCount = 0

    refreshMock.onPost('/auth/refresh').reply(() => {
      refreshCount += 1
      return [401, { message: 'Refresh expired' }]
    })

    apiMock.onGet('/tasks').reply(401)

    const requests = [
      api.get('/tasks'),
      api.get('/tasks'),
      api.get('/tasks'),
      api.get('/tasks'),
      api.get('/tasks'),
      api.get('/tasks'),
    ]

    const results = await Promise.allSettled(requests)

    expect(refreshCount).toBe(1)
    expect(getAccessToken()).toBeNull()

    for (const result of results) {
      expect(result.status).toBe('rejected')
    }
  })
  it('should not call refresh if access token is valid', async () => {
    setAccessToken('valid-token')

    let refreshCount = 0

    refreshMock.onPost('/auth/refresh').reply(() => {
      refreshCount += 1
      return [200, { accessToken: 'fresh-token' }]
    })

    apiMock.onGet('/tasks').reply((config) => {
      const authHeader = config.headers?.Authorization

      if (authHeader === 'Bearer valid-token') {
        return [200, { success: true }]
      }

      return [401, { message: 'Unauthorized' }]
    })

    const response = await api.get('/tasks')

    expect(response.status).toBe(200)
    expect(response.data).toEqual({ success: true })
    expect(refreshCount).toBe(0)
    expect(getAccessToken()).toBe('valid-token')
  })
  it('should not retry infinitely if retried request still returns 401', async () => {
    setAccessToken('expired-token')

    let refreshCount = 0
    let tasksCallCount = 0

    refreshMock.onPost('/auth/refresh').reply(() => {
      refreshCount += 1
      return [200, { accessToken: 'fresh-token' }]
    })

    apiMock.onGet('/tasks').reply(() => {
      tasksCallCount += 1
      return [401, { message: 'Still unauthorized' }]
    })

    await expect(api.get('/tasks')).rejects.toBeTruthy()

    expect(refreshCount).toBe(1)
    expect(tasksCallCount).toBe(2)
  })
})

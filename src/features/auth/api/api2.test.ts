import { beforeEach, describe, expect, it } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import { api, refreshApi, setAccessToken, getAccessToken, resetAuthState } from './api2'

describe('api refresh token with queue', () => {
  let apiMock: MockAdapter
  let refreshMock: MockAdapter

  beforeEach(() => {
    localStorage.clear()
    resetAuthState()

    apiMock = new MockAdapter(api, { delayResponse: 50 })
    refreshMock = new MockAdapter(refreshApi, { delayResponse: 100 })
  })

  it('should perform one refresh and resolve all queued requests', async () => {
    setAccessToken('expired-token')

    let refreshCount = 0

    refreshMock.onPost('/auth/refresh').reply(() => {
      refreshCount += 1
      return [200, { accessToken: 'fresh-token' }]
    })

    const replyWithAuthCheck = (config: any) => {
      if (config.headers?.Authorization === 'Bearer fresh-token') {
        return [200, { ok: true }]
      }
      return [401, { message: 'Unauthorized' }]
    }

    apiMock.onGet('/tasks').reply(replyWithAuthCheck)
    apiMock.onPost('/tasks').reply(replyWithAuthCheck)
    apiMock.onPut('/tasks/1').reply(replyWithAuthCheck)
    apiMock.onDelete('/tasks/1').reply(replyWithAuthCheck)

    const results = await Promise.all([
      api.get('/tasks'),
      api.post('/tasks', { title: 'A' }),
      api.put('/tasks/1', { title: 'B' }),
      api.delete('/tasks/1'),
    ])

    expect(refreshCount).toBe(1)
    expect(getAccessToken()).toBe('fresh-token')

    for (const result of results) {
      expect(result.status).toBe(200)
      expect(result.data).toEqual({ ok: true })
    }
  })

  it('should reject all queued requests if refresh fails', async () => {
    setAccessToken('expired-token')

    let refreshCount = 0

    refreshMock.onPost('/auth/refresh').reply(() => {
      refreshCount += 1
      return [401, { message: 'Refresh expired' }]
    })

    apiMock.onGet('/tasks').reply(401)
    apiMock.onPost('/tasks').reply(401)
    apiMock.onPut('/tasks/1').reply(401)

    const results = await Promise.allSettled([
      api.get('/tasks'),
      api.post('/tasks', { title: 'A' }),
      api.put('/tasks/1', { title: 'B' }),
    ])

    expect(refreshCount).toBe(1)
    expect(getAccessToken()).toBeNull()

    for (const result of results) {
      expect(result.status).toBe('rejected')
    }
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

  it('should not queue request when skipAuthRefresh is true', async () => {
    setAccessToken('expired-token')

    let refreshCount = 0

    refreshMock.onPost('/auth/refresh').reply(() => {
      refreshCount += 1
      return [200, { accessToken: 'fresh-token' }]
    })

    apiMock.onGet('/tasks').reply(401, { message: 'Unauthorized' })

    await expect(api.get('/tasks', { skipAuthRefresh: true } as any)).rejects.toBeTruthy()

    expect(refreshCount).toBe(0)
  })
})

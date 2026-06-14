import { setActivePinia, createPinia } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import { createDefaultConfig } from '@/utils/defaults'

let mockCounter = 0
jest.mock('nanoid', () => ({ nanoid: () => 'test-id-' + mockCounter++ }))

jest.useFakeTimers()

describe('notifications store', () => {
  beforeEach(() => {
    mockCounter = 0
    jest.spyOn(Date, 'now').mockReturnValue(1_000_000)
    setActivePinia(createPinia())
  })

  afterEach(() => {
    const store = useNotificationsStore()
    store.clearAll()
    jest.restoreAllMocks()
  })

  it('show adds a toast with generated id and createdAt', () => {
    const store = useNotificationsStore()
    const config = { ...createDefaultConfig(), title: 'Hello', message: 'World' }

    store.show(config)

    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].id).toBe('test-id-0')
    expect(store.toasts[0].createdAt).toBe(1_000_000)
    expect(store.toasts[0].title).toBe('Hello')
  })

  it('auto-dismisses after the configured duration', () => {
    const store = useNotificationsStore()
    store.show({ ...createDefaultConfig(), duration: 3000 })

    expect(store.toasts).toHaveLength(1)

    jest.advanceTimersByTime(3000)

    expect(store.toasts).toHaveLength(0)
  })

  it('persistent toast (duration 0) is never auto-dismissed', () => {
    const store = useNotificationsStore()
    store.show({ ...createDefaultConfig(), duration: 0 })

    jest.advanceTimersByTime(60_000)

    expect(store.toasts).toHaveLength(1)
  })

  it('dismiss removes the toast and clears its timer', () => {
    const store = useNotificationsStore()
    store.show({ ...createDefaultConfig(), duration: 5000 })

    const id = store.toasts[0].id
    store.dismiss(id)

    expect(store.toasts).toHaveLength(0)

    // advancing past the original duration should not cause errors
    jest.advanceTimersByTime(5000)
    expect(store.toasts).toHaveLength(0)
  })
})

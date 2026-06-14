import { setActivePinia, createPinia } from 'pinia'
import { useBuilderStore } from '@/stores/builder'

describe('builder store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('setType applies that type default colors and resets colorsCustomized', () => {
    const store = useBuilderStore()

    store.setType('error')

    expect(store.config.type).toBe('error')
    expect(store.config.backgroundColor).toBe('#ef2c2e')
    expect(store.config.textColor).toBe('#ffffff')
    expect(store.colorsCustomized).toBe(false)
  })
})

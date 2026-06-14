import { setActivePinia, createPinia } from 'pinia'
import { usePresetsStore } from '@/stores/presets'
import { createDefaultConfig } from '@/utils/defaults'

let mockCounter = 0
jest.mock('nanoid', () => ({ nanoid: () => 'test-id-' + mockCounter++ }))

describe('presets store', () => {
  let getItemSpy: jest.SpyInstance
  let setItemSpy: jest.SpyInstance

  beforeEach(() => {
    mockCounter = 0
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    setItemSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {})
    setActivePinia(createPinia())
  })

  afterEach(() => {
    getItemSpy.mockRestore()
    setItemSpy.mockRestore()
  })

  it('deletePreset removes the preset and persists', () => {
    const store = usePresetsStore()
    store.savePreset('To Delete', createDefaultConfig())

    const id = store.presets[0].id
    store.deletePreset(id)

    expect(store.presets).toHaveLength(0)
    // setItem called twice: once for save, once for delete
    expect(setItemSpy).toHaveBeenCalledTimes(2)
  })
})

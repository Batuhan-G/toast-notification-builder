import { mount } from '@vue/test-utils'
import ToastItem from '@/components/toast/ToastItem.vue'
import { createDefaultConfig } from '@/utils/defaults'
import type { NotificationConfig } from '@/types/notification'

function makeConfig(
  overrides: Partial<Omit<NotificationConfig, 'id'>> = {},
): Omit<NotificationConfig, 'id'> {
  return {
    ...createDefaultConfig(),
    title: 'Test Title',
    message: 'Test message',
    ...overrides,
  }
}

describe('ToastItem', () => {
  it('renders title and message text', () => {
    const wrapper = mount(ToastItem, {
      props: { config: makeConfig({ title: 'Hello', message: 'World' }) },
    })

    expect(wrapper.find('.toast__title').text()).toBe('Hello')
    expect(wrapper.find('.toast__message').text()).toBe('World')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(ToastItem, {
      props: { config: makeConfig({ showCloseButton: true }) },
    })

    await wrapper.find('.toast__close').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})

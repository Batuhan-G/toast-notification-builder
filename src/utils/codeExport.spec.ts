import { generateCodeSnippet } from '@/utils/codeExport'
import { createDefaultConfig } from '@/utils/defaults'

describe('generateCodeSnippet', () => {
  it('produces the expected output for a default config with title and message', () => {
    const config = { ...createDefaultConfig(), title: 'Hello', message: 'World' }
    const result = generateCodeSnippet(config)

    expect(result).toBe(
      `const notification = { type: 'success', title: "Hello", message: "World", duration: 3000, position: 'top-right', showIcon: true, showCloseButton: true, animation: 'fade' };`,
    )
  })
})

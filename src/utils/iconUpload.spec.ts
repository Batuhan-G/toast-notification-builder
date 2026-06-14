import { validateIconFile } from '@/utils/iconUpload'

describe('validateIconFile', () => {
  it('rejects non-image file with descriptive reason', () => {
    const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' })
    const result = validateIconFile(file)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toContain('image')
    }
  })

  it('rejects oversized image file', () => {
    const file = new File([new Uint8Array(200 * 1024)], 'big.png', {
      type: 'image/png',
    })
    const result = validateIconFile(file)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toContain('100 KB')
    }
  })

  it('accepts a valid small PNG file', () => {
    const file = new File([new Uint8Array(1024)], 'icon.png', {
      type: 'image/png',
    })
    const result = validateIconFile(file)

    expect(result.ok).toBe(true)
  })
})

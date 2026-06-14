const MAX_FILE_SIZE = 100 * 1024 // 100 KB

interface ValidationSuccess {
  ok: true
}

interface ValidationFailure {
  ok: false
  reason: string
}

type ValidationResult = ValidationSuccess | ValidationFailure

export function validateIconFile(file: File): ValidationResult {
  if (!file.type.startsWith('image/')) {
    return { ok: false, reason: 'File must be an image (e.g. PNG, JPG, SVG).' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, reason: 'Image must be under 100 KB.' }
  }

  return { ok: true }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (): void => {
      resolve(reader.result as string)
    }
    reader.onerror = (): void => {
      reject(new Error('Failed to read file.'))
    }
    reader.readAsDataURL(file)
  })
}

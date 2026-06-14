import type { NotificationConfig } from '@/types/notification'

type Config = Omit<NotificationConfig, 'id'>

type Field =
  | { key: string; kind: 'literal'; value: string }
  | { key: string; kind: 'text'; value: string }
  | { key: string; kind: 'number'; value: number }
  | { key: string; kind: 'boolean'; value: boolean }

function fields(config: Config): Field[] {
  return [
    { key: 'type', kind: 'literal', value: config.type },
    { key: 'title', kind: 'text', value: config.title },
    { key: 'message', kind: 'text', value: config.message },
    { key: 'duration', kind: 'number', value: config.duration },
    { key: 'position', kind: 'literal', value: config.position },
    { key: 'showIcon', kind: 'boolean', value: config.showIcon },
    { key: 'showCloseButton', kind: 'boolean', value: config.showCloseButton },
    { key: 'animation', kind: 'literal', value: config.animation },
  ]
}

export function generateCodeSnippet(config: Config): string {
  const body = fields(config)
    .map((f) => {
      switch (f.kind) {
        case 'literal':
          return `${f.key}: '${f.value}'`
        case 'text':
          return `${f.key}: ${JSON.stringify(f.value)}`
        case 'number':
        case 'boolean':
          return `${f.key}: ${f.value}`
      }
    })
    .join(', ')
  return `const notification = { ${body} };`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const wrapPunctuation = (c: string): string => `<span class="code-punct">${c}</span>`
const wrapKey = (key: string): string => `<span class="code-key">${key}</span>`
const wrapString = (v: string): string => `<span class="code-string">'${escapeHtml(v)}'</span>`
const wrapNumber = (v: number): string => `<span class="code-number">${v}</span>`
const wrapBoolean = (v: boolean): string => `<span class="code-boolean">${v}</span>`

export function generateHighlightedHtml(config: Config): string {
  const parts = fields(config).map((f) => {
    const label = `${wrapKey(f.key)}${wrapPunctuation(':')} `
    switch (f.kind) {
      case 'literal':
        return label + wrapString(f.value)
      case 'text':
        return label + wrapString(f.value)
      case 'number':
        return label + wrapNumber(f.value)
      case 'boolean':
        return label + wrapBoolean(f.value)
    }
  })

  return (
    `<span class="code-keyword">const</span> ` +
    `${wrapKey('notification')} ${wrapPunctuation('=')} ${wrapPunctuation('{')} ` +
    parts.join(`${wrapPunctuation(',')} `) +
    ` ${wrapPunctuation('};')}`
  )
}

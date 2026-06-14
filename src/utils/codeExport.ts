import type { NotificationConfig } from '@/types/notification'

export function generateCodeSnippet(config: Omit<NotificationConfig, 'id'>): string {
  const icon =
    config.customIcon === null ? 'null' : JSON.stringify(config.customIcon)
  return (
    `const notification = { ` +
    `type: '${config.type}', ` +
    `title: ${JSON.stringify(config.title)}, ` +
    `message: ${JSON.stringify(config.message)}, ` +
    `duration: ${config.duration}, ` +
    `position: '${config.position}', ` +
    `showIcon: ${config.showIcon}, ` +
    `showCloseButton: ${config.showCloseButton}, ` +
    `animation: '${config.animation}', ` +
    `customIcon: ${icon} };`
  )
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function p(char: string): string {
  return `<span class="code-punct">${char}</span>`
}

function k(key: string): string {
  return `<span class="code-key">${key}</span>`
}

function s(value: string): string {
  return `<span class="code-string">'${escapeHtml(value)}'</span>`
}

function n(value: number): string {
  return `<span class="code-number">${value}</span>`
}

function b(value: boolean): string {
  return `<span class="code-boolean">${value}</span>`
}

function nil(): string {
  return `<span class="code-null">null</span>`
}

export function generateHighlightedHtml(
  config: Omit<NotificationConfig, 'id'>,
): string {
  const icon =
    config.customIcon === null
      ? nil()
      : s(config.customIcon.slice(0, 40) + '…')

  const parts = [
    `${k('type')}${p(':')} ${s(config.type)}`,
    `${k('title')}${p(':')} ${s(config.title)}`,
    `${k('message')}${p(':')} ${s(config.message)}`,
    `${k('duration')}${p(':')} ${n(config.duration)}`,
    `${k('position')}${p(':')} ${s(config.position)}`,
    `${k('showIcon')}${p(':')} ${b(config.showIcon)}`,
    `${k('showCloseButton')}${p(':')} ${b(config.showCloseButton)}`,
    `${k('animation')}${p(':')} ${s(config.animation)}`,
    `${k('customIcon')}${p(':')} ${icon}`,
  ]

  return (
    `<span class="code-keyword">const</span> ` +
    `${k('notification')} ${p('=')} ${p('{')} ` +
    parts.join(`${p(',')} `) +
    ` ${p('};')}`
  )
}

export const POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const
export type Position = (typeof POSITIONS)[number]

export const POSITION_LABELS: Record<Position, string> = {
  'top-left': 'Top Left',
  'top-center': 'Top Center',
  'top-right': 'Top Right',
  'bottom-left': 'Bottom Left',
  'bottom-center': 'Bottom Center',
  'bottom-right': 'Bottom Right',
}

export const POSITION_SHORT_LABELS: Record<Position, string> = {
  'top-left': 'TL',
  'top-center': 'TC',
  'top-right': 'TR',
  'bottom-left': 'BL',
  'bottom-center': 'BC',
  'bottom-right': 'BR',
}

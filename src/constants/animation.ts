export const ANIMATIONS = ['fade', 'slide', 'bounce'] as const
export type AnimationStyle = (typeof ANIMATIONS)[number]

export const ANIMATION_LABELS: Record<AnimationStyle, string> = {
  fade: 'Fade',
  slide: 'Slide',
  bounce: 'Bounce',
}

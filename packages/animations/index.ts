/** Global transition presets — consume via CSS class names */
export const transitions = {
  fade: 'vp-fade',
  slideUp: 'vp-slide-up',
  scale: 'vp-scale'
} as const

export type TransitionName = (typeof transitions)[keyof typeof transitions]

export {
  MOTION_CLASS,
  MOTION_TRANSFORM_KINDS,
  resolveMotionKind,
  formatMotionDuration,
  type MotionKind,
  type MotionProps,
  type MotionFlagKey
} from './motion'

export {
  AnimationService,
  initAnimationDom,
  type AnimationConfig
} from './AnimationService'

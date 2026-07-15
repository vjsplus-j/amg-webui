import { computed, ref, type Ref } from 'vue'
import type { MotionLiveState } from './MotionLivePanel.vue'

export function createMotionLiveState(
  initial?: Partial<MotionLiveState>
): Ref<MotionLiveState> {
  return ref({
    spin: false,
    pulse: false,
    heartbeat: false,
    bounce: false,
    blink: false,
    breathe: false,
    glow: false,
    marqueeLeft: false,
    marqueeRight: false,
    scrollUp: false,
    scrollDown: false,
    dampOut: false,
    rotate: 0,
    flipH: false,
    flipV: false,
    ...initial
  })
}

/** Props for shared MotionProps hosts (Avatar / Button / Tag / Icon / Typography). */
export function useMotionLiveBind(state: Ref<MotionLiveState>) {
  return computed(() => ({
    spin: state.value.spin,
    pulse: state.value.pulse,
    heartbeat: state.value.heartbeat,
    bounce: state.value.bounce,
    blink: state.value.blink,
    breathe: state.value.breathe,
    glow: state.value.glow,
    marqueeLeft: state.value.marqueeLeft,
    marqueeRight: state.value.marqueeRight,
    scrollUp: state.value.scrollUp,
    scrollDown: state.value.scrollDown,
    dampOut: state.value.dampOut
  }))
}

export function formatMotionLiveCode(
  tag: string,
  state: MotionLiveState,
  extras: string[] = []
): string {
  const lines = [
    `<${tag}`,
    ...extras.map((e) => `  ${e}`),
    ...(state.spin ? ['  spin'] : []),
    ...(state.pulse ? ['  pulse'] : []),
    ...(state.heartbeat ? ['  heartbeat'] : []),
    ...(state.bounce ? ['  bounce'] : []),
    ...(state.blink ? ['  blink'] : []),
    ...(state.breathe ? ['  breathe'] : []),
    ...(state.glow ? ['  glow'] : []),
    ...(state.marqueeLeft ? ['  marquee-left'] : []),
    ...(state.marqueeRight ? ['  marquee-right'] : []),
    ...(state.scrollUp ? ['  scroll-up'] : []),
    ...(state.scrollDown ? ['  scroll-down'] : []),
    ...(state.dampOut ? ['  damp-out'] : []),
    '/>'
  ]
  return lines.join('\n')
}

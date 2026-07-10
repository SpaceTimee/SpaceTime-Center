export const spring = {
  type: 'spring',
  stiffness: 260,
  damping: 20
} as const

export const followSpring = {
  stiffness: 300,
  damping: 30,
  restDelta: 0.001
} as const

export const ease = [0.25, 1, 0.5, 1] as const
export const duration = 0.5
export const durationMs = 500
export const progressHideMs = 500
export const transition = {
  duration,
  ease
} as const

export const staggerDelay = 0.1
export const offsetY = 30
export const liftY = -4
export const tiltDeg = 10
export const spotlightInner = 400
export const spotlightOuter = 600
export const tagFallAt = 10
export const tagVibrateMs = 50
export const tagFallY = 200
export const tagFallRotate = 45

export const header = {
  baseScale: 1.1,
  maxPull: 150,
  pullLimit: 250,
  pullDragDivisor: 1.5,
  pullDragPow: 0.85,
  decayRate: 0.999,
  scrollWheelFactor: 0.6,
  parallaxFactor: 40,
  parallaxLimitRatio: 0.05,
  parallaxResistance: 30,
  maxTilt: 20,
  tiltFactor: 0.625,
  tiltOffset: 45,
  meniscusSpread: 80,
  waveHeight: 60
} as const

export const inView = { once: true, margin: '-50px' } as const

export const fadeUp = {
  initial: { opacity: 0, y: offsetY },
  animate: { opacity: 1, y: 0 }
} as const

export const fadeDown = {
  initial: { opacity: 0, y: -offsetY },
  animate: { opacity: 1, y: 0 }
} as const

export const avatar = {
  initial: { scale: 0.5, opacity: 0, rotate: -15 },
  animate: { scale: 1, opacity: 1, rotate: 0 }
} as const

const withSpring = <TInitial, TAnimate>(shape: { readonly initial: TInitial; readonly animate: TAnimate }) =>
  ({
    initial: shape.initial,
    animate: shape.animate,
    transition: spring
  }) as const

export const fadeUpMotion = withSpring(fadeUp)
export const fadeDownMotion = withSpring(fadeDown)
export const avatarMotion = withSpring(avatar)

export const tagFallExit = { y: tagFallY, rotate: tagFallRotate, opacity: 0 } as const
export const tagFallTransition = {
  ...transition,
  ease: 'easeIn',
  layout: { ease }
} as const
export const reducedMotion = { duration: 0 } as const

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerDelay }
  }
} as const

export const staggerItem = {
  hidden: fadeUp.initial,
  visible: {
    ...fadeUp.animate,
    transition: spring
  }
} as const

export const staggerInView = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: inView,
  variants: staggerContainer
} as const

export const cardHover = {
  whileHover: { y: liftY },
  transition
} as const

export const expandCollapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition
} as const

export const opacityToggle = {
  initial: { opacity: 0 },
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
  transition
} as const

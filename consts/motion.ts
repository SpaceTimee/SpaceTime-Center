const spring = { type: 'spring', stiffness: 260, damping: 20 } as const

export const followSpring = { stiffness: 300, damping: 30, restDelta: 0.001 } as const

const ease = [0.25, 1, 0.5, 1] as const
const transition = { duration: 0.5, ease } as const

export const tiltDeg = 10
export const spotlightInner = 400
export const spotlightOuter = 600
export const tagFallClicks = 10
export const tagVibrateMs = 50
export const progressHideMs = 500

export const headerConfig = {
  baseScale: 1.1,
  maxPull: 150,
  pullLimit: 250,
  pullDragDivisor: 1.5,
  pullDragPower: 0.85,
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

export const getMeniscusPaths = (topY: number) => {
  const { meniscusSpread, waveHeight } = headerConfig
  const controlY = topY + (waveHeight - topY) * 0.95
  const controlX = meniscusSpread * 0.08
  return [
    `M 0,${topY} C 0,${controlY} ${controlX},${waveHeight} ${meniscusSpread},${waveHeight} L 0,${waveHeight} Z`,
    `M 1000,${topY} C 1000,${controlY} ${1000 - controlX},${waveHeight} ${1000 - meniscusSpread},${waveHeight} L 1000,${waveHeight} Z`
  ] as const
}

export const meniscusViewBox = `0 0 1000 ${headerConfig.waveHeight}`
export const initialMeniscusPaths = getMeniscusPaths(0)

const offsetY = { up: 30, down: -30 } as const
const fadeUp = { initial: { opacity: 0, y: offsetY.up }, animate: { opacity: 1, y: 0 } } as const

interface SpringShape<TInitial, TAnimate> {
  readonly initial: TInitial
  readonly animate: TAnimate
}

const withSpring = <const TInitial, const TAnimate>(shape: SpringShape<TInitial, TAnimate>) =>
  ({ initial: shape.initial, animate: shape.animate, transition: spring }) as const

export const fadeUpMotion = withSpring(fadeUp)
export const fadeDownMotion = withSpring({
  initial: { opacity: 0, y: offsetY.down },
  animate: { opacity: 1, y: 0 }
} as const)

export const avatarMotion = withSpring({
  initial: { scale: 0.5, opacity: 0, rotate: -15 },
  animate: { scale: 1, opacity: 1, rotate: 0 }
} as const)

export const tagFallExit = { y: 200, rotate: 45, opacity: 0 } as const
export const tagFallTransition = { ...transition, ease: 'easeIn', layout: { ease } } as const
export const reducedMotion = { duration: 0 } as const

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
  viewport: { once: true, margin: '-50px' },
  variants: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  }
} as const

export const cardHover = { whileHover: { y: -4 }, transition } as const

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

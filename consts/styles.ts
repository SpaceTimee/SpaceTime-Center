export const tw = (strings: TemplateStringsArray, ...values: unknown[]) =>
  String.raw({ raw: strings }, ...values)

export const colorTransition = tw`transition-[color] motion-emphasized`
export const colorBgTransition = tw`transition-[color,background-color] motion-emphasized`
export const bgTransition = tw`transition-[background-color] motion-emphasized`
export const bgBorderTransition = tw`transition-[background-color,border-color] motion-emphasized`
export const opacityTransition = tw`transition-opacity motion-emphasized`
export const scaleTransition = tw`transition-[scale] motion-emphasized will-change-transform`

export const scrollMargin = tw`scroll-mt-24`
export const contentContainer = tw`mx-auto max-w-5xl px-6`
export const absoluteFill = tw`pointer-events-none absolute inset-0`

export const sectionLabel = tw`flex items-center gap-2`
export const sectionIcon = tw`size-6 text-primary`
export const sectionTitle = tw`font-bold text-gray-900 ${colorTransition} dark:text-gray-100`
export const mutedText = tw`text-gray-400 ${colorTransition} dark:text-gray-500`

export const cardStage = tw`h-full perspective-distant`
export const cardShell = tw`group relative block h-full rounded-xl bg-white p-px shadow-sm ${bgTransition} will-change-transform transform-3d dark:bg-gray-800`
export const cardOutline = tw`border border-gray-100 transition-[border-color] motion-emphasized group-hover:border-primary/30`
export const cardSpotlightBorder = tw`${absoluteFill} rounded-xl opacity-0 ${opacityTransition} group-hover:opacity-15 dark:group-hover:opacity-30`
export const cardSpotlightFill = tw`${absoluteFill} opacity-0 mix-blend-screen ${opacityTransition} group-hover:opacity-3 dark:group-hover:opacity-5`
export const cardGrid = tw`grid gap-4 md:grid-cols-2`
export const cardRow = tw`relative flex translate-z-3.75 items-center gap-4`
export const cardIcon = tw`flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary ${colorBgTransition} group-hover:bg-primary group-hover:text-white dark:bg-primary/20`
export const cardContent = tw`flex min-w-0 flex-1 flex-col gap-1`
export const cardTitle = tw`truncate ${sectionTitle} group-hover:text-primary`
export const cardDescription = tw`truncate text-sm text-gray-500 ${colorTransition} dark:text-gray-400`
export const cardTag = tw`rounded-md border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 transition-[color,background-color,border-color] motion-emphasized group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400`
export const cardArrow = tw`size-5 shrink-0 text-gray-300 transition-[color,translate] motion-emphasized group-hover:translate-x-1 group-hover:text-primary dark:text-gray-600`

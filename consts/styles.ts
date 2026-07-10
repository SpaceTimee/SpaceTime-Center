export const tw = (strings: TemplateStringsArray, ...values: unknown[]) =>
  String.raw({ raw: strings }, ...values)

export const colorTransition = tw`transition-[color] ui-transition`
export const bgTransition = tw`transition-[background-color] ui-transition`
export const borderTransition = tw`transition-[border-color] ui-transition`
export const opacityTransition = tw`transition-opacity ui-transition`
export const surfaceTransition = tw`transition-[background-color,border-color] ui-transition`
export const colorBgTransition = tw`transition-[color,background-color] ui-transition`
export const paintTransition = tw`transition-[color,background-color,border-color] ui-transition`

export const scrollMargin = tw`scroll-mt-24`
export const contentWidth = tw`max-w-5xl`

export const sectionLabel = tw`flex items-center gap-2`
export const sectionIcon = tw`size-6 text-primary`
export const sectionTitle = tw`text-gray-900 ${colorTransition} dark:text-gray-100`
export const mutedText = tw`text-gray-400 ${colorTransition} dark:text-gray-500`

export const cardStage = tw`h-full perspective-distant`
export const cardShell = tw`group relative block h-full rounded-xl bg-white p-px shadow-sm ${bgTransition} will-change-transform transform-3d dark:bg-gray-800`
export const cardShadow = tw`pointer-events-none absolute inset-0 -z-1 -translate-z-[15px] rounded-xl opacity-0 shadow-lg ${opacityTransition} group-hover:opacity-100`
export const cardSpotlightBorder = tw`pointer-events-none absolute inset-0 rounded-xl opacity-0 ${opacityTransition} group-hover:opacity-15 dark:group-hover:opacity-30`
export const cardBorder = tw`pointer-events-none absolute inset-0 rounded-xl border border-gray-100 ${borderTransition} group-hover:border-primary/30 dark:border-gray-700`
export const cardInner = tw`relative h-full overflow-hidden rounded-[calc(var(--radius-xl)-1px)] bg-white ${bgTransition} dark:bg-gray-800`
export const cardSpotlightFill = tw`pointer-events-none absolute inset-0 opacity-0 mix-blend-screen ${opacityTransition} group-hover:opacity-[0.03] dark:group-hover:opacity-5`
export const cardBlob = tw`pointer-events-none absolute -top-12 -right-12 size-32 transform-gpu rounded-full bg-primary/5 blur-2xl transition-[scale] ui-transition group-hover:scale-150`

export const cardGrid = tw`grid gap-4 md:grid-cols-2`
export const cardRow = tw`relative flex translate-z-[15px] items-center gap-4`
export const cardTextCol = tw`flex min-w-0 flex-1 flex-col gap-1`
export const cardIconRound = tw`flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary ${colorBgTransition} group-hover:bg-primary group-hover:text-white dark:bg-primary/20`
export const cardTitle = tw`truncate font-bold text-gray-900 ${colorTransition} group-hover:text-primary dark:text-gray-100`
export const cardDesc = tw`truncate text-sm text-gray-500 ${colorTransition} dark:text-gray-400`
export const cardTag = tw`rounded-md border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 ${paintTransition} group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-400`
export const cardArrow = tw`size-5 shrink-0 text-gray-300 transition-[color,translate] ui-transition group-hover:translate-x-1 group-hover:text-primary dark:text-gray-600`

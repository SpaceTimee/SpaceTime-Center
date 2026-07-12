import { build } from 'esbuild'
import { XMLParser } from 'fast-xml-parser'
import { Feed } from 'feed'
import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'
import type { Plugin, ResolvedConfig } from 'vite'

interface AtomFeedOptions {
  readonly title: string
  readonly description: string
  readonly url: string
}

interface ExistingEntry {
  readonly summary: string
  readonly link: string
  readonly categories: readonly string[]
  readonly updated: string
}

interface DataEntry {
  readonly name: string
  readonly description: string
  readonly link?: string
  readonly tags?: readonly string[]
}

interface DataModule {
  readonly profile: Pick<DataEntry, 'name'>
  readonly portals: readonly DataEntry[]
  readonly projects: readonly DataEntry[]
  readonly contacts: readonly DataEntry[]
}

interface ParsedAtomFeed {
  readonly feed?: { readonly entry?: readonly Record<string, unknown>[] }
}

const atomArrayPaths = new Set(['feed.entry', 'feed.entry.category', 'feed.entry.link'])

export const AtomFeed = (options: AtomFeedOptions): Plugin => {
  let config!: ResolvedConfig

  return {
    name: 'atom-feed',
    apply: 'build',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async generateBundle() {
      const { title, description, url } = options
      const now = new Date()
      const feedBase = new URL('/', url)
      const feedId = feedBase.href
      const atomUrl = new URL('atom.xml', feedBase).href

      const extractText = (value: unknown): string => {
        if (typeof value === 'string') return value
        if (value !== null && typeof value === 'object' && Object.hasOwn(value, '#text')) {
          return extractText((value as { readonly '#text': unknown })['#text'])
        }
        return ''
      }

      const tmpFile = join(tmpdir(), `atom-feed-data-${crypto.randomUUID()}.mjs`)
      let dataModule: DataModule
      try {
        await build({
          stdin: {
            contents: `export { profile } from './consts/profile.ts'
export { portals } from './consts/portals.ts'
export { projects } from './consts/projects.ts'
export { contacts } from './consts/contacts.ts'`,
            resolveDir: config.root,
            sourcefile: 'atom-feed-data.ts',
            loader: 'ts'
          },
          bundle: true,
          outfile: tmpFile,
          format: 'esm',
          platform: 'node'
        })

        dataModule = (await import(pathToFileURL(tmpFile).href)) as DataModule
      } finally {
        await rm(tmpFile, { force: true })
      }

      const { profile, portals, projects, contacts } = dataModule
      const existingEntries = new Map<string, ExistingEntry>()
      try {
        const response = await fetch(atomUrl, { signal: AbortSignal.timeout(10_000) })
        if (response.ok) {
          const feedEntries =
            (
              new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: '@_',
                isArray: (_, jpath) => typeof jpath === 'string' && atomArrayPaths.has(jpath)
              }).parse(await response.text()) as ParsedAtomFeed
            ).feed?.entry ?? []

          for (const entry of feedEntries) {
            const entryTitle = extractText(entry.title)
            if (!entryTitle) continue
            existingEntries.set(entryTitle, {
              summary: extractText(entry.summary),
              link:
                ((entry.link ?? []) as readonly Record<string, string>[]).find(
                  (link) => (link['@_rel'] ?? 'alternate') === 'alternate'
                )?.['@_href'] ?? '',
              categories: ((entry.category ?? []) as readonly Record<string, string>[]).map(
                (category) => category['@_term'] ?? ''
              ),
              updated: extractText(entry.updated)
            })
          }
        }
      } catch {
        // Ignore fetch failures
      }

      const currentEntries = [...portals, ...projects, ...contacts]
      let feedUpdated = new Date(0)
      const feedItems = currentEntries.map((entry) => {
        const existing = existingEntries.get(entry.name)
        const link = entry.link ?? url
        const tags = entry.tags ?? []
        let updatedDate = now
        if (existing) {
          if (
            entry.description === existing.summary &&
            link === existing.link &&
            isDeepStrictEqual(tags, existing.categories)
          ) {
            const parsedDate = new Date(existing.updated)
            updatedDate = Number.isFinite(parsedDate.getTime()) ? parsedDate : now
          }
        }

        if (updatedDate > feedUpdated) feedUpdated = updatedDate

        return {
          title: entry.name,
          id: `${feedId}#${entry.name.toLowerCase().replaceAll(/\s+/gv, '-')}`,
          description: entry.description,
          link,
          date: updatedDate,
          category: tags.map((tag) => ({ term: tag }))
        }
      })

      if (
        now > feedUpdated &&
        !new Set(existingEntries.keys()).isSubsetOf(new Set(currentEntries.map((entry) => entry.name)))
      ) {
        feedUpdated = now
      }

      const feed = new Feed({
        title,
        description,
        id: feedId,
        link: url,
        feedLinks: {
          atom: atomUrl
        },
        author: {
          name: profile.name
        },
        updated: feedUpdated
      })

      for (const item of feedItems) feed.addItem(item)
      this.emitFile({ type: 'asset', fileName: 'atom.xml', source: feed.atom1() })
    }
  }
}

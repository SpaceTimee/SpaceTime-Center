import { build } from 'esbuild'
import { XMLParser } from 'fast-xml-parser'
import { Feed } from 'feed'
import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Plugin, ResolvedConfig } from 'vite'

interface AtomFeedOptions {
  readonly title: string
  readonly description: string
  readonly url: string
}

interface ExistingEntry {
  readonly summary: string
  readonly link: string
  readonly categories: string[]
  readonly updated: string
}

interface DataEntry {
  readonly name: string
  readonly description: string
  readonly link?: string
  readonly tags?: readonly string[]
}

export function AtomFeed(options: AtomFeedOptions): Plugin {
  let config: ResolvedConfig

  return {
    name: 'atom-feed',
    apply: 'build',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async generateBundle() {
      const { title, description, url } = options
      const now = new Date()

      const extractText = (value: unknown): string => {
        if (typeof value === 'string') return value
        if (typeof value === 'number' || typeof value === 'boolean') return String(value)
        if (value && typeof value === 'object' && '#text' in value) return extractText(value['#text'])
        return ''
      }

      const tmpFile = join(tmpdir(), `atom-feed-data-${Date.now()}.mjs`)
      await build({
        stdin: {
          contents: [
            "export { profile } from './consts/profile.ts'",
            "export { portals } from './consts/portals.ts'",
            "export { projects } from './consts/projects.ts'",
            "export { contacts } from './consts/contacts.ts'"
          ].join('\n'),
          resolveDir: config.root,
          sourcefile: 'atom-feed-data.ts',
          loader: 'ts'
        },
        bundle: true,
        outfile: tmpFile,
        format: 'esm',
        platform: 'node'
      })
      const { profile, portals, projects, contacts } = (await import(pathToFileURL(tmpFile).href)) as {
        profile: { name: string }
        portals: DataEntry[]
        projects: DataEntry[]
        contacts: DataEntry[]
      }
      await rm(tmpFile, { force: true })

      const existingEntries = new Map<string, ExistingEntry>()
      try {
        const response = await fetch(`${url}/atom.xml`)
        if (response.ok) {
          const xml = await response.text()
          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            isArray: (_, jpath) =>
              jpath === 'feed.entry' || jpath === 'feed.entry.category' || jpath === 'feed.entry.link'
          })

          for (const entry of (parser.parse(xml) as { feed?: { entry?: Record<string, unknown>[] } }).feed
            ?.entry ?? []) {
            const entryTitle = extractText(entry.title)
            const summary = extractText(entry.summary)
            const links = (entry.link ?? []) as Record<string, string>[]
            const link =
              links.find((linkEl) => !linkEl['@_rel'] || linkEl['@_rel'] === 'alternate')?.['@_href'] ?? ''
            const categories = ((entry.category ?? []) as Record<string, string>[]).map(
              (category) => category['@_term'] ?? ''
            )
            const updated = extractText(entry.updated)

            if (entryTitle) {
              existingEntries.set(entryTitle, { summary, link, categories, updated })
            }
          }
        }
      } catch {
        // Ignore fetch failures
      }

      const currentEntries: DataEntry[] = [...portals, ...projects, ...contacts].map(
        ({ name, description, link, tags }) => ({ name, description, link, tags })
      )

      const currentNames = new Set(currentEntries.map((entry) => entry.name))
      const hasDeletedEntries = existingEntries
        .keys()
        .some((existingTitle) => !currentNames.has(existingTitle))

      let feedUpdated = new Date(0)

      const feedItems = currentEntries.map((entry) => {
        const existing = existingEntries.get(entry.name)
        let updatedDate = now

        if (existing) {
          const unchanged =
            entry.description === existing.summary &&
            (entry.link ?? '') === existing.link &&
            JSON.stringify(entry.tags ?? []) === JSON.stringify(existing.categories)

          if (unchanged) {
            updatedDate = new Date(existing.updated)
            if (Number.isNaN(updatedDate.getTime())) updatedDate = now
          }
        }

        if (updatedDate > feedUpdated) feedUpdated = updatedDate

        return {
          title: entry.name,
          id: `${url}/#${entry.name.toLowerCase().replaceAll(' ', '-')}`,
          description: entry.description,
          link: entry.link ?? url,
          date: updatedDate,
          category: (entry.tags ?? []).map((tag) => ({ term: tag }))
        }
      })

      if (hasDeletedEntries && now > feedUpdated) {
        feedUpdated = now
      }

      const feed = new Feed({
        title,
        description,
        id: `${url}/`,
        link: url,
        feedLinks: {
          atom: `${url}/atom.xml`
        },
        author: {
          name: profile.name
        },
        updated: feedUpdated
      })

      for (const item of feedItems) {
        feed.addItem(item)
      }

      this.emitFile({
        type: 'asset',
        fileName: 'atom.xml',
        source: feed.atom1()
      })
    }
  }
}

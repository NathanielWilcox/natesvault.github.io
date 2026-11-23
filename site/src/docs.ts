import type { VaultApp } from './apps.registry'

const appReadmes = import.meta.glob<string>('../../apps/*/README.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export function getAppDocs(app: VaultApp): string | undefined {
  return appReadmes[`../../${app.docsPath}`]
}

export interface DocHeading {
  depth: number
  id: string
  text: string
}

export function getDocHeadings(markdown: string): DocHeading[] {
  const slugs = new Map<string, number>()
  const content = markdown.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '')

  return [...content.matchAll(/^(#{1,6})\s+(.+?)\s*#*\s*$/gm)].map((match) => {
    const text = match[2]
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~]/g, '')
      .trim()
    const baseId = text.toLowerCase().replace(/[^\w -]/g, '').replace(/\s+/g, '-')
    const count = slugs.get(baseId) ?? 0
    slugs.set(baseId, count + 1)

    return {
      depth: match[1].length,
      id: count === 0 ? baseId : `${baseId}-${count}`,
      text,
    }
  })
}

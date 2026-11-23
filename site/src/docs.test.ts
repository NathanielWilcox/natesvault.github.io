import { describe, expect, it } from 'vitest'
import { apps } from './apps.registry'
import { getAppDocs, getDocHeadings } from './docs'

describe('app documentation', () => {
  it('bundles documentation for every registry entry', () => {
    for (const app of apps) {
      expect(getAppDocs(app)).toBeTruthy()
    }
  })

  it('returns undefined when an app README is missing', () => {
    expect(getAppDocs({ ...apps[0], docsPath: 'apps/missing/README.md' })).toBeUndefined()
  })

  it('extracts formatted headings and ignores fenced code', () => {
    const markdown = [
      '# Duplicate',
      '## **Overview**',
      '## Duplicate',
      '```md',
      '## Hidden',
      '```',
      '~~~',
      '# Also hidden',
      '~~~',
      '### [A link](https://example.com)',
    ].join('\n')

    expect(getDocHeadings(markdown)).toEqual([
      { depth: 1, id: 'duplicate', text: 'Duplicate' },
      { depth: 2, id: 'overview', text: 'Overview' },
      { depth: 2, id: 'duplicate-1', text: 'Duplicate' },
      { depth: 3, id: 'a-link', text: 'A link' },
    ])
  })

  it('returns no headings for markdown without headings', () => {
    expect(getDocHeadings('Plain text only.')).toEqual([])
  })
})

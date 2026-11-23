import { describe, expect, it } from 'vitest'
import { apps } from './apps.registry'
import { getAppDocs } from './docs'

describe('app registry', () => {
  it('uses unique ids, supported statuses, and README paths for every app', () => {
    const ids = apps.map((app) => app.id)

    expect(new Set(ids).size).toBe(ids.length)
    for (const app of apps) {
      expect(['planned', 'in-progress', 'live']).toContain(app.status)
      expect(app.docsPath).toBe(`apps/${app.id}/README.md`)
      expect(getAppDocs(app)).toContain(`# ${app.name}`)
    }
  })

  it('keeps Starboard clearly marked as a template with a placeholder URL', () => {
    const starboard = apps.find((app) => app.id === 'starboard')

    expect(starboard).toMatchObject({
      status: 'planned',
      placeholderUrl: 'https://example.com/',
    })
    expect(starboard?.description).toMatch(/template\/example/i)
    expect(starboard?.liveUrl).toBeUndefined()
  })
})

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

  it('keeps Starboard marked as an example and points to its deployed demo', () => {
    const starboard = apps.find((app) => app.id === 'starboard')

    expect(starboard).toMatchObject({
      status: 'live',
      liveUrl: 'https://thevault.github.io/starboard/',
    })
    expect(starboard?.exampleNotice).toMatch(/not a real product/i)
  })
})

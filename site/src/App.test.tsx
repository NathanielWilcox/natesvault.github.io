import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { apps } from './apps.registry'

function renderAt(path: string) {
  window.location.hash = `#${path}`
  return render(<App />)
}

describe('Vault routes', () => {
  afterEach(() => {
    window.location.hash = ''
  })

  it('shows every app and its registry status on the overview', () => {
    renderAt('/')

    for (const app of apps) {
      expect(screen.getByRole('heading', { name: app.name })).toBeInTheDocument()
      const statusLabel = app.status === 'in-progress' ? 'In progress' : app.status
      expect(screen.getAllByText(statusLabel).length).toBeGreaterThan(0)
    }

    expect(screen.getByText(/Template\/example only — Starboard is not a real product/)).toBeInTheDocument()
  })

  it.each(apps)('renders the $name detail page from its registry entry', (app) => {
    renderAt(`/apps/${app.id}`)

    expect(screen.getByRole('heading', { name: app.name })).toBeInTheDocument()
    expect(screen.getByText(app.description)).toBeInTheDocument()
    expect(screen.getByText(app.repoPath)).toBeInTheDocument()
    expect(screen.getByText(app.localRun.join('\n'))).toBeInTheDocument()

    for (const technology of app.techStack) {
      expect(screen.getByText(technology)).toBeInTheDocument()
    }

    if (app.liveUrl) {
      expect(screen.getByRole('link', { name: /Launch externally/ })).toHaveAttribute('href', app.liveUrl)
    } else {
      expect(screen.getByRole('button', { name: 'Launch unavailable' })).toBeDisabled()
    }
  })

  it.each(apps)('renders the bundled $name documentation page', async (app) => {
    renderAt(`/apps/${app.id}/docs`)

    expect(await screen.findByRole('heading', { name: app.name })).toBeInTheDocument()
    expect(screen.getByText(`${app.name.toUpperCase()} DOCUMENTATION`)).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Table of contents' })).toBeInTheDocument()
  })

  it('shows Starboard as a launchable demo example, not a real product', () => {
    renderAt('/apps/starboard')

    expect(screen.getByRole('heading', { name: 'Starboard' })).toBeInTheDocument()
    expect(screen.getByText(/Starboard is not a real product/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Launch externally/ })).toHaveAttribute(
      'href',
      'https://thevault.github.io/starboard/',
    )
  })

  it('adds an external launch link only when a live URL exists', () => {
    const starboard = apps.find((app) => app.id === 'starboard')
    if (!starboard) throw new Error('Starboard registry entry is missing')

    const originalLiveUrl = starboard.liveUrl
    starboard.liveUrl = 'https://starboard.example.test'
    try {
      renderAt('/apps/starboard')
      expect(screen.getByRole('link', { name: /Launch externally/ })).toHaveAttribute(
        'href',
        starboard.liveUrl,
      )
    } finally {
      if (originalLiveUrl) starboard.liveUrl = originalLiveUrl
      else delete starboard.liveUrl
    }
  })

  it('reports a missing README for a registered app', () => {
    const fieldNotes = apps.find((app) => app.id === 'field-notes')
    if (!fieldNotes) throw new Error('Field Notes registry entry is missing')

    const docsPath = fieldNotes.docsPath
    fieldNotes.docsPath = 'apps/missing/README.md'
    try {
      renderAt('/apps/field-notes/docs')
      expect(screen.getByRole('heading', { name: 'Documentation not found' })).toBeInTheDocument()
    } finally {
      fieldNotes.docsPath = docsPath
    }
  })

  it('shows the not-found page for unknown app routes', () => {
    renderAt('/apps/unknown')

    expect(screen.getByRole('heading', { name: 'This page is not in the Vault.' })).toBeInTheDocument()
  })

  it('shows the not-found page for documentation routes without a registry entry', async () => {
    renderAt('/apps/unknown/docs')

    expect(await screen.findByRole('heading', { name: 'This page is not in the Vault.' })).toBeInTheDocument()
  })
})

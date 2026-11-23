import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { apps } from './apps.registry'

function renderAt(path: string) {
  window.location.hash = `#${path}`
  return render(<App />)
}

describe('Vault routes', () => {
  afterEach(() => {
    window.location.hash = ''
    vi.unstubAllGlobals()
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

    for (const technology of app.techStack) {
      expect(screen.getByText(technology)).toBeInTheDocument()
    }

    if (app.liveUrl) {
      expect(screen.getByRole('link', { name: /Launch app/ })).toHaveAttribute('href', app.liveUrl)
      if (app.localRun.length > 0) {
        expect(screen.getByRole('button', { name: 'Show commands' })).toBeInTheDocument()
      } else {
        expect(screen.getByText('No local run commands are configured yet.')).toBeInTheDocument()
      }
    } else if (app.localRun.length > 0) {
      expect(screen.getByRole('button', { name: 'Show commands' })).toBeInTheDocument()
    } else {
      expect(screen.getByRole('button', { name: 'No launch available' })).toBeDisabled()
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
    expect(screen.getByRole('link', { name: /Launch app/ })).toHaveAttribute(
      'href',
      'https://nathanielwilcox.github.io/natesvault.github.io/starboard/',
    )
  })

  it('shows and copies local commands separately from the deployed app link', async () => {
    const starboard = apps.find((app) => app.id === 'starboard')
    if (!starboard) throw new Error('Starboard registry entry is missing')

    const commands = starboard.localRun.join('\n')
    const writeText = vi.fn().mockResolvedValue(undefined)
    const navigatorStub = Object.create(navigator) as Navigator
    Object.defineProperty(navigatorStub, 'clipboard', { value: { writeText } })
    vi.stubGlobal('navigator', navigatorStub)

    renderAt('/apps/starboard')
    fireEvent.click(screen.getByRole('button', { name: 'Show commands' }))
    expect(screen.getByText(/npm ci --prefix site/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Copy commands' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Commands copied.')
    expect(writeText).toHaveBeenCalledWith(commands)
  })

  it('uses the Launch action to reveal commands when no live URL exists', () => {
    const fieldNotes = apps.find((app) => app.id === 'field-notes')
    if (!fieldNotes) throw new Error('Field Notes registry entry is missing')

    const originalCommands = fieldNotes.localRun
    fieldNotes.localRun = ['npm run dev', 'sh ./run.sh']
    try {
      renderAt('/apps/field-notes')
      fireEvent.click(screen.getByRole('button', { name: 'Run locally' }))

      expect(screen.getByText(/npm run dev/)).toHaveTextContent('npm run dev sh ./run.sh')
    } finally {
      fieldNotes.localRun = originalCommands
    }
  })

  it('shows clipboard errors instead of claiming commands were copied', async () => {
    const starboard = apps.find((app) => app.id === 'starboard')
    if (!starboard) throw new Error('Starboard registry entry is missing')

    const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'))
    const navigatorStub = Object.create(navigator) as Navigator
    Object.defineProperty(navigatorStub, 'clipboard', { value: { writeText } })
    vi.stubGlobal('navigator', navigatorStub)

    try {
      renderAt('/apps/starboard')
      fireEvent.click(screen.getByRole('button', { name: 'Show commands' }))
      fireEvent.click(screen.getByRole('button', { name: 'Copy commands' }))
      expect(await screen.findByRole('status')).toHaveTextContent('Could not copy commands: Permission denied')
    } finally {
    }
  })

  it('explains when clipboard access is unavailable', async () => {
    renderAt('/apps/starboard')
    fireEvent.click(screen.getByRole('button', { name: 'Show commands' }))
    fireEvent.click(screen.getByRole('button', { name: 'Copy commands' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Clipboard access is unavailable. Select and copy the commands instead.',
    )
  })

  it('reports an unknown clipboard error explicitly', async () => {
    const writeText = vi.fn().mockRejectedValue('clipboard rejected')
    const navigatorStub = Object.create(navigator) as Navigator
    Object.defineProperty(navigatorStub, 'clipboard', { value: { writeText } })
    vi.stubGlobal('navigator', navigatorStub)

    renderAt('/apps/starboard')
    fireEvent.click(screen.getByRole('button', { name: 'Show commands' }))
    fireEvent.click(screen.getByRole('button', { name: 'Copy commands' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Could not copy commands: Unknown clipboard error',
    )
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

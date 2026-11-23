import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DocsPage from './DocsPage'

const markdown = [
  '# Guide',
  '## Contents',
  '### Details',
  '#### Deep',
  '##### Deeper',
  '###### Deepest',
  '',
  '[Jump to contents](#contents)',
  '[Empty anchor](#)',
  '[External reference](https://example.com)',
].join('\n')

vi.mock('./docs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./docs')>()
  return {
    ...actual,
    getAppDocs: () => markdown,
  }
})

describe('documentation page rendering', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  function renderPage() {
    return render(
      <MemoryRouter initialEntries={['/apps/starboard/docs']}>
        <Routes>
          <Route path="/apps/:id/docs" element={<DocsPage />} />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('renders supported heading levels with matching table-of-contents links', () => {
    renderPage()

    for (const [level, name] of [
      [1, 'Guide'],
      [2, 'Contents'],
      [3, 'Details'],
      [4, 'Deep'],
      [5, 'Deeper'],
      [6, 'Deepest'],
    ] as const) {
      expect(screen.getByRole('heading', { level, name })).toBeInTheDocument()
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', `#${name.toLowerCase()}`)
    }
  })

  it('scrolls to internal links and table-of-contents headings', () => {
    renderPage()

    fireEvent.click(screen.getByRole('link', { name: 'Jump to contents' }))
    fireEvent.click(screen.getByRole('link', { name: 'Empty anchor' }))
    fireEvent.click(screen.getByRole('link', { name: 'Contents' }))

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2)
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('opens external documentation links safely in a new tab', () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'External reference' })).toHaveAttribute('target', '_blank')
    expect(screen.getByRole('link', { name: 'External reference' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
  })
})

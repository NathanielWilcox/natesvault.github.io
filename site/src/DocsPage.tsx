import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown, { type Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'
import { apps } from './apps.registry'
import { getAppDocs, getDocHeadings } from './docs'

export default function DocsPage() {
  const { id } = useParams()
  const app = apps.find((entry) => entry.id === id)
  const markdown = app ? getAppDocs(app) : undefined
  const headings = markdown ? getDocHeadings(markdown) : []
  const renderedHeadingIndex = useRef(0)

  if (!app) {
    return (
      <main className="page-shell">
        <section className="empty-state">
          <p className="eyebrow">404 · NOT FOUND</p>
          <h1>This page is not in the Vault.</h1>
          <Link className="button button-primary" to="/">Return to overview</Link>
        </section>
      </main>
    )
  }
  if (markdown === undefined) {
    return (
      <main className="page-shell">
        <Link className="back-link" to={`/apps/${app.id}`}>← Back to {app.name}</Link>
        <section className="empty-state"><h1>Documentation not found</h1><p>Expected a README at {app.docsPath}.</p></section>
      </main>
    )
  }

  renderedHeadingIndex.current = 0
  const components: Components = {
    h1: ({ children }) => <h1 id={headings[renderedHeadingIndex.current++]?.id}>{children}</h1>,
    h2: ({ children }) => <h2 id={headings[renderedHeadingIndex.current++]?.id}>{children}</h2>,
    h3: ({ children }) => <h3 id={headings[renderedHeadingIndex.current++]?.id}>{children}</h3>,
    h4: ({ children }) => <h4 id={headings[renderedHeadingIndex.current++]?.id}>{children}</h4>,
    h5: ({ children }) => <h5 id={headings[renderedHeadingIndex.current++]?.id}>{children}</h5>,
    h6: ({ children }) => <h6 id={headings[renderedHeadingIndex.current++]?.id}>{children}</h6>,
    a: ({ href, children }) => {
      const isAnchor = href?.startsWith('#') && !href.startsWith('#/')
      const anchorId = isAnchor && href ? decodeURIComponent(href.slice(1)) : undefined
      return (
        <a
          href={href}
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          onClick={isAnchor ? (event) => {
            event.preventDefault()
            if (anchorId) document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' })
          } : undefined}
        >
          {children}
        </a>
      )
    },
  }

  return (
    <main className="page-shell docs-shell">
      <Link className="back-link" to={`/apps/${app.id}`}>← Back to {app.name}</Link>
      <div className="docs-layout">
        <aside className="toc-panel">
          <p className="eyebrow">ON THIS PAGE</p>
          <nav aria-label="Table of contents">
            {headings.map((heading, index) => (
              <a
                className={`toc-link toc-depth-${heading.depth}`}
                href={`#${heading.id}`}
                key={`${heading.id}-${index}`}
                onClick={(event) => {
                  event.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {heading.text}
              </a>
            ))}
          </nav>
        </aside>
        <article className="markdown-panel">
          <p className="eyebrow">{app.name.toUpperCase()} DOCUMENTATION</p>
          <ReactMarkdown
            components={components}
            rehypePlugins={[rehypeHighlight, rehypeSanitize]}
            remarkPlugins={[remarkGfm]}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  )
}

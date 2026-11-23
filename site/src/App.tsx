import { lazy, Suspense, useState } from 'react'
import {
  HashRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import './style.css'
import { apps, type AppStatus, type VaultApp } from './apps.registry'

const DocsPage = lazy(() => import('./DocsPage'))

function StatusBadge({ status }: { status: AppStatus }) {
  const label = status === 'in-progress' ? 'In progress' : status
  return <span className={`status-badge status-${status}`}>{label}</span>
}

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="The Vault home">
        <span className="brand-mark" aria-hidden="true">V</span>
        <span>The Vault</span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end to="/">
          Overview
        </NavLink>
        {apps.map((app) => (
          <NavLink
            className={({ isActive }) => `nav-link app-nav-link${isActive ? ' active' : ''}`}
            key={app.id}
            to={`/apps/${app.id}`}
          >
            <span>{app.icon} {app.name}</span>
            <StatusBadge status={app.status} />
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

function AppCard({ app }: { app: VaultApp }) {
  return (
    <article className="app-card">
      <div className="card-heading">
        <span className="app-icon" aria-hidden="true">{app.icon}</span>
        <StatusBadge status={app.status} />
      </div>
      {app.exampleNotice && <p className="placeholder-label">{app.exampleNotice}</p>}
      <h2>{app.name}</h2>
      <p className="card-description">{app.description}</p>
      <div className="tag-list" aria-label="Tags">
        {app.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
      </div>
      <div className="card-actions">
        <Link className="button button-primary" to={`/apps/${app.id}`}>App details</Link>
        <Link className="button button-quiet" to={`/apps/${app.id}/docs`}>Read docs</Link>
      </div>
    </article>
  )
}

function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">PROJECT DIRECTORY</p>
        <h1>Everything in its place.</h1>
        <p className="hero-copy">
          The Vault is the front door to independent projects.
          Browse their details, read their docs, and launch their separately deployed apps.
        </p>
        <p className="hosting-note">
          The Vault catalog links to static apps deployed separately from its interface.
        </p>
      </section>
      <section className="catalog-section" aria-labelledby="catalog-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COLLECTION</p>
            <h2 id="catalog-heading">Apps <span className="count">{apps.length}</span></h2>
          </div>
          <p>Choose a project to explore its details and documentation.</p>
        </div>
        <div className="app-grid">
          {apps.map((app) => <AppCard app={app} key={app.id} />)}
        </div>
      </section>
    </main>
  )
}

function AppDetailPage() {
  const { id } = useParams()
  const app = apps.find((entry) => entry.id === id)
  const [commandsVisible, setCommandsVisible] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  if (!app) return <NotFoundPage />

  const commandsToCopy = app.localRun.join('\n')

  async function copyRunCommands() {
    if (!navigator.clipboard?.writeText) {
      setCopyStatus('Clipboard access is unavailable. Select and copy the commands instead.')
      return
    }

    try {
      await navigator.clipboard.writeText(commandsToCopy)
      setCopyStatus('Commands copied.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown clipboard error'
      setCopyStatus(`Could not copy commands: ${message}`)
    }
  }

  return (
    <main className="page-shell detail-shell">
      <Link className="back-link" to="/">← Back to overview</Link>
      <section className="detail-panel">
        <div className="detail-title">
          <span className="app-icon app-icon-large" aria-hidden="true">{app.icon}</span>
          <div>
            <p className="eyebrow">APP PROFILE</p>
            <h1>{app.name}</h1>
          </div>
          <StatusBadge status={app.status} />
        </div>
        <p className="detail-description">{app.description}</p>
        <div className="tag-list">{app.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        <div className="metadata-grid">
          <section className="metadata-card">
            <h2>Technology</h2>
            <div className="tag-list">
              {app.techStack.map((technology) => <span className="tag tag-tech" key={technology}>{technology}</span>)}
            </div>
          </section>
          <section className="metadata-card">
            <h2>Run locally</h2>
            <p className="muted-copy">Run these commands from the repository root. The Vault cannot execute them for you.</p>
            {app.localRun.length > 0 ? (
              <>
                <button
                  aria-controls="run-commands"
                  aria-expanded={commandsVisible}
                  className="button button-quiet"
                  onClick={() => setCommandsVisible((visible) => !visible)}
                  type="button"
                >
                  {commandsVisible ? 'Hide commands' : 'Show commands'}
                </button>
                {commandsVisible && (
                  <div id="run-commands" className="run-commands">
                    <pre className="command-block"><code>{app.localRun.join('\n')}</code></pre>
                    <button className="button button-quiet" onClick={copyRunCommands} type="button">
                      Copy commands
                    </button>
                    {copyStatus && <p role="status" className="muted-copy">{copyStatus}</p>}
                  </div>
                )}
              </>
            ) : (
              <p className="muted-copy">No local run commands are configured yet.</p>
            )}
          </section>
        </div>
        <div className="detail-actions">
          <Link className="button button-quiet" to={`/apps/${app.id}/docs`}>Read documentation</Link>
          {app.liveUrl ? (
            <a className="button button-primary" href={app.liveUrl} target="_blank" rel="noopener noreferrer">
              Launch app ↗
            </a>
          ) : app.localRun.length > 0 ? (
            <button
              className="button button-primary"
              onClick={() => setCommandsVisible(true)}
              type="button"
            >
              Run locally
            </button>
          ) : (
            <button className="button button-disabled" disabled title="No live URL or local run commands are configured">
              No launch available
            </button>
          )}
        </div>
        {app.exampleNotice && (
          <p className="hosting-note detail-hosting-note">
            {app.exampleNotice}
          </p>
        )}
        {app.liveUrl && (
          <p className="hosting-note detail-hosting-note">
            This app is hosted externally at {app.liveUrl}. The Vault does not run it.
          </p>
        )}
        <p className="repo-path">Repository folder: <code>{app.repoPath}</code></p>
      </section>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="empty-state">
        <p className="eyebrow">404 · NOT FOUND</p>
        <h1>This page is not in the Vault.</h1>
        <p>The address may be outdated, or the app may have been removed.</p>
        <Link className="button button-primary" to="/">Return to overview</Link>
      </section>
    </main>
  )
}

export function App() {
  return (
    <HashRouter>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apps/:id" element={<AppDetailPage />} />
        <Route path="/apps/:id/docs" element={<Suspense fallback={<main className="page-shell"><p>Loading documentation…</p></main>}><DocsPage /></Suspense>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="site-footer">
        <span>THE VAULT <span aria-hidden="true">·</span> A STATIC PROJECT DIRECTORY</span>
        <span>Apps are maintained and hosted independently.</span>
      </footer>
    </HashRouter>
  )
}

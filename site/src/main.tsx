import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
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
      {app.liveUrl === 'https://example.com/' && <p className="placeholder-label">Illustrative launch URL</p>}
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
          The Vault is the front door to a collection of independent projects.
          Browse their details, read their docs, and visit externally hosted apps.
        </p>
        <p className="hosting-note">
          The Vault is a catalog only. It does not run or host the apps listed here.
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

  if (!app) return <NotFoundPage />

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
            <p className="muted-copy">These instructions are for the app repository, not The Vault.</p>
            <pre className="command-block"><code>{app.localRun.join('\n')}</code></pre>
          </section>
        </div>
        <div className="detail-actions">
          <Link className="button button-quiet" to={`/apps/${app.id}/docs`}>Read documentation</Link>
          {app.liveUrl ? (
            <a className="button button-primary" href={app.liveUrl} target="_blank" rel="noopener noreferrer">
              Launch externally ↗
            </a>
          ) : (
            <button className="button button-disabled" disabled title="No external launch URL is configured">
              Launch unavailable
            </button>
          )}
        </div>
        {app.liveUrl && (
          <p className="hosting-note detail-hosting-note">
            This app is hosted externally at {app.liveUrl}. The Vault does not run it.
            {app.liveUrl === 'https://example.com/' && ' This is an illustrative placeholder URL, not a deployment.'}
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

function App() {
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
)

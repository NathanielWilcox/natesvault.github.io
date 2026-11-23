export type AppStatus = 'planned' | 'in-progress' | 'live'

export interface VaultApp {
  id: string
  name: string
  description: string
  icon: string
  status: AppStatus
  tags: string[]
  repoPath: string
  docsPath: string
  techStack: string[]
  localRun: string[]
  liveUrl?: string
}

export const apps: VaultApp[] = [
  {
    id: 'starboard',
    name: 'Starboard',
    description: 'A lightweight launchpad for organizing personal projects and useful links.',
    icon: '🚀',
    status: 'live',
    tags: ['productivity', 'dashboard', 'sample'],
    repoPath: 'apps/starboard',
    docsPath: 'apps/starboard/README.md',
    techStack: ['React', 'TypeScript', 'Vite'],
    localRun: ['# Illustrative only: this catalog sample has no runnable source.'],
    liveUrl: 'https://example.com/',
  },
  {
    id: 'field-notes',
    name: 'Field Notes',
    description: 'An in-progress home for collecting notes, references, and small discoveries.',
    icon: '🗒️',
    status: 'in-progress',
    tags: ['notes', 'research', 'sample'],
    repoPath: 'apps/field-notes',
    docsPath: 'apps/field-notes/README.md',
    techStack: ['TypeScript', 'Vite'],
    localRun: ['# No runnable implementation yet; this project is in progress.'],
  },
]

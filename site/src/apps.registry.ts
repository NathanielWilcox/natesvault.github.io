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
  exampleNotice?: string
}

export const apps: VaultApp[] = [
  {
    id: 'starboard',
    name: 'Starboard',
    description: 'A small interactive counter demo for testing The Vault launch flow.',
    icon: '🚀',
    status: 'live',
    tags: ['productivity', 'dashboard', 'sample'],
    repoPath: 'apps/starboard',
    docsPath: 'apps/starboard/README.md',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    localRun: ['# Static demo is deployed by the GitHub Pages workflow.'],
    liveUrl: 'https://thevault.github.io/starboard/',
    exampleNotice: 'Template/example only — Starboard is not a real product.',
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

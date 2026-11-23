# The Vault

The Vault is a static monorepo front door for independent apps. It catalogs
projects, displays their documentation, and links to external deployments or
local-run instructions. The Vault does not run or host the listed apps.

## Repository layout

- `apps/` contains one folder per catalog entry. Each folder includes a `README.md`; GitHub Pages does not build these apps.
- `site/` contains the Vite, React, and TypeScript site deployed to the repository's GitHub Pages root site.
- `.github/workflows/deploy.yml` builds `site/` and deploys `site/dist` on pushes to `main` and on manual dispatch.

## Add an app

1. Add an app folder under `apps/` and write its `README.md`.
2. Add one typed entry to `site/src/apps.registry.ts`. Use a unique `id` and fill in the name, description, icon, status, tags, `repoPath`, `docsPath`, `techStack`, and `localRun`.
3. Set `status` to `planned`, `in-progress`, or `live`. A `live` entry is launchable only when it has a `liveUrl`.
4. Confirm the docs path is `apps/<id>/README.md`. The site bundles these files from `site/src` at build time.

## Configure an external live URL

Set `liveUrl` in the registry entry to the externally hosted app's HTTPS URL.
The Launch button opens that URL in a new tab; it does not start the app. Do not
set a URL until an external deployment exists. Starboard is a template/example,
not a real product; its `https://example.com/` URL is plain-text placeholder
metadata and is not a launch link.

## Run the site

```sh
cd site
npm install
npm run dev
```

The site uses HashRouter so app and documentation routes work on GitHub Pages.

## Test the site

```sh
cd site
npm test
npm run test:coverage
```

Vitest runs the site tests. Coverage includes all TypeScript and TSX source
files except the browser entry point and test setup. Vitest, jsdom, Testing
Library, and V8 coverage are dev-only tools for rendering UI tests and
measuring source coverage.

Every registry entry is tested through its detail and documentation routes.
When adding an app, page, or route, add focused behavior tests and set
per-component coverage thresholds in `site/vite.config.ts`. Run
`npm run test:coverage` before merging; deployment runs the same check.

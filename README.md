# The Vault

The Vault is a static monorepo front door for independent apps. It catalogs
projects, displays their documentation, and links to separately deployed
static apps or local-run instructions. App implementations remain independent
from the Vault UI.

## Repository layout

- `apps/` contains one folder per catalog entry, including its `README.md` and optional static client-side app source.
- `site/` contains the Vite, React, and TypeScript site deployed to the repository's GitHub Pages root site.
- `.github/workflows/deploy.yml` builds `site/` and deploys `site/dist` on pushes to `main` and on manual dispatch.

## Add an app

1. Add an app folder under `apps/` and write its `README.md`.
2. Add one typed entry to `site/src/apps.registry.ts`. Use a unique `id` and fill in the name, description, icon, status, tags, `repoPath`, `docsPath`, `techStack`, and `localRun`.
3. Set `status` to `planned`, `in-progress`, or `live`. A `live` entry is launchable only when it has a `liveUrl`.
4. Confirm the docs path is `apps/<id>/README.md`. The site bundles these files from `site/src` at build time.
5. Add the app's built static files to the Pages artifact in `.github/workflows/deploy.yml`.

## Configure a live app URL

Set `liveUrl` in the registry entry to the deployed app's HTTPS URL. The Launch
button opens that URL in a new tab. Do not set a URL until a deployment exists.
Apps may be deployed as separate static assets, including under a GitHub Pages
subpath. The deploy workflow publishes Starboard under `/starboard/` alongside
the Vault site. The Vault does not embed or execute app implementations.

Starboard is a template/example, not a real product. Its deployed counter is
for testing the Launch flow.

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

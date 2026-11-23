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
set a URL until an external deployment exists. The Starboard sample uses
`https://example.com/` as a clearly labeled placeholder.

## Run the site

```sh
cd site
npm install
npm run dev
```

The site uses HashRouter so app and documentation routes work on GitHub Pages.

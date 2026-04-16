# Test

An Angular 21 application that integrates with the AllHours API for managing users and absences.

## Prerequisites

- **Node.js** 20.x or newer ([download](https://nodejs.org/))
- **npm** 10.x or newer (comes with Node.js; this project is pinned to `npm@11.6.0` via `packageManager`)
- **Git** ([download](https://git-scm.com/))
- **Angular CLI** (optional — the project scripts work without a global install)

Verify your versions:

```bash
node --version
npm --version
```

## 1. Clone the repository

```bash
git clone <repository-url>
cd test
```

## 2. Install dependencies

```bash
npm install
```

## 3. Run the development server

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser. The dev server proxies OAuth requests to `login.spica.com` via [proxy.conf.json](proxy.conf.json) to avoid CORS issues.

The app reloads automatically when you edit source files.

## 4. Build for production

```bash
npm run build
```

Build artifacts are written to `dist/`. The production config minifies, optimizes, and hashes output filenames.

To serve the production build locally, use any static file server pointed at `dist/test/browser/`.

## Development scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the dev server on port 4200 with proxy. |
| `npm run build` | Production build into `dist/`. |
| `npm run watch` | Development build that rebuilds on file changes. |
| `npm test` | Run unit tests with Vitest. |

## Project structure

```
src/
├── app/
│   ├── core/              # Singleton services (Api, guards)
│   ├── pages/             # Route-level components (user-list, absence, settings)
│   └── shared/
│       ├── components/    # Reusable UI components
│       ├── model/         # TypeScript interfaces
│       └── styles/        # Shared stylesheets
├── environments/          # Environment config (git-ignored)
└── styles.css             # Global styles
```

## Troubleshooting

- **CORS error on `/auth/connect/token`** — ensure `proxy.conf.json` exists and `npm start` is used (not `ng serve` without the proxy config referenced in [angular.json](angular.json)).
- **`environment.ts` missing** — step 3 must be completed before the app will build.
- **Port 4200 in use** — run with a different port: `npm start -- --port 4300`.

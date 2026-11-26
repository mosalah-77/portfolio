# Portfolio

My portfolio site: Samepage, Oriel & Reed, FixCity, a small SSH honeypot and how I work.

**[See it live](https://portfolio.mosalah-77.workers.dev)**

React, TypeScript, React Router and the Motion library, built to static HTML and served by a Cloudflare Worker with static assets. Plain CSS and two self-hosted fonts.

## How it was made

I chose the goal, the copy rules and the look, and built the site with AI coding tools. I reviewed each round in the browser and sent back what didn't work. `DESIGN.md` records the choices.

## Run it

Needs Node.js 22.22 and npm 11.10 or newer.

```sh
npm ci
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run build` | Writes every page as HTML into `build/client`, then the security headers |
| `npm test` | Checks the built pages: links, titles, labels on made-up companies, text that shows before JavaScript runs, and the security headers |
| `npm run typecheck` | Checks the types |
| `npm run preview` | Serves the build the way Cloudflare will |

## Where things are

| File | What it holds |
| --- | --- |
| `app/content.ts` | Copy, links and the CV setting |
| `app/components/hero.tsx` | The scroll-driven review in the hero |
| `app/components/chapters.tsx` | The pinned project screens |
| `app/root.tsx` | Page transitions and scroll positions |
| `app/motion.tsx` | Shared motion helpers and the reduced-motion switch |

## Security

The site has no server code, forms, cookies or tracking. After each build, `scripts/finish-build.mjs` hashes every inline script into a Content Security Policy, so the browser runs only this site's own code and loads nothing from other sites. The other headers live in `headers.txt`.

`wrangler deploy` builds and tests first, so a build without its headers can't ship. `.npmrc` blocks install scripts, pins exact versions and skips any release under seven days old.

## Credits

Figtree, Bodoni Moda, Hanken Grotesk, Work Sans and JetBrains Mono are under the SIL Open Font License. Room photographs are by Spacejoy and Ali Moradi on Unsplash, used as reference images. FixCity began as a six-person team project; the team is credited in [its README](https://github.com/mosalah-77/FixCity).

# Tinder vs. Hinge Unit Economics

Interactive calculator for Columbia Business School's Technology Strategy course. Students adjust
assumptions about churn economics, market trajectory and network effects (or load a preset
scenario) to see which platform Match Group should prioritize, and can export the current view as
a PNG.

Vite 7 + React 19 static site, deployed on Vercel. No database and no server code.

## Commands

```bash
npm run dev       # dev server (needs .env.local, see below)
npm run build     # production build to dist/
npm run preview   # serve dist/
npm run lint      # ESLint
```

## Class hub sign-in and activity

Students sign in once, at the class hub. `src/lib/hub.ts` is the hub's browser kit (copied from the
hub repo's `kit/hub-client.ts`; don't edit it). `src/main.jsx` calls `initHub()` and
`requireUser()` before rendering: signed-out visitors go to the hub's `/renew`, which returns them
signed in. The app must be served under the hub's cookie domain (preview:
`clv.preview.cbs-tech-strategy.com`) so the browser sends the hub its session cookie.

Activity reported to the hub (`src/hubEvents.js`; reports are held in localStorage until the hub
has them):

- `run.completed` — the latest assumptions and results, sent once the student has stopped adjusting
  for 20 s (or leaves the page), only after they changed something. One entry per visit showing its
  latest state: scenario/preset, recommendation, CLV table, churn / market / network assumptions,
  market revenue projection.
- `export.png` — the student exported a view as a PNG, with the view, file name and the same
  snapshot at that moment.

Each report links back to the calculator with those assumptions in the query string
(`/?tab=…&tinderTenure=…`), which the app restores on load.

## Environment (build-time)

Copy `.env.example` to `.env.local` (local) or set in Vercel:

- `VITE_HUB_URL` — the hub, e.g. `https://preview.cbs-tech-strategy.com`
- `VITE_HUB_APP_SLUG` — `tinder-hinge-clv`

# California State Roleplay website

- `public/` holds the site: one page with the public homepage, the application forms (`#apply-<form>`) and the staff panel.
- `worker/index.js` holds the Cloudflare Worker. It handles Discord sign-in, stores panel data, connects to the ER:LC API and calls Claude.
- `DEPLOY.md` explains how to put it online.

Local development: `npm install`, then put test settings in `.dev.vars` and run `npm run dev`.

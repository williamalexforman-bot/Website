# California State Roleplay website

Live at https://california-staterp.netlify.app

- `public/` holds the site: one page with the public homepage, the application forms (`#apply-<form>`) and the staff panel.
- `server/core.js` holds the server logic: Discord sign-in, panel data rules, the ER:LC API, Claude and the bot inbox (`POST /api/bot/ingest`).
- `netlify/functions/app.mjs` runs it on Netlify, with data in Netlify Blobs (`server/blobstore.js`).
- `worker/index.js` and `wrangler.toml` run it on Cloudflare instead (optional).
- `DEPLOY.md` explains the setup.

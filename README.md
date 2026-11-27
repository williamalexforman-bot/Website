# California State Roleplay website

One page (`index.html`) holds the public site, the application forms (`#apply-<form>`) and the staff panel (`#overview` and the other panel pages).

- `assets/app.js` holds the routing and the staff panel logic
- `assets/styles.css` holds the theme

The panel stores its data with claude.ai artifact capabilities: `db` for shared data, `user` for who is signed in, and `sample` for Ask Goldie and AI Suggestions. It only works when opened through its claude.ai artifact link. Opened anywhere else, the panel says to open it on claude.ai.

Not connected yet: Discord sign-in, the Discord bot (transcripts, staff leavers) and the ER:LC API (map, players in server, Vision, running commands). These need a separate server that holds the bot's data and the ER:LC API key.

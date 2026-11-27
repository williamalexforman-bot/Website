# Putting the CSRP website online (Netlify)

The site lives at **https://california-staterp.netlify.app**. Netlify serves the pages from `public/`, and the function in
`netlify/functions/app.mjs` handles Discord sign-in, panel data (stored in Netlify Blobs), the ER:LC API, Claude and the bot.
You can do every step from a phone browser.

## 1. Deploy this code

1. In Netlify, open the **california-staterp** site, then **Site configuration > Build & deploy > Continuous deployment**.
2. Make sure it's linked to **williamalexforman-bot/website** and set the **production branch** to the branch with this code
   (`claude/cali-roleplay-website-design-7qsjpe`, or `main` after you merge it).
3. Leave the build command empty. `netlify.toml` sets the publish folder (`public`) and the functions folder.
4. Trigger a deploy (**Deploys > Trigger deploy**).

## 2. Connect Discord sign-in (California Operations app)

1. Open discord.com/developers/applications and open the **California Operations** app.
2. Go to **OAuth2**. Copy the **Client ID**. Tap **Reset Secret** to get the **Client Secret** and copy it.
   - Resetting the client secret doesn't change the bot token, so the bot keeps working.
3. Under **Redirects**, add `https://california-staterp.netlify.app/auth/callback` and save.

## 3. Make your two secrets

You create these yourself. Use a password generator, such as the iPhone Passwords app's "strong password" or any password manager, and make each 30+ characters.
Don't post them in Discord or in chat.

- **SESSION_SECRET** signs people in to the website. It only goes in Netlify.
- **BOT_INGEST_SECRET** is shared by the website and the bot. The same text goes in Netlify and on the bot's camelBots Secrets page.

## 4. Get the IDs and keys

- **Server and role IDs:** in Discord, turn on Settings > Advanced > Developer Mode.
  - Server ID: long-press your CSRP server's icon, then **Copy Server ID**.
  - Role IDs: in Server Settings > Roles, long-press a role, then **Copy Role ID**.
- **ER:LC server key:** in ER:LC, open your private server's settings and copy the API server key.
- **Claude API key (optional):** from console.anthropic.com, for Ask Goldie and AI Suggestions. Usage is billed to that account.

## 5. Add the settings to Netlify

Go to **Site configuration > Environment variables > Add a variable**. For each one, choose **Contains secret values** where marked.

| Key | Secret? | Value |
|---|---|---|
| DISCORD_CLIENT_ID | yes | Client ID from step 2 |
| DISCORD_CLIENT_SECRET | yes | Client Secret from step 2 |
| SESSION_SECRET | yes | From step 3 |
| BOT_INGEST_SECRET | yes | From step 3 |
| ERLC_SERVER_KEY | yes | ER:LC server key |
| ANTHROPIC_API_KEY | yes | Optional |
| DISCORD_GUILD_ID | no | Your CSRP server ID |
| STAFF_ROLE_IDS | no | Staff role IDs, separated by commas |
| HR_ROLE_IDS | no | HR/management role IDs, separated by commas |
| OWNER_IDS | no | Your own Discord user ID (always gets HR access) |

Then redeploy (**Deploys > Trigger deploy**) so the function picks them up.

## 6. Connect the California Operations bot

1. On the bot's camelBots page, open **Configuration** and set **SITE_URL** to `https://california-staterp.netlify.app`.
2. On the bot's **Secrets** page, add **BOT_INGEST_SECRET** with the same text as in Netlify, limited to `california-staterp.netlify.app`.
3. Publish the bot version with the website sync when camel-builder says it's finished. Check it doesn't include unfinished Fastpass work.
4. Run `/sitesync` in Discord once to send everything the bot already has.

## Who gets in

- Anyone can see the homepage.
- **Staff panel:** people sign in by approving California Operations on Discord. The panel reads their roles in your server.
  - People with an HR role, or listed in OWNER_IDS, get HR access.
  - People with a staff role get the panel.
  - Everyone else can only fill in application forms.
- The panel shows Discord usernames only, never real names.
- Role changes apply the next time someone signs in. Sign-ins last 12 hours.

## Cloudflare (optional)

The same code also runs on Cloudflare Workers (`wrangler.toml`, `worker/index.js`), using the same settings, if you ever move.

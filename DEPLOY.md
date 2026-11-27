# Putting the CSRP website online

The site runs on Cloudflare Workers (free plan). You can do every step from a phone browser.
You'll end up with an address like `https://csrp.<your-name>.workers.dev`. You can add your own domain later.

## 1. Put the site on Cloudflare

1. Make a free account at dash.cloudflare.com.
2. Go to **Workers & Pages** and tap **Create**, then **Import a repository**.
3. Connect GitHub, pick **williamalexforman-bot/website**, and choose the branch that has this code.
4. Leave the build settings as they are (the deploy command is `npx wrangler deploy`) and tap **Deploy**.
5. When it finishes, note your site address (`https://csrp.<something>.workers.dev`).

## 2. Connect Discord sign-in (California Operations app)

1. Open discord.com/developers/applications and open the **California Operations** app.
2. Go to **OAuth2**. Copy the **Client ID**. Tap **Reset Secret** to get the **Client Secret** and copy it.
   - Resetting the client secret doesn't change the bot token, so the bot keeps working.
3. Under **Redirects**, add `https://<your site address>/auth/callback` and save.

## 3. Get the IDs and keys

- **Server and role IDs:** in Discord, turn on Settings > Advanced > Developer Mode.
  - Server ID: long-press your CSRP server's icon, then **Copy Server ID**.
  - Role IDs: in Server Settings > Roles, long-press a role, then **Copy Role ID**.
- **ER:LC server key:** in ER:LC, open your private server's settings and copy the API server key.
- **Session secret:** any long random text (40+ characters). It signs people in, so don't share it.
- **Claude API key (optional):** from console.anthropic.com, for Ask Goldie and AI Suggestions.

## 4. Add the settings to Cloudflare

In Cloudflare, open the **csrp** Worker, then **Settings**, then **Variables and Secrets**. Add these:

| Name | Type | Value |
|---|---|---|
| DISCORD_CLIENT_ID | Secret | Client ID from step 2 |
| DISCORD_CLIENT_SECRET | Secret | Client Secret from step 2 |
| SESSION_SECRET | Secret | Your long random text |
| ERLC_SERVER_KEY | Secret | ER:LC server key |
| BOT_INGEST_SECRET | Secret | Another long random text, shared with the bot (step 5) |
| ANTHROPIC_API_KEY | Secret | Optional, for the AI features |
| DISCORD_GUILD_ID | Text | Your CSRP server ID |
| STAFF_ROLE_IDS | Text | Staff role IDs, separated by commas |
| HR_ROLE_IDS | Text | HR/management role IDs, separated by commas |
| OWNER_IDS | Text | Your own Discord user ID (always gets HR access) |

Tap **Deploy** (or push any change) so the new settings take effect.

## 5. Connect the California Operations bot

The bot sends tickets (for Transcripts), staff leavers, time-off requests and its staff list to the site.

1. Open the bot's page on bots.camelai.com and go to its settings.
2. Set **SITE_URL** to your site address, for example `https://csrp.yourname.workers.dev`.
3. Set **BOT_INGEST_SECRET** to the same text you used in step 4.
4. Publish the bot version with the website sync when you're ready. Check that it doesn't include unfinished Fastpass work.
5. Run `/sitesync` in Discord once to send everything the bot already has.

## Who gets in

- Anyone can see the homepage.
- **Staff panel:** people sign in by approving California Operations on Discord. The panel reads their roles in your server.
  - People with an HR role, or listed in OWNER_IDS, get HR access.
  - People with a staff role get the panel.
  - Everyone else can only fill in application forms.
- The panel shows Discord usernames only, never real names.
- Role changes apply the next time someone signs in. Sign-ins last 12 hours.

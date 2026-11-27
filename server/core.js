// California State Roleplay: the server side, shared by every host (Netlify, Cloudflare).
// Signs staff in with Discord, stores panel data, proxies the ER:LC API and Claude,
// and receives data from the California Operations bot.
// `handle(req, env, store)` returns a Response for /api/* and /auth/*, or null for anything else.
import Anthropic from "@anthropic-ai/sdk";

/* ---------------- Access levels & rules ---------------- */
const ORDER = { applicant: 0, staff: 1, admin: 2, bot: 99 }; // "bot": only the Discord bot writes, through /api/bot/ingest
// read/write: minimum level for any document in the collection.
// self: minimum level to read and write your own document (doc id = your Discord id).
const RULES = {
  profiles: { read: "staff", write: "admin", self: "staff" },
  shifts: { read: "staff", write: "admin", self: "staff" },
  log: { read: "staff", write: "admin", self: "staff" },
  loa: { read: "staff", write: "admin", self: "staff" },
  responses: { read: "admin", write: "admin", self: "applicant" },
  loadec: { read: "staff", write: "admin" },
  staffmeta: { read: "staff", write: "admin" },
  settings: { read: "staff", write: "admin" },
  training: { read: "staff", write: "admin" },
  departments: { read: "staff", write: "admin" },
  forms: { read: "applicant", write: "admin" },
  suggestions: { read: "admin", write: "admin" },
  punishments: { read: "staff", write: "staff" },
  alerts: { read: "staff", write: "staff" },
  // Sent by the California Operations bot
  transcripts: { read: "admin", write: "bot" },
  leavers: { read: "admin", write: "bot" },
  botloa: { read: "admin", write: "bot" },
  botstaff: { read: "staff", write: "bot" },
};
const SEG = /^[A-Za-z0-9_\-.~:@+]{1,200}$/;
const lv = s => ORDER[s?.level] ?? -1;
function canRead(col, id, s) { const r = RULES[col]; if (!r) return false; return lv(s) >= ORDER[r.read] || (!!r.self && id === s.id && lv(s) >= ORDER[r.self]); }
function canWrite(col, id, s) { const r = RULES[col]; if (!r) return false; return lv(s) >= ORDER[r.write] || (!!r.self && id === s.id && lv(s) >= ORDER[r.self]); }

/* ---------------- Storage helpers ---------------- */
// A store has async list(col, order, dir, limit), get(col, id), set(col, id, data),
// update(col, id, patch) -> boolean, delete(col, id) and count().
export const isObj = v => v && typeof v === "object" && !Array.isArray(v);
export function merge(a, b) { const out = { ...a }; for (const [k, v] of Object.entries(b)) out[k] = isObj(v) && isObj(a[k]) ? merge(a[k], v) : v; return out; }
const store = env => env.STORE_IMPL;

/* ---------------- Helpers ---------------- */
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers } });
const err = (status, message) => json({ error: message }, status);
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64u = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
async function hmac(secret, text) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text)));
}
function cookies(req) { return Object.fromEntries((req.headers.get("cookie") || "").split(/;\s*/).filter(Boolean).map(c => { const i = c.indexOf("="); return [c.slice(0, i), c.slice(i + 1)]; })); }
const cookie = (name, value, maxAge) => `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
const ids = v => String(v || "").split(",").map(s => s.trim()).filter(Boolean);
function safeEqual(a, b) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }

async function makeSession(env, s) { const body = b64u(new TextEncoder().encode(JSON.stringify(s))); return body + "." + (await hmac(env.SESSION_SECRET, body)); }
async function readSession(req, env) {
  const raw = cookies(req).csrp_s; if (!raw || !env.SESSION_SECRET) return null;
  const [body, sig] = raw.split("."); if (!body || !sig) return null;
  if (!safeEqual(sig, await hmac(env.SESSION_SECRET, body))) return null;
  try { const s = JSON.parse(new TextDecoder().decode(fromB64u(body))); return s.exp > Date.now() ? s : null; } catch { return null; }
}

/* ---------------- Discord sign-in ---------------- */
const SIGNIN_VARS = ["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET", "SESSION_SECRET", "DISCORD_GUILD_ID"];
const missingSignIn = env => SIGNIN_VARS.filter(k => !String(env[k] || "").trim());
// Which settings the server can see (yes/no only, never values), for setup checks.
function health(env) {
  const names = [...SIGNIN_VARS, "STAFF_ROLE_IDS", "HR_ROLE_IDS", "OWNER_IDS", "ERLC_SERVER_KEY", "BOT_INGEST_SECRET", "ANTHROPIC_API_KEY"];
  return json({ settings: Object.fromEntries(names.map(k => [k, !!String(env[k] || "").trim()])), missingForSignIn: missingSignIn(env) });
}
const DISCORD = "https://discord.com/api/v10";
async function login(req, env) {
  const url = new URL(req.url);
  if (missingSignIn(env).length) return new Response(null, { status: 302, headers: { location: "/#signin-error-setup" } });
  const next = (url.searchParams.get("next") || "overview").replace(/[^A-Za-z0-9-]/g, "").slice(0, 60);
  const state = b64u(crypto.getRandomValues(new Uint8Array(18)));
  const auth = new URL("https://discord.com/oauth2/authorize");
  auth.search = new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, response_type: "code", redirect_uri: url.origin + "/auth/callback", scope: "identify guilds.members.read", state });
  return new Response(null, { status: 302, headers: { location: auth.toString(), "set-cookie": cookie("csrp_state", `${state}.${next}`, 600) } });
}
async function callback(req, env) {
  const url = new URL(req.url), back = m => new Response(null, { status: 302, headers: { location: "/#signin-error-" + m, "set-cookie": cookie("csrp_state", "", 0) } });
  const [state, next] = (cookies(req).csrp_state || "").split(".");
  if (!state || !safeEqual(state, url.searchParams.get("state") || "")) return back("state");
  const code = url.searchParams.get("code"); if (!code) return back("cancelled");
  const tok = await fetch(DISCORD + "/oauth2/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: env.DISCORD_CLIENT_ID, client_secret: env.DISCORD_CLIENT_SECRET, grant_type: "authorization_code", code, redirect_uri: url.origin + "/auth/callback" }) });
  if (!tok.ok) return back("token");
  const { access_token } = await tok.json();
  const H = { authorization: "Bearer " + access_token };
  const meRes = await fetch(DISCORD + "/users/@me", { headers: H }); if (!meRes.ok) return back("user");
  const me = await meRes.json();
  let roles = [];
  const mem = await fetch(`${DISCORD}/users/@me/guilds/${env.DISCORD_GUILD_ID}/member`, { headers: H });
  if (mem.ok) roles = (await mem.json()).roles || [];
  const has = list => roles.some(r => ids(list).includes(r));
  const level = ids(env.OWNER_IDS).includes(me.id) || has(env.HR_ROLE_IDS) ? "admin" : has(env.STAFF_ROLE_IDS) ? "staff" : "applicant";
  const avatar = me.avatar ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=96` : "";
  const s = { id: me.id, name: me.username, avatar, level, exp: Date.now() + 12 * 3600e3 };
  if (level !== "applicant") {
    const st = store(env), cur = await st.get("profiles", me.id);
    await st.set("profiles", me.id, { joined: Date.now(), roblox: "", ...(cur || {}), discord: me.username, avatar });
  }
  const headers = new Headers({ location: "/#" + (next || "overview") });
  headers.append("set-cookie", cookie("csrp_s", await makeSession(env, s), 12 * 3600));
  headers.append("set-cookie", cookie("csrp_state", "", 0));
  return new Response(null, { status: 302, headers });
}

/* ---------------- Database API ---------------- */
async function dbApi(req, env, s, parts) {
  const [col, id] = parts;
  if (!SEG.test(col || "") || (id !== undefined && !SEG.test(id)) || parts.length > 2) return err(400, "Bad path");
  if (!RULES[col]) return err(404, "Unknown collection");
  const st = store(env), url = new URL(req.url);
  if (req.method === "GET" && id === undefined) {
    const docs = await st.list(col, url.searchParams.get("order"), url.searchParams.get("dir"), url.searchParams.get("limit"));
    return json({ docs: docs.filter(d => canRead(col, d.id, s)) });
  }
  if (req.method === "GET") { if (!canRead(col, id, s)) return json({ exists: false }); const data = await st.get(col, id); return json(data ? { exists: true, data } : { exists: false }); }
  let body = {};
  if (req.method !== "DELETE") {
    const text = await req.text(); if (text.length > 256 * 1024) return err(413, "Too large");
    try { body = JSON.parse(text); } catch { return err(400, "Bad JSON"); }
    if (!isObj(body.data)) return err(400, "data must be an object");
  }
  if (req.method === "POST" && id === undefined) {
    const newId = crypto.randomUUID().replace(/-/g, "").slice(0, 20);
    if (!canWrite(col, newId, s)) return err(403, "Not allowed");
    if ((await st.count()) > 25000) return err(507, "Storage full");
    await st.set(col, newId, guard(col, newId, body.data, s)); return json({ id: newId });
  }
  if (!canWrite(col, id, s)) return err(403, "Not allowed");
  if (req.method === "PUT") { await st.set(col, id, guard(col, id, body.data, s, await st.get(col, id))); return json({ ok: true }); }
  if (req.method === "PATCH") { return (await st.update(col, id, guard(col, id, body.data, s))) ? json({ ok: true }) : err(404, "Not found"); }
  if (req.method === "DELETE") { await st.delete(col, id); return json({ ok: true }); }
  return err(405, "Method not allowed");
}
// Fields the server owns: a staff member can't rename themselves or post as someone else.
function guard(col, id, data, s, cur) {
  const d = { ...data };
  if (col === "profiles") { d.discord = cur?.discord ?? (id === s.id ? s.name : d.discord); d.avatar = cur?.avatar ?? (id === s.id ? s.avatar : d.avatar); }
  if (["punishments", "alerts", "training"].includes(col) && "by" in d) d.by = s.id;
  if (col === "loadec") d.by = s.id;
  return d;
}

// Many collection reads in one request: {queries: [{col, order, dir, limit}]} -> {results: [[docs]...]}.
async function sync(req, env, s) {
  const { queries } = await req.json().catch(() => ({}));
  if (!Array.isArray(queries) || queries.length > 30) return err(400, "Bad queries");
  const st = store(env);
  const results = await Promise.all(queries.map(async q => {
    if (!RULES[q?.col] || !SEG.test(q.col)) return [];
    const docs = await st.list(q.col, q.order, q.dir, q.limit);
    return docs.filter(d => canRead(q.col, d.id, s));
  }));
  return json({ results });
}

/* ---------------- ER:LC API ---------------- */
const ERLC_PATHS = { server: "/v1/server", players: "/v1/server/players", queue: "/v1/server/queue", killlogs: "/v1/server/killlogs", joinlogs: "/v1/server/joinlogs", commandlogs: "/v1/server/commandlogs", modcalls: "/v1/server/modcalls", staff: "/v1/server/staff", vehicles: "/v1/server/vehicles" };
const cache = new Map();
async function erlc(req, env, s, kind) {
  if (lv(s) < ORDER.staff) return err(403, "Staff only");
  if (!env.ERLC_SERVER_KEY) return err(503, "The ER:LC server key isn't set up yet.");
  const base = env.ERLC_BASE || "https://api.policeroleplay.community";
  if (kind === "command" && req.method === "POST") {
    const { command } = await req.json().catch(() => ({}));
    const cmd = String(command || "").trim();
    if (!/^:[a-z]+/i.test(cmd) || cmd.length > 300) return err(400, "Commands start with a colon, like :h hello");
    const name = cmd.slice(1).split(/\s+/)[0].toLowerCase();
    const STAFF_CMDS = ["h", "m", "pm", "kick", "tp", "bring", "heal", "respawn", "refresh", "jail", "unjail", "wanted", "unwanted", "log"];
    if (!STAFF_CMDS.includes(name) && lv(s) < ORDER.admin) return err(403, `Only HR can run :${name}.`);
    const r = await fetch(base + "/v1/server/command", { method: "POST", headers: { "server-key": env.ERLC_SERVER_KEY, "content-type": "application/json" }, body: JSON.stringify({ command: cmd }) });
    if (!r.ok) return err(r.status === 429 ? 429 : 502, r.status === 429 ? "ER:LC is rate limiting. Try again in a few seconds." : "ER:LC didn't accept the command.");
    const st = store(env), cur = await st.get("log", s.id);
    await st.set("log", s.id, { items: [{ at: Date.now(), action: "Ran a command", target: cmd.slice(0, 80) }, ...(cur?.items || [])].slice(0, 150) });
    return json({ ok: true });
  }
  const path = ERLC_PATHS[kind]; if (!path || req.method !== "GET") return err(404, "Unknown");
  const hit = cache.get(kind);
  if (hit && Date.now() - hit.at < 15000) return json(hit.data);
  const r = await fetch(base + path, { headers: { "server-key": env.ERLC_SERVER_KEY } });
  if (!r.ok) { if (hit) return json(hit.data); return err(r.status === 429 ? 429 : 502, "Couldn't reach the ER:LC server."); }
  const data = await r.json();
  cache.set(kind, { at: Date.now(), data });
  return json(data);
}

/* ---------------- Claude (Ask Goldie, Suggestions) ---------------- */
const aiUse = new Map();
async function ai(req, env, s) {
  if (lv(s) < ORDER.staff) return err(403, "Staff only");
  if (!env.ANTHROPIC_API_KEY) return err(503, "AI isn't set up yet.");
  const now = Date.now(), recent = (aiUse.get(s.id) || []).filter(t => now - t < 60000);
  if (recent.length >= 10) return err(429, "Too many requests. Wait a minute.");
  aiUse.set(s.id, [...recent, now]);
  const { system, messages } = await req.json().catch(() => ({}));
  const msgs = (Array.isArray(messages) ? messages : []).slice(-20)
    .filter(m => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, 8000) }));
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return err(400, "Bad conversation");
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  try {
    const res = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: String(system || "").slice(0, 20000) || undefined,
      messages: msgs,
    });
    if (res.stop_reason === "refusal") return err(422, "Claude declined that request.");
    const text = res.content.filter(b => b.type === "text").map(b => b.text).join("").trim();
    return text ? json({ text }) : err(502, "Empty answer");
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return err(429, "AI is busy. Try again in a bit.");
    if (e instanceof Anthropic.AuthenticationError) return err(503, "The AI key is invalid.");
    if (e instanceof Anthropic.APIError) return err(502, "AI error " + e.status);
    return err(502, "AI request failed");
  }
}


/* ---------------- Discord bot inbox ---------------- */
const str = (v, n) => String(v ?? "").slice(0, n);
const num = v => (Number.isFinite(+v) ? +v : null);
const person = u => (u && u.id ? { id: str(u.id, 32), name: str(u.name, 64) } : null);
const docId = v => str(v, 180).replace(/[^A-Za-z0-9_\-.~:@+]/g, "_") || "x";
async function ingest(req, env) {
  const auth = req.headers.get("authorization") || "";
  if (!env.BOT_INGEST_SECRET || !safeEqual(auth, "Bearer " + env.BOT_INGEST_SECRET)) return err(401, "Bad bot secret");
  const text = await req.text(); if (text.length > 1024 * 1024) return err(413, "Too large");
  let body; try { body = JSON.parse(text); } catch { return err(400, "Bad JSON"); }
  const d = isObj(body?.data) ? body.data : null; if (!d) return err(400, "data must be an object");
  const st = store(env);
  if (body.type === "transcript") {
    if (!d.ticketId) return err(400, "ticketId required");
    const id = docId(d.ticketId), cur = (await st.get("transcripts", id)) || {};
    const t = {
      ...cur, number: str(d.number, 20), type: str(d.type, 60), openedBy: person(d.openedBy), claimedBy: person(d.claimedBy),
      subject: str(d.subject, 200), openedAt: num(d.openedAt), firstReplyAt: num(d.firstReplyAt), closedAt: num(d.closedAt), closedBy: person(d.closedBy),
    };
    if (Array.isArray(d.messages)) {
      let msgs = d.messages.slice(-300).map(m => ({ author: person(m.author), content: str(m.content, 1000), at: num(m.at) }));
      while (msgs.length && JSON.stringify(msgs).length > 200 * 1024) msgs = msgs.slice(10);
      t.messages = msgs;
    }
    await st.set("transcripts", id, t); return json({ ok: true });
  }
  if (body.type === "staff_left") {
    const u = person(d.user); if (!u) return err(400, "user required");
    const at = num(d.at) || Date.now();
    await st.set("leavers", docId(u.id + "-" + at), { user: u, how: str(d.how, 40), at, roles: (Array.isArray(d.roles) ? d.roles : []).slice(0, 60).map(r => str(r, 60)) });
    return json({ ok: true });
  }
  if (body.type === "loa") {
    const u = person(d.user); if (!u || !d.id) return err(400, "id and user required");
    await st.set("botloa", docId(d.id), { user: u, from: str(d.from, 10), to: str(d.to, 10), reason: str(d.reason, 1000), status: str(d.status, 20), decidedBy: person(d.decidedBy), at: num(d.at) || Date.now() });
    return json({ ok: true });
  }
  if (body.type === "staff") {
    const u = person(d.user); if (!u) return err(400, "user required");
    await st.set("botstaff", docId(u.id), { user: u, rank: str(d.rank, 60), strikes: num(d.strikes) || 0, warnings: num(d.warnings) || 0, onLoa: !!d.onLoa, at: Date.now() });
    return json({ ok: true });
  }
  return err(400, "Unknown type");
}

/* ---------------- Router ---------------- */
// Short names people commonly use in their host's settings are accepted too.
const ALIASES = { DISCORD_CLIENT_ID: ["CLIENT_ID"], DISCORD_CLIENT_SECRET: ["CLIENT_SECRET"], DISCORD_GUILD_ID: ["GUILD_ID", "SERVER_ID"], ERLC_SERVER_KEY: ["ERLC_KEY", "SERVER_KEY"] };
function withAliases(env) {
  const out = { ...env };
  for (const [name, alts] of Object.entries(ALIASES)) if (!String(out[name] || "").trim()) out[name] = alts.map(a => env[a]).find(v => String(v || "").trim()) || out[name];
  for (const k of Object.keys(out)) if (typeof out[k] === "string") out[k] = out[k].trim();
  return out;
}

export async function handle(req, env, storeImpl) {
  env = { ...withAliases(env), STORE_IMPL: storeImpl };
  {
    const url = new URL(req.url), p = url.pathname;
    try {
      if (p === "/auth/login") return await login(req, env);
      if (p === "/auth/callback") return await callback(req, env);
      if (p === "/auth/logout") return new Response(null, { status: 302, headers: { location: "/", "set-cookie": cookie("csrp_s", "", 0) } });
      if (p === "/api/bot/ingest" && req.method === "POST") return await ingest(req, env);
      if (p === "/api/health") return health(env);
      if (p.startsWith("/api/")) {
        // Same-origin only for writes (cookies are SameSite=Lax; this blocks cross-site form posts too).
        if (req.method !== "GET" && req.headers.get("origin") && req.headers.get("origin") !== url.origin) return err(403, "Bad origin");
        const s = await readSession(req, env);
        if (p === "/api/me") return s ? json({ id: s.id, name: s.name, avatar: s.avatar, level: s.level }) : err(401, "Signed out");
        if (!s) return err(401, "Signed out");
        const parts = p.split("/").slice(3).map(decodeURIComponent);
        if (p === "/api/sync" && req.method === "POST") return await sync(req, env, s);
        if (p.startsWith("/api/db/")) return await dbApi(req, env, s, parts);
        if (p.startsWith("/api/erlc/")) return await erlc(req, env, s, parts[0]);
        if (p === "/api/ai" && req.method === "POST") return await ai(req, env, s);
        return err(404, "Not found");
      }
      return null;
    } catch (e) {
      console.error(e);
      return err(500, "Server error");
    }
  }
}

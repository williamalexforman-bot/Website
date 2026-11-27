// California State Roleplay on Cloudflare Workers (optional host; Netlify is the main one).
// Serves /public through the ASSETS binding and keeps panel data in a SQLite Durable Object.
import { DurableObject } from "cloudflare:workers";
import { handle, merge, gameLogTick } from "../server/core.js";

export class Store extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec("CREATE TABLE IF NOT EXISTS docs (col TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, at INTEGER NOT NULL, PRIMARY KEY (col, id))");
  }
  list(col, order, dir, limit) {
    const lim = Math.min(Math.max(+limit || 500, 1), 1000);
    const rows = order && /^[A-Za-z0-9_]{1,40}$/.test(order)
      ? this.sql.exec(`SELECT id, data FROM docs WHERE col = ? ORDER BY json_extract(data, ?) ${dir === "desc" ? "DESC" : "ASC"} LIMIT ?`, col, "$." + order, lim).toArray()
      : this.sql.exec("SELECT id, data FROM docs WHERE col = ? ORDER BY id LIMIT ?", col, lim).toArray();
    return rows.map(r => ({ id: r.id, data: JSON.parse(r.data) }));
  }
  get(col, id) { const r = this.sql.exec("SELECT data FROM docs WHERE col = ? AND id = ?", col, id).toArray()[0]; return r ? JSON.parse(r.data) : null; }
  set(col, id, data) {
    this.sql.exec("INSERT INTO docs (col, id, data, at) VALUES (?, ?, ?, ?) ON CONFLICT(col, id) DO UPDATE SET data = excluded.data, at = excluded.at", col, id, JSON.stringify(data), Date.now());
  }
  update(col, id, patch) { const cur = this.get(col, id); if (!cur) return false; this.set(col, id, merge(cur, patch)); return true; }
  delete(col, id) { this.sql.exec("DELETE FROM docs WHERE col = ? AND id = ?", col, id); }
  count() { return this.sql.exec("SELECT COUNT(*) AS n FROM docs").toArray()[0].n; }
}

export default {
  async fetch(req, env) {
    const res = await handle(req, env, env.STORE.get(env.STORE.idFromName("csrp")));
    return res || env.ASSETS.fetch(req);
  },
  // Every minute: copy new ER:LC kills, joins, commands and mod calls to Discord.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(gameLogTick(env, env.STORE.get(env.STORE.idFromName("csrp"))));
  },
};

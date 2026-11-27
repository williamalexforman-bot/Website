// Panel storage on Netlify Blobs: one blob per document, key "<collection>/<id>".
// Lists re-read only the documents whose etag changed since this function instance last saw them.
import { merge } from "./core.js";

export function blobStore(blobs) {
  const cache = new Map(); // key -> { etag, data }
  const key = (col, id) => `${col}/${id}`;
  async function read(k, etag) {
    const hit = cache.get(k);
    if (hit && etag && hit.etag === etag) return hit.data;
    const r = await blobs.getWithMetadata(k, { type: "json" });
    if (!r) { cache.delete(k); return null; }
    cache.set(k, { etag: r.etag, data: r.data });
    return r.data;
  }
  return {
    async list(col, order, dir, limit) {
      const { blobs: items } = await blobs.list({ prefix: col + "/" });
      const docs = (await Promise.all(items.map(async b => ({ id: b.key.slice(col.length + 1), data: await read(b.key, b.etag) }))))
        .filter(d => d.data && !d.id.includes("/"));
      if (order && /^[A-Za-z0-9_]{1,40}$/.test(order)) {
        const v = d => d.data[order];
        docs.sort((a, b) => (v(a) === v(b) ? 0 : v(a) === undefined ? 1 : v(b) === undefined ? -1 : (v(a) < v(b) ? -1 : 1) * (dir === "desc" ? -1 : 1)));
      } else docs.sort((a, b) => (a.id < b.id ? -1 : 1));
      return docs.slice(0, Math.min(Math.max(+limit || 500, 1), 1000));
    },
    async get(col, id) { return read(key(col, id)); },
    async set(col, id, data) { const r = await blobs.setJSON(key(col, id), data); cache.set(key(col, id), { etag: r?.etag, data }); },
    async update(col, id, patch) { const cur = await read(key(col, id)); if (!cur) return false; await this.set(col, id, merge(cur, patch)); return true; },
    async delete(col, id) { await blobs.delete(key(col, id)); cache.delete(key(col, id)); },
    async count() { return (await blobs.list()).blobs.length; },
  };
}

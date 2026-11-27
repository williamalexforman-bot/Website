/* Runs only on the real website (not inside claude.ai). Gives the panel the same
   data, user and AI interface it uses on claude.ai, backed by this site's own server. */
(() => {
  if (window.claude && window.claude.use) return;
  window.CSRP_HOST = true;

  async function api(method, url, body) {
    const r = await fetch(url, { method, credentials: "same-origin", headers: body ? { "content-type": "application/json" } : {}, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 401) throw { code: "signed_out", status: 401 };
    if (r.status === 403 || r.status === 404 || r.status === 400) throw { code: "invalid_argument", status: r.status };
    if (r.status === 507) throw { code: "quota_exceeded", status: r.status };
    if (!r.ok) throw { code: "unavailable", status: r.status };
    return r.json();
  }
  const meP = fetch("/api/me", { credentials: "same-origin" }).then(r => (r.ok ? r.json() : null)).catch(() => null);

  const listeners = new Set();
  const refreshAll = () => listeners.forEach(f => f());
  const snapDoc = (id, data) => ({ id, exists: data !== undefined, data: () => data, metadata: { fromCache: false, hasPendingWrites: false } });

  function query(col, o = {}) {
    const q = {
      where: () => q,
      orderBy: (f, d = "asc") => query(col, { ...o, f, d }),
      limit: n => query(col, { ...o, n }),
      async get() {
        const p = new URLSearchParams();
        if (o.f) { p.set("order", o.f); p.set("dir", o.d); }
        if (o.n) p.set("limit", o.n);
        const r = await api("GET", `/api/db/${encodeURIComponent(col)}?${p}`);
        const docs = r.docs.map(d => snapDoc(d.id, d.data));
        return { docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: { fromCache: false, hasPendingWrites: false } };
      },
      onSnapshot(next, onErr) {
        let stopped = false, busy = false;
        const run = async () => {
          if (stopped || busy || document.hidden) return;
          busy = true;
          try { next(await q.get()); } catch (e) { if (e.status === 401) { stopped = true; onErr && onErr(e); } }
          busy = false;
        };
        run();
        const t = setInterval(run, 8000);
        listeners.add(run);
        document.addEventListener("visibilitychange", run);
        return () => { stopped = true; clearInterval(t); listeners.delete(run); };
      },
    };
    return q;
  }
  function docRef(path) {
    const [col, id] = path.split("/");
    const u = `/api/db/${encodeURIComponent(col)}/${encodeURIComponent(id)}`;
    return {
      id, path,
      async get() { const r = await api("GET", u); return snapDoc(id, r.exists ? r.data : undefined); },
      async set(data) { await api("PUT", u, { data }); refreshAll(); },
      async update(data) { await api("PATCH", u, { data }); refreshAll(); },
      async delete() { await api("DELETE", u); refreshAll(); },
      collection() { throw new TypeError("Nested collections aren't supported"); },
    };
  }
  const db = {
    doc: docRef,
    collection: col => Object.assign(query(col), {
      path: col,
      doc: id => docRef(col + "/" + (id || crypto.randomUUID().replace(/-/g, "").slice(0, 20))),
      add: async data => { const r = await api("POST", `/api/db/${encodeURIComponent(col)}`, { data }); refreshAll(); return docRef(col + "/" + r.id); },
    }),
  };

  function makeUser(me) {
    const admin = me.level === "admin";
    return {
      me: async () => ({ id: me.id, name: me.name, avatarUrl: me.avatar || "", color: "#6cc4f5", email: null, isOwner: false, canEdit: admin, level: me.level }),
      id: async () => me.id,
      isOwner: async () => false,
      canEdit: async () => admin,
      can: async n => (n === "data.write" ? me.level !== "applicant" : false),
      profiles: async ids => Object.fromEntries([].concat(ids).map(i => [i, { id: i, name: "", avatarUrl: "", isMe: i === me.id }])),
    };
  }

  // Claude through the site's server. Mirrors the claude.ai sample() call shape the panel uses.
  async function ask(input) {
    let system = "", messages = typeof input === "string" ? [{ role: "user", content: input }] : input.slice();
    if (messages.length > 1 && messages[0].role === "user" && messages[1].role === "user") system = messages.shift().content;
    const r = await fetch("/api/ai", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ system, messages }) });
    if (!r.ok) throw { code: r.status === 429 ? "rate_limited" : r.status === 503 || r.status === 403 ? "sampling_disabled" : r.status === 422 ? "refused" : "upstream_error" };
    return (await r.json()).text;
  }
  const sample = Object.assign(
    async (input, opts = {}) => { const text = await ask(input); opts.onText && opts.onText({ text, delta: text }); return { text, truncated: false }; },
    {
      json: async input => {
        const text = await ask(input);
        const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        const raw = m ? m[1] : text.slice(Math.min(...["[", "{"].map(c => (text.indexOf(c) + 1 || 1e9) - 1)), Math.max(text.lastIndexOf("]"), text.lastIndexOf("}")) + 1);
        try { return JSON.parse(raw); } catch { throw { code: "invalid_json", text }; }
      },
    },
  );

  window.CSRP_ME = meP;
  window.claude = {
    use: async name => {
      const me = await meP;
      if (!me) return null;
      if (name === "db") return db;
      if (name === "user") return makeUser(me);
      if (name === "sample") return me.level === "applicant" ? null : sample;
      return null;
    },
  };
})();

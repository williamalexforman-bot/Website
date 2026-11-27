/* California State Roleplay: site, forms and staff panel.
   Shared data, sign-in and AI run on claude.ai artifact capabilities (db, user, sample). */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/* ---------------- Icons ---------------- */
const I = {
  home: '<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  gavel: '<path d="M14 13l-7 7-3-3 7-7M13 3l8 8M9 7l8 8M16 4l4 4"/>',
  term: '<path d="M4 17l6-5-6-5M12 19h8"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
  users: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a4 4 0 0 0-3-3.9"/>',
  map: '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z"/><path d="M8 2v16M16 6v16"/>',
  ticket: '<path d="M3 7a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-3a2 2 0 0 0 0-4z"/>',
  grad: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  door: '<path d="M14 3h5v18h-5M10 17l5-5-5-5M15 12H3"/>',
  spark: '<path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>',
  shield: '<path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z"/>',
  form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  arrowL: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  arrowR: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  idcard: '<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8 17c1-2 7-2 8 0"/>',
  plane: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>',
  book: '<path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>',
  radio: '<circle cx="12" cy="12" r="2"/><path d="M16.2 7.8a6 6 0 0 1 0 8.5M7.8 16.2a6 6 0 0 1 0-8.5M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>',
  pulse: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  clipboard: '<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 2h6v4H9zM9 11h.01M13 11h3M9 15h.01M13 15h3"/>',
  alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
  scroll: '<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4M19 17V5a2 2 0 0 0-2-2H4M10 8h6M10 12h6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  pin: '<path d="M12 22s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  play: '<path d="M6 4l14 8-14 8z"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="1"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
  fileplus: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 12v6M9 15h6"/>',
  discord: '<path d="M8 12h.01M16 12h.01M7.5 7.5c3-1 6-1 9 0M7.5 16.5c3 1 6 1 9 0"/><path d="M15.5 17l1 2c2-.5 3.5-1.3 5-2.5.4-4.5-.8-8.4-3-11.5-1.4-.7-2.8-1.1-4.3-1.3l-.7 1.5M8.5 17l-1 2c-2-.5-3.5-1.3-5-2.5-.4-4.5.8-8.4 3-11.5 1.4-.7 2.8-1.1 4.3-1.3l.7 1.5"/>',
  roblox: '<path d="M5.2 2L2 18.8 18.8 22 22 5.2z"/><path d="M10 9.5l4.5 1-1 4.5-4.5-1z"/>',
};
const icon = (n, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;

/* ================= Helpers ================= */
const H = 3600e3, D = 24 * H;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600); }
function modal(html) { $("#modal").innerHTML = html; $("#modalBg").classList.add("open"); }
function closeModal() { $("#modalBg").classList.remove("open"); }
$("#modalBg").addEventListener("click", e => { if (e.target.id === "modalBg" || e.target.closest("[data-close]")) closeModal(); });
const fmtMin = m => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);
const fmtShort = t => new Date(t).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const fmtDay = t => new Date(t).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
function ago(t) { const d = Date.now() - t; return d < 60e3 ? "just now" : d < H ? `${Math.round(d / 60e3)}m ago` : d < D ? `${Math.round(d / H)}h ago` : `${Math.round(d / D)}d ago`; }
const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
const head = (title, sub = "") => `<a class="back" href="#overview">${icon("arrowL", 16)} Back to Overview</a>
<div class="page-head"><div><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ""}</div></div>`;
const empty = (msg) => `<div class="card pad muted">${msg}</div>`;
const notLinked = (what) => `<div class="card pad nl"><span class="t-ico">${icon("pulse")}</span><div><b>Not connected yet</b><p class="muted">${what}</p></div></div>`;
const GAME_MSG = "This page needs a live link to the ER:LC private server API, which this host can't reach. It fills in once CSRP has a small server that holds the API key.";
const BOT_MSG = "This page needs the Discord bot to send its data to the panel, which this host can't receive. It fills in once CSRP has a small server the bot can talk to.";

/* ================= State ================= */
const S = {
  phase: "connecting", // connecting | offline | signin | noaccess | ready
  host: !!window.CSRP_HOST, level: "staff", applicant: false,
  db: null, user: null, sample: null, me: null, uid: null, isAdmin: false, readOnly: false,
  profiles: {}, staffmeta: {}, shifts: {}, logs: {}, loa: {}, loadec: {}, settings: {},
  punishments: [], alerts: [], training: [], departments: [], forms: [], suggestions: [], responses: {},
  transcripts: [], leavers: [], botloa: [], botstaff: {},
  loaded: new Set(), names: {}, slow: false,
};
const docsMap = snap => Object.fromEntries(snap.docs.map(d => [d.id, d.data()]));
const docsArr = snap => snap.docs.map(d => ({ id: d.id, ...d.data() }));

/* Serialize writes per document */
const queues = {};
function serial(path, fn) { const p = (queues[path] || Promise.resolve()).then(fn, fn); queues[path] = p.catch(() => {}); return p; }
async function save(path, fn, okMsg) {
  try { await serial(path, fn); if (okMsg) toast(okMsg); return true; }
  catch (e) {
    const code = e?.code;
    if (code === "invalid_argument") { S.readOnly = true; toast("You can view the panel but not change it. Ask HR for Contributor access."); }
    else if (code === "quota_exceeded") toast("The panel's storage is full. Ask HR to clear old records.");
    else toast("Couldn't save. Check your connection and try again.");
    render(true); return false;
  }
}

/* ================= Names & avatars ================= */
// Only Discord usernames are shown. Real account names are never displayed.
function wantNames() {}
const nameOf = uid => S.profiles[uid]?.discord || S.botstaff[uid]?.user?.name || (S.host && uid === S.uid ? S.me?.name : "") || "Unnamed staff";
function avatar(uid, size = 36) {
  const url = S.profiles[uid]?.avatar || (S.host && uid === S.uid ? S.me?.avatarUrl : "");
  if (url && /^https:\/\/cdn\.discordapp\.com\//.test(url)) return `<img class="avatar" alt="" style="width:${size}px;height:${size}px" src="${esc(url)}">`;
  const n = nameOf(uid);
  return `<span class="avatar" style="width:${size}px;height:${size}px;background:#2a3340;color:#fff">${esc(n === "Unnamed staff" ? "?" : n.slice(0, 2).toUpperCase())}</span>`;
}

/* ================= Shift maths ================= */
function weekStart() { const d = new Date(); const r = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - d.getUTCDay(), 21)); if (r > d) r.setUTCDate(r.getUTCDate() - 7); return +r; }
const quota = () => +(S.settings.panel?.quota) || 30;
const shiftDoc = uid => S.shifts[uid] || { active: null, log: [] };
function minutesSince(uid, since) {
  const sd = shiftDoc(uid);
  let m = (sd.log || []).filter(s => s.e >= since).reduce((a, s) => a + (s.s >= since ? s.m : Math.max(0, Math.floor((s.e - since) / 60e3))), 0);
  if (sd.active) m += Math.floor((Date.now() - Math.max(sd.active, since)) / 60e3);
  return m;
}
const totalMinutes = uid => minutesSince(uid, 0);
function resetsIn() { const ms = weekStart() + 7 * D - Date.now(); return `${Math.floor(ms / D)}d ${Math.floor((ms % D) / H)}h`; }
const onDutyIds = () => Object.keys(S.shifts).filter(u => S.shifts[u]?.active);
function onLeave(uid) {
  const today = new Date().toISOString().slice(0, 10);
  return (S.loa[uid]?.requests || []).some(r => !r.cancelled && S.loadec[r.id]?.status === "approved" && r.from <= today && r.to >= today);
}

/* ================= Writers ================= */
function logActivity(action, target = "") {
  const path = "log/" + S.uid;
  return save(path, () => S.db.doc(path).set({ items: [{ at: Date.now(), action, target }, ...(S.logs[S.uid]?.items || [])].slice(0, 150) }));
}
async function toggleShift() {
  if (!ready()) return;
  const path = "shifts/" + S.uid, sd = shiftDoc(S.uid), now = Date.now();
  if (sd.active) {
    const m = Math.floor((now - sd.active) / 60e3);
    const ok = await save(path, () => S.db.doc(path).set({ active: null, mode: "", log: [{ s: sd.active, e: now, m }, ...(sd.log || [])].slice(0, 400) }), `Shift ended · ${fmtMin(m)} counted`);
    if (ok) logActivity("Ended a shift", fmtMin(m));
  } else {
    const ok = await save(path, () => S.db.doc(path).set({ active: now, mode: "", log: sd.log || [] }), "Shift started");
    if (ok) logActivity("Started a shift");
  }
}
const ready = () => S.phase === "ready";

/* ================= Data connection ================= */
let renderQueued = false, renderDirty = false;
function render(keepScroll = true) {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    const a = document.activeElement;
    if (a && $("#view")?.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { renderDirty = true; return; }
    route(keepScroll);
  });
}
document.addEventListener("focusout", () => { if (renderDirty) { renderDirty = false; setTimeout(() => render(true), 0); } });

function listen(name, ref, apply) {
  ref.onSnapshot(snap => { apply(snap); if (!snap.metadata.fromCache) S.loaded.add(name); render(true); },
    err => { console.warn(name, err?.code); S.loaded.add(name); render(true); });
}
function subscribeAll() {
  const db = S.db;
  if (S.applicant) { listen("forms", db.collection("forms"), s => { S.forms = docsArr(s); }); return; }
  listen("profiles", db.collection("profiles"), s => { S.profiles = docsMap(s); });
  listen("staffmeta", db.collection("staffmeta"), s => { S.staffmeta = docsMap(s); });
  listen("shifts", db.collection("shifts"), s => { S.shifts = docsMap(s); });
  listen("log", db.collection("log"), s => { S.logs = docsMap(s); });
  listen("loa", db.collection("loa"), s => { S.loa = docsMap(s); });
  listen("loadec", db.collection("loadec"), s => { S.loadec = docsMap(s); });
  listen("settings", db.collection("settings"), s => { S.settings = docsMap(s); });
  listen("punishments", db.collection("punishments").orderBy("at", "desc").limit(500), s => { S.punishments = docsArr(s); });
  listen("alerts", db.collection("alerts").orderBy("at", "desc").limit(30), s => { S.alerts = docsArr(s); });
  listen("training", db.collection("training").orderBy("at", "desc").limit(300), s => { S.training = docsArr(s); });
  listen("departments", db.collection("departments"), s => { S.departments = docsArr(s); });
  listen("forms", db.collection("forms"), s => { S.forms = docsArr(s); });
  if (S.host) listen("botstaff", db.collection("botstaff"), s => { S.botstaff = docsMap(s); });
  if (S.host && S.isAdmin) {
    listen("transcripts", db.collection("transcripts").orderBy("openedAt", "desc").limit(1000), s => { S.transcripts = docsArr(s); });
    listen("leavers", db.collection("leavers").orderBy("at", "desc").limit(300), s => { S.leavers = docsArr(s); });
    listen("botloa", db.collection("botloa").orderBy("at", "desc").limit(300), s => { S.botloa = docsArr(s); });
  }
  if (S.isAdmin) {
    listen("suggestions", db.collection("suggestions").orderBy("at", "desc").limit(40), s => { S.suggestions = docsArr(s); });
    listen("responses", db.collection("responses"), s => { S.responses = docsMap(s); });
  }
  setTimeout(() => { if (!S.applicant && S.loaded.size < 8) { S.slow = true; render(true); } }, 10000);
}
async function registerProfile() {
  try {
    const ref = S.db.doc("profiles/" + S.uid), d = await ref.get();
    if (!d.exists) await serial(ref.path, () => ref.set({ joined: Date.now(), discord: "", roblox: "" }));
  } catch (e) { if (e?.code === "invalid_argument") { S.readOnly = true; render(true); } }
}
async function boot() {
  route(false);
  if (!window.claude?.use) { S.phase = "offline"; route(false); return; }
  const [db, user, sample] = await Promise.all(["db", "user", "sample"].map(n => window.claude.use(n).catch(() => null)));
  Object.assign(S, { db, user, sample });
  if (user) {
    S.me = await user.me(); S.uid = S.me.id; S.isAdmin = !!S.me.canEdit;
    S.level = S.me.level || (S.isAdmin ? "admin" : "staff"); S.applicant = S.level === "applicant";
    const w = await user.can("data.write"); if (w === false && !S.applicant) S.readOnly = true;
  }
  if (!db || !S.uid) { S.phase = S.host ? "signin" : "noaccess"; route(false); return; }
  S.phase = "ready";
  subscribeAll();
  if (!S.host && !S.applicant) registerProfile();
  if (S.host && !S.applicant) { pollGame(); setInterval(() => { if (!document.hidden) pollGame(); }, 60000); }
  setInterval(tick, 1000);
  route(false);
}

/* ================= Navigation ================= */
const NAV = [
  ["Me", [["overview", "Overview", "grid"], ["shifts", "My shifts", "clock"], ["profile", "Profile", "idcard"], ["timeoff", "Time off", "plane"], ["activity", "My activity", "history"], ["guide", "Guide", "book"]]],
  ["Staff", [["onduty", "On duty", "radio"], ["coverage", "Coverage", "pulse"], ["leaderboard", "Leaderboard", "trophy"], ["departments", "Departments", "shield"], ["assistant", "Ask Goldie", "chat"], ["forms", "Forms", "form"]]],
  ["HR", [["staff", "Staff management", "users"], ["ai", "Suggestions", "clipboard"], ["training", "Staff training", "grad"], ["leavers", "Staff leavers", "alert"], ["transcripts", "Transcripts", "scroll"], ["log", "Website log", "pulse"]]],
  ["In game", [["map", "Map", "pin"], ["players", "Players", "search"], ["vision", "Vision", "eye"], ["commands", "Commands", "term"], ["punishments", "Punishments", "gavel"]]],
];
const HR_PAGES = new Set(NAV[2][1].map(i => i[0]));
const TITLES = { ...Object.fromEntries(NAV.flatMap(g => g[1]).map(([k, t]) => [k, t])), coverage: "Staff coverage", profile: "My Profile", ai: "AI Suggestions", "guide-staff": "Staff guide", "guide-instructor": "Staff instructor guide" };
function buildNav(cur) {
  const active = cur.startsWith("guide") ? "guide" : cur;
  $("#drawerNav").innerHTML = NAV.filter(([g]) => g !== "HR" || S.isAdmin).map(([g, items]) => `<div class="grp">${g}</div>${items.map(([k, t, ic]) => `<a class="item ${k === active ? "active" : ""}" href="#${k}">${icon(ic)}${t}</a>`).join("")}`).join("")
    + `<div class="grp">${S.isAdmin ? "HR access" : "Staff access"}</div><a class="item" href="#home">${icon("arrowL")}Back to website</a>`
    + (S.host ? `<a class="item" href="/auth/logout">${icon("logout")}Sign out</a>` : "");
}
function setDrawer(open) { $("#drawer").classList.toggle("open", open); $("#backdrop").classList.toggle("open", open); }
$("#menuBtn").addEventListener("click", () => setDrawer(true));
$("#drawerClose").addEventListener("click", () => setDrawer(false));
$("#backdrop").addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") { setDrawer(false); closeModal(); $("#profileMenu").hidden = true; } });
$("#profileBtn").addEventListener("click", e => { e.stopPropagation(); $("#profileMenu").hidden = !$("#profileMenu").hidden; });
document.addEventListener("click", e => { if (!e.target.closest("#profileMenu")) $("#profileMenu").hidden = true; });
$("#shiftBtn").addEventListener("click", toggleShift);

function tick() {
  const sd = ready() ? shiftDoc(S.uid) : {};
  const s = sd.active ? Math.max(0, Math.floor((Date.now() - sd.active) / 1000)) : 0;
  const txt = [s / 3600, (s % 3600) / 60, s % 60].map(n => String(Math.floor(n)).padStart(2, "0")).join(":");
  document.querySelectorAll("[data-shift-time]").forEach(el => { el.textContent = txt; });
  document.querySelectorAll("[data-since]").forEach(el => { const t = Math.floor((Date.now() - +el.dataset.since) / 1000); el.textContent = [t / 3600, (t % 3600) / 60, t % 60].map(n => String(Math.floor(n)).padStart(2, "0")).join(":"); });
  $("#shiftLabel").textContent = sd.active ? "On shift" : "Off shift";
  $("#shiftBtn").classList.toggle("on", !!sd.active);
}

/* ================= Router ================= */
const PAGES = {};
function route(keepScroll) {
  const key = location.hash.replace(/^#\/?/, "");
  const site = key === "" || key === "home";
  const form = key.startsWith("apply-");
  $("#site").hidden = !site; $("#formView").hidden = !form; $("#app").hidden = site || form;
  document.title = "California State Roleplay";
  if (site) return;
  if (form) { renderForm(key.slice(6)); return; }
  if (!ready() || S.applicant) { renderGate(); return; }
  $("#gate").hidden = true; $("#panel").hidden = false;
  let page = PAGES[key] ? key : "overview";
  if (HR_PAGES.has(page) && !S.isAdmin) page = "overview";
  $("#crumb").textContent = TITLES[page] || "Overview";
  const y = window.scrollY;
  const keep = {};
  $("#view").querySelectorAll("input[id],textarea[id],select[id]").forEach(el => { if (el.type !== "checkbox") keep[el.id] = el.value; });
  $("#view").innerHTML = (S.slow && S.loaded.size < 8 ? `<div class="card pad muted" style="margin-bottom:14px">Some panel data is taking a while to load and may be out of date.</div>` : "")
    + (S.readOnly ? `<div class="card pad muted" style="margin-bottom:14px">You can view the panel but not change it. Ask HR to give you Contributor access.</div>` : "")
    + PAGES[page]();
  if (keepScroll) Object.entries(keep).forEach(([id, v]) => { const el = document.getElementById(id); if (el && "value" in el && el.dataset.fresh === undefined) el.value = v; });
  PAGES[page].after && PAGES[page].after();
  buildNav(page);
  if (!keepScroll) setDrawer(false);
  document.querySelectorAll("[data-toggle-shift]").forEach(b => b.addEventListener("click", toggleShift));
  updateChips(); tick();
  window.scrollTo(0, keepScroll ? y : 0);
  wantNames(collectIds());
}
function collectIds() {
  return [...Object.keys(S.profiles), ...Object.keys(S.shifts), ...S.punishments.map(p => p.by), ...S.alerts.map(a => a.by), ...Object.keys(S.logs)];
}
function updateChips() {
  $("#onDuty").textContent = `${ready() ? onDutyIds().length : 0} on duty`;
  const g = $("#gameChip");
  if (!S.host) { g.textContent = "Game not linked"; return; }
  g.textContent = G.server ? `${G.server.CurrentPlayers ?? 0} of ${G.server.MaxPlayers ?? "?"} in-game · ${(G.queue || []).length} in queue` : G.err ? "Game unreachable" : "Loading game…";
}
function renderGate() {
  $("#gate").hidden = false; $("#panel").hidden = true;
  const err = (location.hash.match(/signin-error-(\w+)/) || [])[1];
  const msg = S.applicant ? ["No staff role", `You're signed in as ${S.me?.name || "a Discord user"}, but your Discord account doesn't have a CSRP staff role. You can still fill in applications from the homepage.`]
    : err === "setup" ? ["Discord sign-in isn't set up", "The site is missing its Discord settings. HR: add DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, SESSION_SECRET and DISCORD_GUILD_ID in Netlify, then redeploy."]
    : err ? ["Sign-in didn't finish", err === "cancelled" ? "You cancelled on Discord. Try again and tap Authorize." : "Discord sign-in failed. Check that the redirect https://california-staterp.netlify.app/auth/callback is added to the California Operations app, then try again."]
    : {
      connecting: ["Connecting…", "Loading the staff panel."],
      offline: ["Open this on claude.ai", "The staff panel saves shared data through claude.ai, so it only works when you open the panel's claude.ai link."],
      signin: ["Sign in with Discord", "Approve the California Operations bot on Discord to confirm you're CSRP staff. The panel shows your Discord username only."],
      noaccess: ["You don't have access yet", "Sign in to claude.ai, then ask HR to share the staff panel with your account as a Contributor."],
    }[S.phase] || ["Connecting…", ""];
  $("#gateTitle").textContent = msg[0]; $("#gateText").textContent = msg[1];
  const btn = $("#gateBtn"), showBtn = S.host && (S.phase === "signin" || err);
  btn.hidden = !showBtn; btn.href = "/auth/login?next=overview";
  $("#gateOut").hidden = !(S.host && S.applicant);
}
window.addEventListener("hashchange", () => { formDone = null; route(false); });

/* ================= Homepage helpers ================= */
document.querySelectorAll("[data-scroll]").forEach(b => b.addEventListener("click", () => { $("#navLinks").classList.remove("open"); document.getElementById(b.dataset.scroll)?.scrollIntoView({ behavior: "smooth" }); }));
$("#navToggle").addEventListener("click", () => $("#navLinks").classList.toggle("open"));

/* ================= Public forms (#apply-<slug>) ================= */
let formDone = null;
function renderForm(slug) {
  const card = $("#formCard");
  if (formDone === slug) { if (!card.dataset.done) { card.dataset.done = "1"; card.dataset.slug = ""; card.innerHTML = `<h1 style="font-size:28px">Submitted</h1><p class="muted" style="line-height:1.6">Thanks! CSRP staff will review your answers.</p><a class="btn" href="#home">Back home</a>`; } return; }
  delete card.dataset.done;
  if (!ready()) {
    card.innerHTML = S.phase === "connecting" ? `<p class="muted">Loading the form…</p>`
      : S.host ? `<h1 style="font-size:28px">Sign in to apply</h1><p class="muted" style="line-height:1.6">Sign in with Discord so CSRP staff know who sent this. Only your Discord username is shared with them.</p><a class="btn discord" href="/auth/login?next=apply-${esc(slug.replace(/[^a-z0-9-]/g, ""))}">Continue with Discord</a>`
      : `<h1 style="font-size:28px">Sign in to apply</h1><p class="muted" style="line-height:1.6">Forms save through claude.ai. Open this page's claude.ai link while signed in, and ask CSRP staff for access if it says you don't have it.</p>`;
    return;
  }
  const f = S.forms.find(x => x.id === slug);
  if (!f) { card.innerHTML = S.loaded.has("forms") ? `<h1 style="font-size:28px">Form not found</h1><p class="muted">This form doesn't exist or was removed.</p><a class="btn" href="#home">Back home</a>` : `<p class="muted">Loading…</p>`; return; }
  if (!f.open) { card.innerHTML = `<h1 style="font-size:28px">${esc(f.title)}</h1><p class="muted">This form is closed right now.</p><a class="btn" href="#home">Back home</a>`; return; }
  if (card.dataset.slug === slug && card.querySelector("form")) return;
  card.dataset.slug = slug;
  card.innerHTML = `<h1 style="font-size:30px">${esc(f.title)}</h1><p class="muted" style="line-height:1.6">${esc(f.intro || "")}</p>
  <form id="frm">${(f.questions || []).map((q, i) => `<label class="lbl" for="fq${i}">${esc(q)}</label><textarea class="input" id="fq${i}" rows="3" required></textarea>`).join("")}
  <button class="btn primary block" style="margin-top:24px;padding:13px">Submit</button></form>`;
  $("#frm").addEventListener("submit", async e => {
    e.preventDefault();
    const answers = (f.questions || []).map((q, i) => ({ q, a: $("#fq" + i).value.trim() }));
    const path = "responses/" + S.uid;
    const ok = await save(path, async () => {
      const cur = await S.db.doc(path).get();
      const items = cur.exists ? (cur.data().items || []) : [];
      await S.db.doc(path).set({ items: [{ id: Math.random().toString(36).slice(2), form: slug, at: Date.now(), answers }, ...items].slice(0, 30) });
    });
    if (ok) { formDone = slug; renderForm(slug); }
  });
}

/* ================= Shared modals ================= */
function openLogPunishment() {
  if (S.readOnly) return toast("You can't log punishments with view-only access.");
  modal(`<h3>Log punishment</h3><p class="muted" style="margin:0">Saved to the shared punishment log.</p>
  <form id="lpForm"><label class="lbl" for="lpU">Roblox username</label><input class="input" id="lpU" required>
  <label class="lbl" for="lpI">Roblox user ID (optional)</label><input class="input" id="lpI" inputmode="numeric" pattern="[0-9]*">
  <label class="lbl" for="lpA">Action</label><select class="input" id="lpA"><option>Warning</option><option>Kick</option><option>Temp ban</option><option>Ban</option></select>
  <label class="lbl" for="lpR">Reason</label><textarea class="input" id="lpR" rows="3" required></textarea>
  <label class="lbl" for="lpD">Duration (optional)</label><input class="input" id="lpD" placeholder="e.g. 3 days">
  <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Log punishment</button></div></form>`);
  $("#lpForm").addEventListener("submit", async e => {
    e.preventDefault();
    const p = { action: $("#lpA").value, player: $("#lpU").value.trim(), robloxId: $("#lpI").value.trim(), reason: $("#lpR").value.trim(), duration: $("#lpD").value.trim(), by: S.uid, at: Date.now() };
    closeModal();
    if (await save("punishments/new", () => S.db.collection("punishments").add(p), "Punishment logged")) logActivity("Recorded a punishment", p.player);
  });
}
function openRequestStaff() {
  if (S.readOnly) return toast("You can't send requests with view-only access.");
  modal(`<h3>Request staff</h3><p class="muted" style="margin:0">Shows on everyone's On duty page until someone resolves it.</p>
  <form id="rqF"><label class="lbl" for="rqR">What's happening?</label><textarea class="input" id="rqR" rows="3" required placeholder="Mass RDM at the gas station"></textarea>
  <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Send request</button></div></form>`);
  $("#rqF").addEventListener("submit", async e => {
    e.preventDefault(); const text = $("#rqR").value.trim(); closeModal();
    if (await save("alerts/new", () => S.db.collection("alerts").add({ text, by: S.uid, at: Date.now(), resolved: false }), "Staff request sent")) logActivity("Requested staff", text.slice(0, 60));
  });
}

/* ================= Pages: Me ================= */
PAGES.overview = () => {
  const me = S.profiles[S.uid] || {}, sd = shiftDoc(S.uid), wm = minutesSince(S.uid, weekStart()), q = quota(), pct = Math.min(100, Math.round((wm / q) * 100));
  const shiftsWeek = (sd.log || []).filter(s => s.e >= weekStart()).length;
  const open = S.alerts.filter(a => !a.resolved && Date.now() - a.at < 6 * H);
  const feed = Object.entries(S.logs).flatMap(([u, l]) => (l.items || []).map(i => ({ ...i, u }))).sort((a, b) => b.at - a.at).slice(0, 15);
  return `<div class="ov-hello"><div class="muted">${greeting()}</div><h1>${esc(nameOf(S.uid) === "Unnamed staff" ? "Staff member" : nameOf(S.uid))}</h1>
    <div class="ov-id">${icon("discord", 15)} ${me.discord || S.host ? `Signed in as ${esc(me.discord || S.me?.name || "")}` : `Discord not added · <a href="#profile">add it</a>`}</div>
    <div class="ov-id">${icon("roblox", 15)} ${me.roblox ? `Roblox ID ${esc(me.roblox)}` : `Roblox not added · <a href="#profile">add it</a>`}</div></div>
  ${open.length ? `<div class="card list-card ov-card" style="margin:0 0 18px;border-color:rgba(240,99,99,.4)"><div class="lc-head split-head">Staff requested <a href="#onduty">View all</a></div>${open.slice(0, 3).map(a => `<div class="ov-pun"><div>${esc(a.text)}</div><div class="muted">${esc(nameOf(a.by))}, ${ago(a.at)}</div></div>`).join("")}</div>` : ""}
  <div class="card shift-card">
    <div class="sc-lab">${sd.active ? (sd.mode === "5050" ? "On shift · 50/50" : "On shift") : "Off shift"}</div>
    <div class="sc-time mono" data-shift-time>00:00:00</div>
    <div class="muted" style="font-size:16px">Only time between Start and End counts.</div>
    <div class="quota-row"><span>Weekly quota</span><b>${pct}%</b></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="muted" style="font-size:16px;margin-top:10px">${fmtMin(wm)} of ${fmtMin(q)} this week${wm < q ? `, ${fmtMin(q - wm)} to go` : " · quota met"}</div>
    <button class="btn block shift-toggle ${sd.active ? "end" : ""}" data-toggle-shift ${S.readOnly ? "disabled" : ""}>${icon(sd.active ? "stop" : "play", 16)} ${sd.active ? "End shift" : "Start shift"}</button>
    <div class="card inner5050">
      <div style="display:flex;align-items:center;gap:8px"><b style="font-family:var(--head)">50/50 shift</b><span class="pill">${wm >= q ? "Ready" : "Locked"}</span></div>
      <div class="muted" style="font-size:16px;margin:6px 0 10px">Roleplay as normal and take calls when they come in.</div>
      <div class="check ${wm >= q ? "done" : ""}"><i></i>Weekly quota met: ${fmtMin(Math.min(wm, q))} of ${fmtMin(q)}</div>
      <div class="check ${sd.active ? "done" : ""}"><i></i>On shift</div>
      <button class="btn block" style="margin-top:12px" ${wm >= q && sd.active && sd.mode !== "5050" ? "" : "disabled"} id="go5050">${sd.mode === "5050" ? "You're on 50/50" : "Go 50/50"}</button>
    </div>
    <div class="sc-foot"><span>${icon("clock", 15)} Resets in ${resetsIn()}</span><span>${icon("history", 15)} ${shiftsWeek} shift${shiftsWeek === 1 ? "" : "s"} this week</span></div>
  </div>
  <div class="card list-card ov-card"><div class="lc-head split-head">Recent punishments <a href="#punishments">See all</a></div>
    ${S.punishments.length ? S.punishments.slice(0, 5).map(p => `<div class="ov-pun"><div class="split-head"><b>${esc(p.player)}</b><span class="pill">${esc(p.action)}</span></div><div>${esc(p.reason)}</div><div class="muted">${esc(nameOf(p.by))}, ${ago(p.at)}</div></div>`).join("") : `<div class="lc-empty">No punishments logged yet.</div>`}
  </div>
  <div class="card list-card ov-card"><div class="lc-head">Quick actions</div>
    <button class="qa" id="qaLog">${icon("fileplus", 16)} Log punishment</button>
    <button class="qa" id="qaReq">${icon("users", 16)} Request staff</button>
    <a class="qa" href="#timeoff">${icon("plane", 16)} Request time off</a>
  </div>
  <div class="card list-card ov-card"><div class="lc-head">Activity</div>
    ${feed.length ? feed.map(f => `<div class="ov-act"><span><b>${esc(nameOf(f.u))}</b> ${esc(f.action.charAt(0).toLowerCase() + f.action.slice(1))}${f.target ? ` · ${esc(f.target)}` : ""}</span><span class="dim">${ago(f.at)}</span></div>`).join("") : `<div class="lc-empty">No staff activity yet.</div>`}
  </div>
  ${S.host ? (() => { const joins = gameLogs("joinlogs"); return `<div class="card list-card ov-card"><div class="lc-head">Server activity</div>${!joins ? `<div class="lc-empty">${G.err ? "Couldn't reach the ER:LC server." : "Loading…"}</div>` : joins.length ? joins.slice().sort((a, b) => b.Timestamp - a.Timestamp).slice(0, 15).map(j => `<div class="ov-act"><span><b>${esc(who(j.Player).name)}</b> ${j.Join ? "joined" : "left"} the server</span><span class="dim">${gameTime(j.Timestamp)}</span></div>`).join("") : `<div class="lc-empty">No joins or leaves yet.</div>`}</div>`; })() : ""}
  <div class="ov-footer"><span>California State Roleplay · Staff Panel</span></div>`;
};
PAGES.overview.after = () => {
  $("#qaLog").addEventListener("click", openLogPunishment);
  $("#qaReq").addEventListener("click", openRequestStaff);
  $("#go5050").addEventListener("click", () => { const path = "shifts/" + S.uid; save(path, () => S.db.doc(path).update({ mode: "5050" }), "You're on a 50/50 shift"); });
};

PAGES.shifts = () => {
  const sd = shiftDoc(S.uid), list = sd.log || [];
  return `${head("My shifts")}
  <p class="muted" style="font-size:19px;margin:0 0 18px">This week <b style="color:var(--text)">${fmtMin(minutesSince(S.uid, weekStart()))}</b> of ${fmtMin(quota())}. Resets Sunday 21:00 UTC.</p>
  ${list.length || sd.active ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Started</th><th>Ended</th><th>Length</th><th>Status</th></tr></thead><tbody>
  ${sd.active ? `<tr><td>${fmtShort(sd.active)}</td><td>-</td><td class="mono" data-shift-time></td><td><span class="pill green">In progress</span></td></tr>` : ""}
  ${list.map(s => `<tr><td>${fmtShort(s.s)}</td><td>${fmtShort(s.e)}</td><td>${fmtMin(s.m)}</td><td>Ended</td></tr>`).join("")}
  </tbody></table></div>` : empty("No shifts yet. Start one from the top bar or the Overview.")}`;
};

PAGES.profile = () => {
  const p = S.profiles[S.uid] || {}, meta = S.staffmeta[S.uid] || {}, sd = shiftDoc(S.uid), mins = totalMinutes(S.uid);
  const mine = S.punishments.filter(x => x.by === S.uid).length;
  return `${head("My Profile")}
  <div class="card prof-top">
    <div class="prof-acc">${avatar(S.uid, 56)}<div><div class="nm">${esc(nameOf(S.uid))}</div><div class="muted">${p.discord ? `@${esc(p.discord)} · Discord` : "Discord not added"}</div></div></div>
    <span class="pill yellow" style="margin-left:auto;font-size:14px;padding:5px 12px">${S.isAdmin ? "HR" : "Staff"}</span>
  </div>
  <div class="card prof-sec">
    <h2>Linked accounts</h2>
    <p class="muted" style="margin:0 0 6px;font-size:14px">Add these so other staff can match you to your Discord and Roblox accounts.</p>
    <form id="profF">
      <label class="lbl" for="pfD">Discord username</label><input class="input" id="pfD" value="${esc(p.discord || (S.host ? S.me?.name : "") || "")}" placeholder="your_discord_name" maxlength="40" ${S.host ? `readonly title="From your Discord sign-in"` : ""}>
      ${S.host ? `<p class="dim" style="font-size:13px;margin:6px 0 0">Comes from your Discord sign-in.</p>` : ""}
      <label class="lbl" for="pfR">Roblox user ID</label><input class="input" id="pfR" value="${esc(p.roblox || "")}" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 1234567890" maxlength="20">
      <button class="btn primary" style="margin-top:14px" ${S.readOnly ? "disabled" : ""}>Save</button>
      ${p.roblox ? ` <a class="btn ghost" href="https://www.roblox.com/users/${encodeURIComponent(p.roblox)}/profile" target="_blank" rel="noopener">Open on Roblox</a>` : ""}
    </form>
    <h2>Staff details</h2>
    <div class="kv"><span>Rank</span><b>${esc(meta.rank || "Not set by HR")}</b></div>
    <div class="kv"><span>Team</span><b>${esc(meta.group || "-")}</b></div>
    <div class="kv"><span>Panel access</span><b>${S.isAdmin ? "HR" : "Staff"}</b></div>
    <div class="kv"><span>Discipline</span><b>${disc(meta)}</b></div>
    <div class="kv"><span>Current shift</span><b>${sd.active ? "On shift" : "Off shift"}</b></div>
    <h2>Recorded activity</h2>
    <div class="kv"><span>Completed shifts</span><b>${(sd.log || []).length}</b></div>
    <div class="kv"><span>Total shift time</span><b>${fmtMin(mins)}</b></div>
    <div class="kv"><span>Punishments logged</span><b>${mine}</b></div>
  </div>`;
};
PAGES.profile.after = () => $("#profF").addEventListener("submit", async e => {
  e.preventDefault(); const path = "profiles/" + S.uid;
  const body = { ...(S.profiles[S.uid] || { joined: Date.now() }), discord: $("#pfD").value.trim(), roblox: $("#pfR").value.trim().replace(/\D/g, "") };
  if (await save(path, () => S.db.doc(path).set(body), "Profile saved")) logActivity("Updated their profile");
});
const disc = m => { const w = +m.warnings || 0, s = +m.strikes || 0; return !w && !s ? "Clean" : [w ? `${w} warning${w > 1 ? "s" : ""}` : "", s ? `${s} strike${s > 1 ? "s" : ""}` : ""].filter(Boolean).join(", "); };

PAGES.timeoff = () => {
  const mine = S.loa[S.uid]?.requests || [];
  const status = r => r.cancelled ? ["cancelled", ""] : S.loadec[r.id]?.status === "approved" ? ["approved", "green"] : S.loadec[r.id]?.status === "denied" ? ["denied", "red"] : ["pending", "yellow"];
  const waiting = S.isAdmin ? Object.entries(S.loa).flatMap(([u, d]) => (d.requests || []).map(r => ({ ...r, u }))).filter(r => !r.cancelled && !S.loadec[r.id]) : [];
  wantNames(waiting.map(r => r.u));
  return `${head("Time off")}
  <div class="card pad"><h2 style="font-size:22px">Request leave</h2>
    <form id="loaF"><label class="lbl" for="loaFrom">From</label><input class="input" type="date" id="loaFrom" required>
    <label class="lbl" for="loaTo">Until</label><input class="input" type="date" id="loaTo" required>
    <label class="lbl" for="loaR">Reason</label><textarea class="input" id="loaR" rows="3" required maxlength="500"></textarea>
    <button class="btn primary" style="margin-top:16px" ${S.readOnly ? "disabled" : ""}>Request leave</button></form></div>
  ${S.isAdmin ? `<h2 class="section-title">Waiting for HR <span class="count">${waiting.length}</span></h2>
  ${waiting.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Staff</th><th>Dates</th><th>Reason</th><th>Decision</th></tr></thead><tbody>
  ${waiting.map(r => `<tr><td>${esc(nameOf(r.u))}</td><td style="white-space:nowrap">${esc(r.from)} to<br>${esc(r.to)}</td><td style="min-width:200px">${esc(r.reason)}</td><td style="white-space:nowrap"><button class="btn sm green" data-dec="approved" data-id="${esc(r.id)}">Approve</button> <button class="btn sm" data-dec="denied" data-id="${esc(r.id)}">Deny</button></td></tr>`).join("")}
  </tbody></table></div>` : empty("No requests waiting.")}` : ""}
  ${S.host && S.isAdmin ? `<h2 class="section-title">Leave from Discord <span class="count">${S.botloa.length}</span></h2>
  ${S.botloa.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Staff</th><th>Dates</th><th>Reason</th><th>Status</th><th>Decided by</th></tr></thead><tbody>
  ${S.botloa.map(r => `<tr><td>${esc(r.user?.name)}</td><td style="white-space:nowrap">${esc(r.from)} to<br>${esc(r.to)}</td><td style="min-width:200px">${esc(r.reason)}</td><td><span class="pill ${r.status === "approved" ? "green" : r.status === "denied" ? "red" : r.status === "pending" ? "yellow" : ""}">${esc(r.status)}</span></td><td>${esc(r.decidedBy?.name || "-")}</td></tr>`).join("")}
  </tbody></table></div>` : empty("The bot hasn't sent any leave requests yet.")}` : ""}
  <h2 class="section-title">Your requests</h2>
  ${mine.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Dates</th><th>Reason</th><th>Status</th><th>Decision</th><th></th></tr></thead><tbody>
  ${mine.map((r, i) => { const [st, c] = status(r), d = S.loadec[r.id]; return `<tr><td style="white-space:nowrap">${esc(r.from)} to<br>${esc(r.to)}</td><td style="min-width:200px">${esc(r.reason)}</td><td><span class="pill ${c}">${st}</span></td><td>${d ? `${esc(nameOf(d.by))}${d.note ? `: ${esc(d.note)}` : ""}` : "-"}</td><td>${st === "pending" ? `<button class="btn sm" data-cancel="${i}">Cancel</button>` : ""}</td></tr>`; }).join("")}
  </tbody></table></div>` : `<p class="muted">You have not requested any leave.</p>`}`;
};
PAGES.timeoff.after = () => {
  $("#loaF").addEventListener("submit", async e => {
    e.preventDefault();
    const from = $("#loaFrom").value, to = $("#loaTo").value;
    if (to < from) return toast("Until must be on or after From");
    const path = "loa/" + S.uid, reqs = S.loa[S.uid]?.requests || [];
    const r = { id: S.uid.slice(-6) + Date.now().toString(36), from, to, reason: $("#loaR").value.trim(), at: Date.now() };
    if (await save(path, () => S.db.doc(path).set({ requests: [r, ...reqs].slice(0, 50) }), "Leave requested")) { ["loaFrom", "loaTo", "loaR"].forEach(id => { $("#" + id).value = ""; }); logActivity("Submitted a time off request", `${from} to ${to}`); }
  });
  document.querySelectorAll("[data-cancel]").forEach(b => b.addEventListener("click", () => {
    const path = "loa/" + S.uid, reqs = (S.loa[S.uid]?.requests || []).map((r, i) => (i === +b.dataset.cancel ? { ...r, cancelled: true } : r));
    save(path, () => S.db.doc(path).set({ requests: reqs }), "Request cancelled");
  }));
  document.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => {
    modal(`<h3>${b.dataset.dec === "approved" ? "Approve" : "Deny"} request</h3><form id="decF"><label class="lbl" for="decN">Note to the staff member (optional)</label><input class="input" id="decN" maxlength="200">
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">${b.dataset.dec === "approved" ? "Approve" : "Deny"}</button></div></form>`);
    $("#decF").addEventListener("submit", async e => {
      e.preventDefault(); const note = $("#decN").value.trim(); closeModal();
      if (await save("loadec/" + b.dataset.id, () => S.db.doc("loadec/" + b.dataset.id).set({ status: b.dataset.dec, note, by: S.uid, at: Date.now() }), b.dataset.dec === "approved" ? "Approved" : "Denied")) logActivity(b.dataset.dec === "approved" ? "Approved a time off request" : "Denied a time off request");
    });
  }));
};

PAGES.activity = () => {
  const a = S.logs[S.uid]?.items || [];
  return `${head("My activity")}
  ${a.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>When</th><th>Action</th><th>Detail</th></tr></thead><tbody>
  ${a.map(r => `<tr><td style="white-space:nowrap">${fmtShort(r.at)}</td><td>${esc(r.action)}</td><td>${esc(r.target)}</td></tr>`).join("")}</tbody></table></div>`
    : empty("Nothing yet. Your shifts, punishments and leave requests will show here.")}`;
};

/* ---------- Guide (static content) ---------- */
const COMMANDS = [
  [":h", "Send a server hint.", "Moderator", ":h <message>"], [":m", "Send a server message.", "Moderator", ":m <message>"],
  [":kick", "Kick one player. Equal or higher staff cannot be targeted.", "Moderator", ":kick <Roblox ID or username>"],
  [":tp", "Teleport to one player. Both must be in game.", "Moderator", ":tp <Roblox ID or username>"],
  [":bring", "Bring one player to you. Both must be in game.", "Moderator", ":bring <Roblox ID or username>"],
  [":ban", "Ban one account. Cannot target equal or higher staff.", "Administrator", ":ban <Roblox ID or username>"],
  [":unban", "Remove one account ban.", "Administrator", ":unban <Roblox ID or username>"],
];
PAGES.guide = () => `${head("Guide")}
  <p class="muted" style="margin-top:-6px">Pick the guide you need. The instructor guide is for Staff Trainers and HR.</p>
  <div class="grid-2">
    <div class="card guide-card"><span class="t-ico">${icon("book")}</span><h3>Staff guide</h3><p>Rules, how to punish them, the panel and the in-game commands.</p><a class="go" href="#guide-staff">Open guide ${icon("arrowR", 14)}</a></div>
    <div class="card guide-card"><span class="t-ico">${icon("grad")}</span><h3>Staff instructor</h3><p>Running Moderation Training: hosting phases and checking marks.</p><a class="go" href="#guide-instructor">Open guide ${icon("arrowR", 14)}</a></div>
  </div>`;
const guidePage = (title, secs) => `<a class="back" href="#guide">${icon("arrowL", 16)} Back to Guide</a>
  <div class="page-head"><div><h1>${title}</h1></div></div>
  ${secs.map(([h, items]) => `<div class="card pad" style="margin-bottom:14px"><h2 style="font-size:20px;margin-bottom:10px">${h}</h2><ul class="guide-list">${items.map(i => `<li>${i}</li>`).join("")}</ul></div>`).join("")}`;
PAGES["guide-staff"] = () => guidePage("Staff guide", [
  ["Common rules", ["<b>RDM</b>: killing without a roleplay reason.", "<b>VDM</b>: using a vehicle as a weapon without a reason.", "<b>NLR</b>: after death, forget what led to it and don't return to the scene.", "<b>Tool abuse</b>: using items (pepper spray, spikes, cuffs) to troll.", "<b>FRP</b>: fail roleplay, doing things your character couldn't realistically do."]],
  ["Punishment ladder", ["1st offense: Warning", "2nd offense: Kick", "3rd offense: 1 day ban", "4th offense: 3 day ban, then HR review", "Exploiting or hate speech: permanent ban straight away"]],
  ["Using the panel", ["Start a shift before you moderate, and end it when you stop.", "Log every warning, kick and ban in <a href='#punishments'>Punishments</a> with a clear reason.", "Check a player's history in <a href='#players'>Players</a> before you punish.", "Request leave in <a href='#timeoff'>Time off</a> before you go inactive."]],
  ["In-game commands", COMMANDS.map(c => `<code>${esc(c[3])}</code>: ${c[1]}`)],
]);
PAGES["guide-instructor"] = () => guidePage("Staff instructor guide", [
  ["Phase 1", ["Trial Moderators answer 10 rule questions. Pass mark is 8/10."]],
  ["Marking", ["Record every session in <a href='#training'>Staff training</a> with the score.", "Mark answers that show the right idea, even if worded differently.", "Leave a short note on failed sessions so the trainee can learn."]],
  ["Phase 2", ["Host an in-game shadow shift of at least 30 minutes.", "The trainee handles calls; you step in only if needed.", "Record the result in Staff training as Phase 2."]],
]);

/* ================= Pages: Staff ================= */
PAGES.onduty = () => {
  const ids = onDutyIds(), open = S.alerts.filter(a => !a.resolved);
  return `${head("On duty")}
  ${open.length ? `<h2 class="section-title" style="margin-top:0">Staff requests <span class="count">${open.length}</span></h2>
  <div class="card list-card" style="margin-bottom:22px">${open.map(a => `<div class="prow"><div style="flex:1;min-width:0"><div>${esc(a.text)}</div><div class="id">${esc(nameOf(a.by))} · ${ago(a.at)}</div></div><button class="btn sm" data-resolve="${esc(a.id)}" ${S.readOnly ? "disabled" : ""}>Resolve</button></div>`).join("")}</div>` : ""}
  ${ids.length ? `<div class="card list-card">${ids.map(u => { const sd = S.shifts[u]; return `<div class="prow">${avatar(u, 40)}<div style="flex:1"><div class="nm">${esc(nameOf(u))}</div><div class="id">${esc(S.staffmeta[u]?.rank || "Staff")}${sd.mode === "5050" ? " · 50/50" : ""}</div></div><span class="pill green mono" data-since="${sd.active}">00:00:00</span></div>`; }).join("")}</div>`
    : `<p class="muted">Nobody is on shift.</p>`}`;
};
PAGES.onduty.after = () => document.querySelectorAll("[data-resolve]").forEach(b => b.addEventListener("click", async () => {
  if (await save("alerts/" + b.dataset.resolve, () => S.db.doc("alerts/" + b.dataset.resolve).update({ resolved: true, resolvedBy: S.uid }), "Resolved")) logActivity("Resolved a staff request");
}));

let covDays = 7;
PAGES.coverage = () => {
  const since = Date.now() - covDays * D, grid = Array.from({ length: 7 }, () => Array(24).fill(0));
  Object.values(S.shifts).forEach(sd => {
    const spans = [...(sd.log || []).map(s => [s.s, s.e]), ...(sd.active ? [[sd.active, Date.now()]] : [])];
    spans.forEach(([s, e]) => { for (let t = Math.max(s, since) - (Math.max(s, since) % H); t < e; t += H) { const a = Math.max(t, s, since), b = Math.min(t + H, e); if (b > a) { const d = new Date(t); grid[d.getUTCDay()][d.getUTCHours()] += (b - a) / H; } } });
  });
  const weeks = covDays / 7, avg = grid.map(r => r.map(v => v / weeks));
  const totalH = avg.flat().reduce((a, b) => a + b, 0), empties = avg.flat().filter(v => v < 0.05).length;
  const cls = v => (v < 0.05 ? "crit" : v < 1 ? "tight" : "ok");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const gaps = avg.flatMap((r, d) => r.map((v, h) => ({ d, h, v }))).filter(c => c.v < 0.05);
  return `${head("Staff coverage", "When staff are on shift, from real shift records. Player counts need the in-game connection.")}
  <div class="seg"><button class="${covDays === 7 ? "on" : ""}" data-cov="7">Last 7 days</button><button class="${covDays === 30 ? "on" : ""}" data-cov="30">Last 30 days</button></div>
  <div class="kpis" style="margin-top:14px;grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
    <div class="kpi"><div class="v">${fmtMin(Math.round(totalH * 60))}</div><div class="l">Staff time per week</div></div>
    <div class="kpi"><div class="v">${168 - empties} / 168</div><div class="l">Weekly hours with someone on shift</div></div>
    <div class="kpi"><div class="v">${onDutyIds().length}</div><div class="l">On duty right now</div></div>
  </div>
  <div class="card pad" style="margin-top:18px"><h2 style="font-size:20px">Average staff on shift by hour (UTC)</h2>
    <div class="hm-legend"><span><i class="crit"></i>Nobody</span><span><i class="tight"></i>Under 1 on average</span><span><i class="ok"></i>1 or more</span></div>
    <div class="hm-wrap"><table class="hm"><thead><tr><th>Day</th>${Array.from({ length: 24 }, (_, h) => `<th>${String(h).padStart(2, "0")}</th>`).join("")}</tr></thead><tbody>
    ${avg.map((r, d) => `<tr><th>${days[d]}</th>${r.map((v, h) => `<td class="${cls(v)}" data-cell="${days[d]} ${String(h).padStart(2, "0")}:00 UTC · ${v.toFixed(1)} staff on average">${v.toFixed(1)}</td>`).join("")}</tr>`).join("")}
    </tbody></table></div>
    <div class="card hm-info" id="hmInfo">Tap any hour to see its average.</div>
  </div>
  <div class="card pad" style="margin-top:18px"><h2 style="font-size:18px">Hours nobody covered <span class="count">${gaps.length}</span></h2>
    <p class="muted" style="font-size:14px">Use this to plan recruiting and shift reminders.</p>
    ${gaps.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px">${gaps.slice(0, 80).map(c => `<span class="pill red">${days[c.d]} ${String(c.h).padStart(2, "0")}:00</span>`).join("")}${gaps.length > 80 ? `<span class="pill">+${gaps.length - 80} more</span>` : ""}</div>` : `<p class="muted">Every hour had someone on shift.</p>`}
  </div>`;
};
PAGES.coverage.after = () => {
  document.querySelectorAll("[data-cov]").forEach(b => b.addEventListener("click", () => { covDays = +b.dataset.cov; route(true); }));
  document.querySelectorAll("[data-cell]").forEach(td => { const f = () => { $("#hmInfo").textContent = td.dataset.cell; }; td.addEventListener("mouseenter", f); td.addEventListener("click", f); });
};

let lbPeriod = "week";
PAGES.leaderboard = () => {
  const since = lbPeriod === "week" ? weekStart() : lbPeriod === "month" ? Date.now() - 30 * D : 0;
  const rows = Object.keys(S.shifts).map(u => [u, minutesSince(u, since)]).filter(r => r[1] > 0).sort((a, b) => b[1] - a[1]);
  return `${head("Leaderboard")}
  <div style="display:flex;align-items:center;gap:14px"><label class="muted" for="lbP">Ranking period</label><select class="input" id="lbP" style="width:auto" data-fresh><option value="week" ${lbPeriod === "week" ? "selected" : ""}>This week</option><option value="month" ${lbPeriod === "month" ? "selected" : ""}>Last 30 days</option><option value="all" ${lbPeriod === "all" ? "selected" : ""}>All time</option></select></div>
  <p class="dim" style="margin:18px 0">${lbPeriod === "week" ? `Since ${fmtShort(weekStart())}` : lbPeriod === "month" ? "Last 30 days" : "All recorded shifts"}</p>
  ${rows.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th style="width:70px">#</th><th>Staff</th><th>Time</th></tr></thead><tbody>${rows.map((r, i) => `<tr><td>${i + 1}</td><td><div class="staff-cell" style="min-width:0">${avatar(r[0], 28)}<span>${esc(nameOf(r[0]))}</span></div></td><td>${fmtMin(r[1])}</td></tr>`).join("")}</tbody></table></div>` : empty("No shift time recorded in this period.")}`;
};
PAGES.leaderboard.after = () => $("#lbP").addEventListener("change", e => { lbPeriod = e.target.value; e.target.blur(); route(true); });

PAGES.departments = () => `${head("Departments")}
  ${S.isAdmin ? `<button class="btn" id="addDept" style="margin-bottom:16px">Add department</button>` : ""}
  ${S.departments.length ? S.departments.map(d => `<div class="card" style="margin-bottom:20px;padding:4px 0 0"><div class="split-head" style="padding:16px 20px 12px"><h2 style="font-size:20px">${esc(d.name)} <span class="muted" style="font-size:15px;font-weight:500">${(d.members || []).length} members</span></h2>${S.isAdmin ? `<span style="display:flex;gap:6px"><button class="btn sm" data-addm="${esc(d.id)}">Add member</button><button class="btn sm" data-deld="${esc(d.id)}">Delete</button></span>` : ""}</div>
    ${(d.members || []).length ? `<div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Member</th><th>Rank</th><th>Roblox</th>${S.isAdmin ? "<th></th>" : ""}</tr></thead><tbody>
    ${d.members.map((m, i) => `<tr><td>${esc(m.name)}</td><td>${esc(m.rank)}</td><td>${esc(m.roblox || "-")}</td>${S.isAdmin ? `<td><button class="btn sm" data-delm="${esc(d.id)}" data-i="${i}">Remove</button></td>` : ""}</tr>`).join("")}
    </tbody></table></div>` : `<p class="muted" style="padding:0 20px 16px">No members yet.</p>`}</div>`).join("") : empty(S.isAdmin ? "No departments yet. Add your first one." : "HR hasn't added any departments yet.")}`;
PAGES.departments.after = () => {
  if (!S.isAdmin) return;
  $("#addDept").addEventListener("click", () => {
    modal(`<h3>Add department</h3><form id="dF"><label class="lbl" for="dN">Name</label><input class="input" id="dN" required placeholder="California Highway Patrol"><div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Add</button></div></form>`);
    $("#dF").addEventListener("submit", e => { e.preventDefault(); const name = $("#dN").value.trim(); closeModal(); save("departments/new", () => S.db.collection("departments").add({ name, members: [] }), "Department added"); });
  });
  document.querySelectorAll("[data-addm]").forEach(b => b.addEventListener("click", () => {
    modal(`<h3>Add member</h3><form id="mF"><label class="lbl" for="mN">Name or callsign</label><input class="input" id="mN" required><label class="lbl" for="mR">Rank</label><input class="input" id="mR" required><label class="lbl" for="mB">Roblox username (optional)</label><input class="input" id="mB">
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Add</button></div></form>`);
    $("#mF").addEventListener("submit", e => {
      e.preventDefault(); const d = S.departments.find(x => x.id === b.dataset.addm), m = { name: $("#mN").value.trim(), rank: $("#mR").value.trim(), roblox: $("#mB").value.trim() }; closeModal();
      save("departments/" + d.id, () => S.db.doc("departments/" + d.id).update({ members: [...(d.members || []), m] }), "Member added");
    });
  }));
  document.querySelectorAll("[data-delm]").forEach(b => b.addEventListener("click", () => { const d = S.departments.find(x => x.id === b.dataset.delm); save("departments/" + d.id, () => S.db.doc("departments/" + d.id).update({ members: d.members.filter((_, i) => i !== +b.dataset.i) }), "Member removed"); }));
  document.querySelectorAll("[data-deld]").forEach(b => b.addEventListener("click", () => {
    modal(`<h3>Delete department?</h3><p class="muted">This removes the department and its member list for everyone.</p><div class="actions"><button class="btn" data-close>Cancel</button><button class="btn primary" id="cDel">Delete</button></div>`);
    $("#cDel").addEventListener("click", () => { closeModal(); save("departments/" + b.dataset.deld, () => S.db.doc("departments/" + b.dataset.deld).delete(), "Department deleted"); });
  }));
};

/* ---------- Ask Goldie (real AI) ---------- */
const BOT = "Goldie";
const chat = [];
function rulesContext() {
  return `You are ${BOT}, the staff assistant for California State Roleplay (CSRP), an ER:LC roleplay server. Answer staff questions briefly and casually, in lowercase, like a helpful senior staff member.
Rules: RDM = killing without a roleplay reason. VDM = vehicle used as a weapon without reason. NLR = new life rule: after death forget events leading to it and don't return to the scene. Tool abuse = using items (pepper spray, spikes, cuffs) to troll. FRP = fail roleplay.
Punishment ladder: 1st warning, 2nd kick, 3rd 1 day ban, 4th 3 day ban then HR review. Exploiting or hate speech: permanent ban.
Commands: ${COMMANDS.map(c => c[3] + " (" + c[2] + ")").join("; ")}.
Live panel facts: ${onDutyIds().length} staff on shift now. ${S.punishments.length} punishments logged. Weekly shift quota ${fmtMin(quota())}. Who is in the game server right now is not available (no in-game connection).
HR is the panel's HR team; time off is requested on the Time off page. If you don't know something, say so.`;
}
PAGES.assistant = () => `${head("Ask " + BOT)}
  <div class="card chat"><div class="msgs" id="msgs">
    <div class="msg"><span class="brand-mark" style="width:36px;height:36px;font-size:12px;flex:none">CS</span><div class="bubble">hey, i'm ${BOT.toLowerCase()}. ask me about the rules, punishments, who to go to, or just chat.</div></div>
    ${chat.map(m => `<div class="msg ${m.role === "user" ? "me" : ""}">${m.role === "user" ? avatar(S.uid) : `<span class="brand-mark" style="width:36px;height:36px;font-size:12px;flex:none">CS</span>`}<div class="bubble">${esc(m.content)}</div></div>`).join("")}
  </div>
  <div class="suggests">${["What is the punishment for RDM?", "What does NLR mean?", "How many staff are on shift?", "How do I request time off?"].map(s => `<button class="suggest">${s}</button>`).join("")}</div>
  <form class="chat-input" id="chatF"><input class="input" id="chatIn" placeholder="Ask ${BOT} anything..." autocomplete="off" data-fresh><button class="send" aria-label="Send">${icon("arrowR")}</button></form>
  <p class="muted" style="line-height:1.5;margin:16px 0 0">${S.sample ? `${BOT} runs on Claude and uses your own Claude usage. The first question asks your permission. It can be wrong, so check anything important.` : `${BOT} isn't available in this view.`}</p></div>`;
PAGES.assistant.after = () => {
  const box = $("#msgs"); box.scrollTop = 1e9;
  let busy = false;
  const ask = async q => {
    if (!q || busy || !S.sample) return;
    busy = true; chat.push({ role: "user", content: q });
    route(true);
    const bubble = document.createElement("div"); bubble.className = "msg";
    bubble.innerHTML = `<span class="brand-mark" style="width:36px;height:36px;font-size:12px;flex:none">CS</span><div class="bubble">Thinking...</div>`;
    $("#msgs").appendChild(bubble); $("#msgs").scrollTop = 1e9;
    const b = bubble.querySelector(".bubble");
    try {
      const { text } = await S.sample([{ role: "user", content: rulesContext() }, ...chat.slice(-12)], { modelTier: "quick", cache: false, onText: ({ text }) => { b.textContent = text; $("#msgs").scrollTop = 1e9; } });
      chat.push({ role: "assistant", content: text });
    } catch (e) {
      chat.pop();
      b.textContent = e.code === "not_granted" || e.code === "sampling_disabled" ? `${BOT} needs permission to use Claude. You can allow it next time you ask.` : e.code === "rate_limited" ? "Too many questions right now. Try again in a bit." : "Something went wrong. Try again.";
    }
    busy = false;
  };
  $("#chatF").addEventListener("submit", e => { e.preventDefault(); const v = $("#chatIn").value.trim(); $("#chatIn").value = ""; ask(v); });
  document.querySelectorAll(".suggest").forEach(b => b.addEventListener("click", () => ask(b.textContent)));
};

/* ---------- Forms ---------- */
const formLink = slug => `#apply-${slug}`;
PAGES.forms = () => {
  const counts = {}; Object.values(S.responses).forEach(r => (r.items || []).forEach(i => { counts[i.form] = (counts[i.form] || 0) + 1; }));
  return `${head("Forms")}
  ${S.isAdmin ? `<button class="btn" id="newForm" style="margin-bottom:16px">New form</button>` : ""}
  ${S.forms.length ? S.forms.map(f => `<div class="card form-row"><div style="min-width:0"><h3>${esc(f.title)}</h3><span class="pill ${f.open ? "green" : ""}">${f.open ? "Open" : "Closed"}</span>
    <div class="muted" style="margin-top:6px">${S.isAdmin ? `${counts[f.id] || 0} response${counts[f.id] === 1 ? "" : "s"} · ` : ""}<a href="${formLink(esc(f.id))}">Open form</a></div></div>
    <div class="actions"><button class="btn" data-copy="${esc(f.id)}">Copy link</button>${S.isAdmin ? `<button class="btn" data-resp="${esc(f.id)}">Responses</button><button class="btn" data-edit="${esc(f.id)}">Edit</button>` : ""}</div></div>`).join("") : empty(S.isAdmin ? "No forms yet. Create your first one." : "No forms yet.")}`;
};
function editForm(f) {
  modal(`<h3>${f ? "Edit form" : "New form"}</h3><form id="efF">
  <label class="lbl" for="efT">Title</label><input class="input" id="efT" required value="${esc(f?.title || "")}">
  ${f ? "" : `<label class="lbl" for="efS">Link name</label><input class="input" id="efS" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="staff-application">`}
  <label class="lbl" for="efI">Intro</label><textarea class="input" id="efI" rows="2">${esc(f?.intro || "")}</textarea>
  <label class="lbl" for="efQ">Questions, one per line</label><textarea class="input" id="efQ" rows="6" required>${esc((f?.questions || []).join("\n"))}</textarea>
  <label class="lbl" for="efO">Status</label><select class="input" id="efO"><option value="1" ${f?.open !== false ? "selected" : ""}>Open</option><option value="0" ${f?.open === false ? "selected" : ""}>Closed</option></select>
  <div class="actions">${f ? `<button type="button" class="btn" id="efDel">Delete</button>` : ""}<button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Save</button></div></form>`);
  $("#efF").addEventListener("submit", e => {
    e.preventDefault();
    const id = f ? f.id : $("#efS").value.trim();
    const body = { title: $("#efT").value.trim(), intro: $("#efI").value.trim(), questions: $("#efQ").value.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 30), open: $("#efO").value === "1" };
    closeModal(); save("forms/" + id, () => S.db.doc("forms/" + id).set(body), "Form saved");
  });
  if (f) $("#efDel").addEventListener("click", () => { closeModal(); save("forms/" + f.id, () => S.db.doc("forms/" + f.id).delete(), "Form deleted"); });
}
PAGES.forms.after = () => {
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
    const txt = `Open the CSRP site link and add ${formLink(b.dataset.copy)} to the end`;
    try { await navigator.clipboard.writeText(formLink(b.dataset.copy)); toast(`Copied ${formLink(b.dataset.copy)}. Add it to the end of the site link.`); } catch { toast(txt); }
  }));
  if (!S.isAdmin) return;
  $("#newForm").addEventListener("click", () => editForm(null));
  document.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => editForm(S.forms.find(f => f.id === b.dataset.edit))));
  document.querySelectorAll("[data-resp]").forEach(b => b.addEventListener("click", () => {
    const list = Object.entries(S.responses).flatMap(([u, r]) => (r.items || []).filter(i => i.form === b.dataset.resp).map(i => ({ ...i, u }))).sort((a, c) => c.at - a.at);
    wantNames(list.map(i => i.u));
    modal(`<h3>Responses</h3><p class="muted" style="margin:0 0 12px">${list.length} total</p>${list.length ? list.map(i => `<div class="card pad" style="margin-bottom:10px;padding:14px 16px"><b>${esc(nameOf(i.u))}</b> <span class="dim">${fmtShort(i.at)}</span>${(i.answers || []).map(a => `<div style="margin-top:8px"><div class="dim" style="font-size:13px">${esc(a.q)}</div><div>${esc(a.a)}</div></div>`).join("")}</div>`).join("") : `<p class="muted">No responses yet.</p>`}<div class="actions"><button class="btn" data-close>Close</button></div>`);
  }));
};

/* ================= Pages: HR ================= */
PAGES.staff = () => {
  const ids = [...new Set([...Object.keys(S.profiles), ...Object.keys(S.shifts), ...Object.keys(S.botstaff)])];
  const lastShift = u => { const sd = shiftDoc(u); return sd.active ? Date.now() : (sd.log || [])[0]?.e || 0; };
  const inactive = ids.filter(u => Date.now() - lastShift(u) > 7 * D).length;
  const leave = ids.filter(u => onLeave(u) || S.botstaff[u]?.onLoa).length, discN = ids.filter(u => disc({ ...S.botstaff[u], ...(S.staffmeta[u] || {}) }) !== "Clean").length;
  const groups = {};
  ids.forEach(u => { const g = S.staffmeta[u]?.group || (S.botstaff[u] ? "From Discord" : "Unassigned"); (groups[g] ||= []).push(u); });
  return `${head("Staff management")}
  <div class="kpis"><div class="kpi"><div class="v">${ids.length}</div><div class="l">Staff</div></div><div class="kpi"><div class="v">${inactive}</div><div class="l">No shift in 7 days</div></div><div class="kpi"><div class="v">${leave}</div><div class="l">On leave today</div></div><div class="kpi"><div class="v">${discN}</div><div class="l">On warnings or strikes</div></div></div>
  <div class="toolbar"><div class="search">${icon("search")}<input class="input" id="sQ" placeholder="Search staff" data-fresh></div>
    <button class="btn" id="quotaBtn">Weekly quota: ${fmtMin(quota())}</button></div>
  <p class="muted" style="font-size:14px;margin:0">Staff appear here after they open the panel once. Share the panel from the Share menu to add people.</p>
  <div id="sGroups">${Object.entries(groups).sort().map(([g, us]) => `<h2 class="section-title">${esc(g)} <span class="count">${us.length}</span></h2>
    <div class="table-wrap"><table class="tbl"><thead><tr><th>Staff member</th><th>This week</th><th>All time</th><th>Last shift</th><th>Discipline</th><th>Punishments</th><th></th></tr></thead><tbody>
    ${us.map(u => { const b = S.botstaff[u] || {}, m = { rank: b.rank, warnings: b.warnings, strikes: b.strikes, ...(S.staffmeta[u] || {}) }, ls = lastShift(u), d = disc(m); return `<tr data-row="${esc(nameOf(u).toLowerCase())}"><td><div class="staff-cell">${avatar(u)}<div><div class="nm">${esc(nameOf(u))}</div><div class="rk">${esc(m.rank || "No rank")}${onLeave(u) || b.onLoa ? " · On leave" : ""}</div></div></div></td>
      <td>${fmtMin(minutesSince(u, weekStart()))}</td><td>${fmtMin(totalMinutes(u))}</td>
      <td>${shiftDoc(u).active ? `<span class="pill green">On shift</span>` : ls ? `<span class="pill ${Date.now() - ls > 7 * D ? "yellow" : ""}">${ago(ls)}</span>` : `<span class="pill yellow">No shifts</span>`}</td>
      <td>${d === "Clean" ? `<span class="muted">Clean</span>` : `<span class="pill ${m.strikes ? "red" : "yellow"}">${d}</span>`}</td>
      <td>${S.punishments.filter(p => p.by === u).length}</td><td><button class="btn sm" data-editstaff="${esc(u)}">Edit</button></td></tr>`; }).join("")}
    </tbody></table></div>`).join("") || empty("Nobody has opened the panel yet.")}</div>`;
};
PAGES.staff.after = () => {
  $("#sQ").addEventListener("input", e => { const q = e.target.value.toLowerCase(); document.querySelectorAll("[data-row]").forEach(r => { r.hidden = q && !r.dataset.row.includes(q); }); });
  $("#quotaBtn").addEventListener("click", () => {
    modal(`<h3>Weekly quota</h3><form id="qF"><label class="lbl" for="qM">Minutes of shift time each week</label><input class="input" id="qM" type="number" min="0" max="10080" value="${quota()}" required>
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Save</button></div></form>`);
    $("#qF").addEventListener("submit", e => { e.preventDefault(); const v = +$("#qM").value; closeModal(); save("settings/panel", () => S.db.doc("settings/panel").set({ ...(S.settings.panel || {}), quota: v }), "Quota saved"); });
  });
  document.querySelectorAll("[data-editstaff]").forEach(b => b.addEventListener("click", () => {
    const u = b.dataset.editstaff, m = S.staffmeta[u] || {};
    modal(`<h3>${esc(nameOf(u))}</h3><form id="smF">
    <label class="lbl" for="smR">Rank</label><input class="input" id="smR" value="${esc(m.rank || "")}" placeholder="Moderator">
    <label class="lbl" for="smG">Team</label><input class="input" id="smG" value="${esc(m.group || "")}" placeholder="Moderation">
    <label class="lbl" for="smW">Warnings</label><input class="input" id="smW" type="number" min="0" max="20" value="${+m.warnings || 0}">
    <label class="lbl" for="smS">Strikes</label><input class="input" id="smS" type="number" min="0" max="20" value="${+m.strikes || 0}">
    <label class="lbl" for="smN">HR note</label><textarea class="input" id="smN" rows="2">${esc(m.note || "")}</textarea>
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Save</button></div></form>`);
    $("#smF").addEventListener("submit", async e => {
      e.preventDefault(); const body = { rank: $("#smR").value.trim(), group: $("#smG").value.trim(), warnings: +$("#smW").value || 0, strikes: +$("#smS").value || 0, note: $("#smN").value.trim() }; closeModal();
      if (await save("staffmeta/" + u, () => S.db.doc("staffmeta/" + u).set(body), "Saved")) logActivity("Updated a staff record", nameOf(u));
    });
  }));
};

PAGES.ai = () => {
  const active = S.suggestions.filter(s => s.status !== "dismissed");
  return `${head("AI Suggestions", "Advice from Claude based on the panel's real shift, punishment and leave data.")}
  <div class="card notice"><b>Advice only:</b> suggestions never change anything by themselves.</div>
  <div class="toolbar"><button class="btn primary" id="aiGen" ${S.sample ? "" : "disabled"}>Generate fresh suggestions</button><span class="muted" id="aiState" style="font-size:14px"></span></div>
  ${active.length ? active.map(s => `<div class="card sugg"><div class="sugg-top"><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="tag">${esc(s.category)}</span><span class="tag ${s.priority === "high" ? "hi" : "lo"}">${s.priority === "high" ? "High" : "Low"} priority</span>${s.status === "saved" ? `<span class="tag">Saved</span>` : ""}</div>
    <div style="display:flex;gap:6px"><button class="btn sm green" data-st="saved" data-id="${esc(s.id)}">Save</button><button class="btn sm" data-st="dismissed" data-id="${esc(s.id)}">Dismiss</button></div></div>
    <h3>${esc(s.title)}</h3><p>${esc(s.body)}</p><div class="sugg-data"><div><h5>Supporting data</h5>${esc(s.data)}</div><div><h5>Recommended action</h5>${esc(s.action)}</div></div>
    <div class="dim" style="font-size:12px;margin-top:10px">Generated ${ago(s.at)}</div></div>`).join("") : empty("No suggestions yet. Generate some from your current data.")}`;
};
function statsForAI() {
  const ids = [...new Set([...Object.keys(S.profiles), ...Object.keys(S.shifts)])];
  const tags = {}; S.punishments.filter(p => Date.now() - p.at < 7 * D).forEach(p => { (p.reason.toUpperCase().match(/RDM|VDM|NLR|FRP|TROLL\w*|TOOL ABUSE|COMBAT LOG\w*|EXPLOIT\w*/g) || []).forEach(t => { tags[t] = (tags[t] || 0) + 1; }); });
  const hourStaff = Array(24).fill(0);
  Object.values(S.shifts).forEach(sd => (sd.log || []).filter(s => s.e > Date.now() - 7 * D).forEach(s => { for (let t = s.s; t < s.e; t += H) hourStaff[new Date(t).getUTCHours()]++; }));
  return {
    staffCount: ids.length, weeklyQuotaMinutes: quota(),
    staffBelowQuotaThisWeek: ids.filter(u => minutesSince(u, weekStart()) < quota()).length,
    staffWithNoShiftIn7Days: ids.filter(u => !(shiftDoc(u).log || []).some(s => s.e > Date.now() - 7 * D) && !shiftDoc(u).active).length,
    onLeaveToday: ids.filter(onLeave).length,
    punishmentsLast7Days: S.punishments.filter(p => Date.now() - p.at < 7 * D).length, punishmentReasonTags7d: tags,
    staffShiftHoursByUtcHourLast7Days: hourStaff,
    openStaffRequests: S.alerts.filter(a => !a.resolved).length,
    trainingLast30Days: S.training.filter(t => Date.now() - t.at < 30 * D).map(t => t.result),
  };
}
PAGES.ai.after = () => {
  $("#aiGen").addEventListener("click", async () => {
    const btn = $("#aiGen"); btn.disabled = true; $("#aiState").textContent = "Thinking... this can take up to a minute.";
    try {
      const out = await S.sample.json(`You advise the HR team of California State Roleplay, an ER:LC roleplay community. Using ONLY the data below, write 3 practical suggestions about staff coverage, moderation, or staff management. Do not judge individual staff members. If the data is thin, say what to start tracking.
Reply with only a JSON array of objects: {"category": "Staff Management"|"Community Management"|"Training", "priority": "high"|"low", "title": string (under 80 chars), "body": string (1-2 sentences), "data": string (the numbers you used), "action": string (one concrete step)}.
DATA: ${JSON.stringify(statsForAI())}`, { cache: false });
      const list = (Array.isArray(out) ? out : []).slice(0, 5).filter(s => s && s.title);
      for (const s of list) await save("suggestions/new", () => S.db.collection("suggestions").add({ category: String(s.category || "General").slice(0, 40), priority: s.priority === "high" ? "high" : "low", title: String(s.title).slice(0, 120), body: String(s.body || "").slice(0, 500), data: String(s.data || "").slice(0, 500), action: String(s.action || "").slice(0, 400), at: Date.now(), status: "open" }));
      $("#aiState").textContent = list.length ? "" : "Claude didn't return any suggestions. Try again.";
    } catch (e) {
      const el = $("#aiState"); if (el) el.textContent = e.code === "not_granted" ? "Allow the panel to use Claude to generate suggestions." : e.code === "rate_limited" ? "Too many requests right now. Try again later." : "Couldn't generate suggestions. Try again.";
    }
    const b2 = $("#aiGen"); if (b2) b2.disabled = false;
  });
  document.querySelectorAll("[data-st]").forEach(b => b.addEventListener("click", () => save("suggestions/" + b.dataset.id, () => S.db.doc("suggestions/" + b.dataset.id).update({ status: b.dataset.st }), b.dataset.st === "saved" ? "Saved" : "Dismissed")));
};

PAGES.training = () => {
  const T = S.training, passed = T.filter(t => t.result === "Passed").length;
  const avg = T.length ? (T.reduce((a, t) => a + (+t.score || 0), 0) / T.length).toFixed(1) : "0";
  return `${head("Staff training")}
  <div class="card pad"><h2 style="font-size:26px;margin-bottom:18px">Training stats</h2>
  <div class="kpis"><div class="kpi"><div class="v">${T.length}</div><div class="l">Sessions</div></div><div class="kpi"><div class="v">${passed}</div><div class="l">Passed</div></div><div class="kpi"><div class="v">${T.length - passed}</div><div class="l">Failed</div></div><div class="kpi"><div class="v">${T.length ? Math.round((passed / T.length) * 100) : 0}%</div><div class="l">Pass rate</div></div><div class="kpi"><div class="v">${avg}/10</div><div class="l">Average score</div></div></div>
  <p class="muted" style="font-size:16px;line-height:1.55;margin:16px 0 0">Pass mark 8/10. Record every session here after you mark it.</p></div>
  <button class="btn primary" id="addTr" style="margin-top:18px">Record a session</button>
  <h2 class="section-title">Training sessions</h2>
  ${T.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Trainee</th><th>Phase</th><th>Result</th><th>Score</th><th>Trainer</th><th>Date</th><th></th></tr></thead><tbody>
  ${T.map(t => `<tr><td>${esc(t.trainee)}</td><td>${esc(t.phase)}</td><td><span class="pill ${t.result === "Passed" ? "green" : "red"}">${esc(t.result)}</span></td><td>${+t.score}/10</td><td>${esc(nameOf(t.by))}</td><td>${fmtDay(t.at)}</td><td>${t.notes ? `<button class="btn sm" data-notes="${esc(t.id)}">Notes</button>` : ""}</td></tr>`).join("")}
  </tbody></table></div>` : empty("No sessions recorded yet.")}`;
};
PAGES.training.after = () => {
  $("#addTr").addEventListener("click", () => {
    modal(`<h3>Record a session</h3><form id="trF"><label class="lbl" for="trN">Trainee</label><input class="input" id="trN" required placeholder="TM-123 | username">
    <label class="lbl" for="trP">Phase</label><select class="input" id="trP"><option>Phase 1</option><option>Phase 2</option></select>
    <label class="lbl" for="trS">Score out of 10</label><input class="input" id="trS" type="number" min="0" max="10" required>
    <label class="lbl" for="trX">Notes (optional)</label><textarea class="input" id="trX" rows="3"></textarea>
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Save</button></div></form>`);
    $("#trF").addEventListener("submit", async e => {
      e.preventDefault(); const score = Math.max(0, Math.min(10, +$("#trS").value)); const t = { trainee: $("#trN").value.trim(), phase: $("#trP").value, score, result: score >= 8 ? "Passed" : "Failed", notes: $("#trX").value.trim(), by: S.uid, at: Date.now() }; closeModal();
      if (await save("training/new", () => S.db.collection("training").add(t), "Session recorded")) logActivity("Recorded a training session", t.trainee);
    });
  });
  document.querySelectorAll("[data-notes]").forEach(b => b.addEventListener("click", () => { const t = S.training.find(x => x.id === b.dataset.notes); modal(`<h3>${esc(t.trainee)}</h3><p style="line-height:1.6">${esc(t.notes)}</p><div class="actions"><button class="btn" data-close>Close</button></div>`); }));
};

PAGES.leavers = () => {
  if (!S.host) return `${head("Staff leavers")}${notLinked(BOT_MSG)}`;
  const list = S.leavers.filter(l => Date.now() - l.at < 90 * D);
  return `${head("Staff leavers")}
  <p class="muted" style="margin-top:-6px;line-height:1.5">Staff who left the Discord while holding the staff role, from the bot's Staff Member Left alerts (last 90 days). Resolve them in Discord.</p>
  ${list.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Staff member</th><th>How they left</th><th>Left</th><th>Roles they had</th></tr></thead><tbody>
  ${list.map(l => `<tr><td>${esc(l.user?.name)}<div class="dim" style="font-size:12px;margin-top:2px">${esc(l.user?.id)}</div></td><td>${esc(l.how)}</td><td style="white-space:nowrap">${fmtDay(l.at)}</td><td><div style="display:flex;flex-wrap:wrap;gap:6px">${(l.roles || []).filter(r => r && !/^[\s_\-─━]+$/.test(r)).map(r => `<span class="pill">${esc(r)}</span>`).join("")}</div></td></tr>`).join("")}
  </tbody></table></div>` : empty("No staff have left in the last 90 days.")}`;
};
let tFilter = { opened: "", by: "", type: "" };
const dur = ms => (ms == null || ms < 0 ? "-" : ms < H ? `${Math.round(ms / 60e3)}m` : `${Math.floor(ms / H)}h ${Math.round((ms % H) / 60e3)}m`);
const avg = a => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
PAGES.transcripts = () => {
  if (!S.host) return `${head("Transcripts")}${notLinked(BOT_MSG)}`;
  const T = S.transcripts, closed = T.filter(t => t.closedAt), open = T.filter(t => !t.closedAt);
  const firstReply = avg(T.filter(t => t.firstReplyAt && t.openedAt).map(t => t.firstReplyAt - t.openedAt));
  const toClose = avg(closed.filter(t => t.openedAt).map(t => t.closedAt - t.openedAt));
  const perDay = (T.filter(t => Date.now() - t.openedAt < 30 * D).length / 30).toFixed(1);
  const staff = {}; T.forEach(t => { const c = t.claimedBy; if (!c) return; const r = (staff[c.id] ||= { name: c.name, n: 0, fr: [], tc: [] }); r.n++; if (t.firstReplyAt) r.fr.push(t.firstReplyAt - t.openedAt); if (t.closedAt) r.tc.push(t.closedAt - t.openedAt); });
  const hours = Array(24).fill(0); T.forEach(t => { if (t.openedAt) hours[new Date(t.openedAt).getHours()]++; }); const hmax = Math.max(1, ...hours);
  const types = [...new Set(T.map(t => t.type).filter(Boolean))];
  const match = t => (!tFilter.opened || (t.openedBy?.name || "").toLowerCase().includes(tFilter.opened.toLowerCase()) || t.openedBy?.id === tFilter.opened) && (!tFilter.by || t.claimedBy?.id === tFilter.by) && (!tFilter.type || t.type === tFilter.type);
  const row = t => `<tr><td>#${esc(t.number || t.id.slice(0, 6))}</td><td>${esc(t.type)}</td><td>${esc(t.openedBy?.name)}</td><td>${esc(t.subject)}</td><td style="white-space:nowrap">${t.openedAt ? fmtShort(t.openedAt) : "-"}</td><td>${t.claimedBy ? esc(t.claimedBy.name) : "No"}</td><td>${t.messages?.length ? `<button class="btn sm" data-tview="${esc(t.id)}">View</button>` : ""}</td></tr>`;
  const head7 = `<thead><tr><th>Ticket</th><th>Type</th><th>Opened by</th><th>Subject</th><th>Opened</th><th>Claimed</th><th></th></tr></thead>`;
  return `${head("Transcripts")}
  <div class="card pad"><h2 style="font-size:26px;margin-bottom:18px">Ticket stats</h2>
    <div class="kpis"><div class="kpi"><div class="v">${T.length}</div><div class="l">Opened</div></div><div class="kpi"><div class="v">${closed.length}</div><div class="l">Closed</div></div><div class="kpi"><div class="v">${open.length}</div><div class="l">Open now</div></div><div class="kpi"><div class="v">${dur(firstReply)}</div><div class="l">Average first reply</div></div><div class="kpi"><div class="v">${dur(toClose)}</div><div class="l">Average time to close</div></div><div class="kpi"><div class="v">${perDay}</div><div class="l">Tickets per day (30 days)</div></div></div>
    <h3 style="font-size:20px;margin:28px 0 12px">Per staff member</h3>
    ${Object.keys(staff).length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Staff member</th><th>Handled</th><th>First reply</th><th>Time to close</th></tr></thead><tbody>${Object.values(staff).sort((a, b) => b.n - a.n).map(r => `<tr><td>${esc(r.name)}</td><td>${r.n}</td><td>${dur(avg(r.fr))}</td><td>${dur(avg(r.tc))}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">No claimed tickets yet.</p>`}
    <h3 style="font-size:20px;margin:28px 0 0">Busiest hours (opened, your time)</h3>
    <div class="bars">${hours.map((h, i) => `<div style="height:${(h / hmax) * 100}%" title="${String(i).padStart(2, "0")}:00 · ${h} tickets"></div>`).join("")}</div>
    <div class="bars-x"><span>00</span><span>06</span><span>12</span><span>18</span><span>23</span></div>
  </div>
  <div class="toolbar" style="margin-top:22px">
    <input class="input" id="tOpen" placeholder="Name or Discord ID of the user" style="max-width:260px" value="${esc(tFilter.opened)}" data-fresh>
    <select class="input" id="tBy" style="max-width:220px" data-fresh><option value="">Handled by: Anyone</option>${Object.entries(staff).map(([id, r]) => `<option value="${esc(id)}" ${tFilter.by === id ? "selected" : ""}>${esc(r.name)}</option>`).join("")}</select>
    <select class="input" id="tType" style="max-width:200px" data-fresh><option value="">All types</option>${types.map(t => `<option ${tFilter.type === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>
    <button class="btn" id="tClear">Clear</button>
  </div>
  <h2 class="section-title" style="font-size:30px">Open tickets</h2>
  ${open.filter(match).length ? `<div class="table-wrap"><table class="tbl">${head7}<tbody>${open.filter(match).map(row).join("")}</tbody></table></div>` : empty("No open tickets.")}
  <h2 class="section-title">Closed tickets</h2>
  ${closed.filter(match).length ? `<div class="table-wrap"><table class="tbl">${head7}<tbody>${closed.filter(match).slice(0, 200).map(row).join("")}</tbody></table></div>` : empty("No closed tickets yet.")}`;
};
PAGES.transcripts.after = () => {
  if (!S.host) return;
  const set = () => { tFilter = { opened: $("#tOpen").value.trim(), by: $("#tBy").value, type: $("#tType").value }; document.activeElement?.blur(); route(true); };
  $("#tOpen").addEventListener("change", set); $("#tBy").addEventListener("change", set); $("#tType").addEventListener("change", set);
  $("#tClear").addEventListener("click", () => { tFilter = { opened: "", by: "", type: "" }; route(true); });
  document.querySelectorAll("[data-tview]").forEach(b => b.addEventListener("click", () => {
    const t = S.transcripts.find(x => x.id === b.dataset.tview);
    modal(`<h3>Ticket #${esc(t.number || "")}</h3><p class="muted" style="margin:0 0 12px">${esc(t.type)} · opened by ${esc(t.openedBy?.name)}${t.closedAt ? ` · closed ${fmtShort(t.closedAt)}` : ""}</p>
    <div class="transcript">${(t.messages || []).map(m => `<div class="tmsg"><b>${esc(m.author?.name || "Unknown")}</b> <span class="dim">${m.at ? fmtShort(m.at) : ""}</span><div>${esc(m.content)}</div></div>`).join("")}</div>
    <div class="actions"><button class="btn" data-close>Close</button></div>`);
  }));
};
PAGES.log = () => {
  const rows = Object.entries(S.logs).flatMap(([u, l]) => (l.items || []).map(i => ({ ...i, u }))).sort((a, b) => b.at - a.at);
  return `${head("Website log")}
  <p class="muted" style="margin-top:-6px">Everything staff do on the panel, newest first.</p>
  <div class="toolbar"><div class="search">${icon("search")}<input class="input" id="logQ" placeholder="Staff, action or detail" data-fresh></div></div>
  ${rows.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>When</th><th>Staff</th><th>Action</th><th>Detail</th></tr></thead><tbody id="logBody">
  ${rows.map(r => `<tr><td style="white-space:nowrap">${fmtShort(r.at)}</td><td>${esc(nameOf(r.u))}</td><td>${esc(r.action)}</td><td>${esc(r.target)}</td></tr>`).join("")}
  </tbody></table></div>` : empty("No activity yet.")}`;
};
PAGES.log.after = () => $("#logQ").addEventListener("input", e => { const q = e.target.value.toLowerCase(); document.querySelectorAll("#logBody tr").forEach(tr => { tr.hidden = q && !tr.textContent.toLowerCase().includes(q); }); });


/* ================= ER:LC (real website only) ================= */
const G = { server: null, players: null, queue: null, logs: {}, logsAt: {}, err: null };
async function erlcGet(kind) { const r = await fetch("/api/erlc/" + kind, { credentials: "same-origin" }); if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "ER:LC error"); return r.json(); }
async function pollGame() {
  try { const [server, players, queue] = await Promise.all(["server", "players", "queue"].map(erlcGet)); Object.assign(G, { server, players, queue, err: null }); }
  catch (e) { G.err = e.message; }
  render(true);
}
function gameLogs(kind) {
  if (Date.now() - (G.logsAt[kind] || 0) > 60000) {
    G.logsAt[kind] = Date.now();
    erlcGet(kind).then(d => { G.logs[kind] = Array.isArray(d) ? d : []; render(true); }).catch(e => { G.err = e.message; render(true); });
  }
  return G.logs[kind];
}
const who = v => { const [name, id] = String(v || "").split(":"); return { name: name || "Unknown", id: id || "" }; };
const gameTime = t => ago((+t || 0) * 1000);
const TEAM_COLORS = { Police: "#5b8def", Sheriff: "#4cc38a", Fire: "#f06363", DOT: "#f0963a", Jail: "#a37cf0", Civilian: "#ffffff" };
const gameWait = () => (G.err ? `<div class="card pad muted">Couldn't reach the ER:LC server: ${esc(G.err)}</div>` : `<p class="muted">Loading from ER:LC…</p>`);

/* ================= Pages: In game ================= */
PAGES.map = () => {
  if (!S.host) return `${head("Map")}${notLinked(GAME_MSG)}`;
  if (!G.players) return `${head("Map")}${gameWait()}`;
  const teams = {}; G.players.forEach(pl => { (teams[pl.Team || "Civilian"] ||= []).push(pl); });
  return `${head("Map", "Who is on which team right now. The ER:LC API doesn't share player positions.")}
  <p style="font-size:19px;margin:0" class="muted">${G.players.length} player${G.players.length === 1 ? "" : "s"} in the server.</p>
  <div class="legend">${Object.entries(TEAM_COLORS).map(([n, c]) => `<span><i style="border-color:${c}"></i>${n} ${(teams[n] || []).length}</span>`).join("")}</div>
  ${Object.keys(teams).length ? `<div class="grid-2">${Object.entries(teams).map(([t, ps]) => `<div class="card list-card"><div class="lc-head"><i class="team-dot" style="background:${TEAM_COLORS[t] || "#999"}"></i> ${esc(t)} <span class="count">${ps.length}</span></div>${ps.map(pl => `<div class="prow"><div><div class="nm">${esc(who(pl.Player).name)}</div><div class="id">${esc(pl.Callsign || pl.Permission || "")}</div></div></div>`).join("")}</div>`).join("")}</div>` : `<p class="muted">Nobody is in the server.</p>`}`;
};
PAGES.vision = () => {
  if (!S.host) return `${head("CSRP Vision")}${notLinked(GAME_MSG)}`;
  const kills = gameLogs("killlogs"), calls = gameLogs("modcalls"), joins = gameLogs("joinlogs");
  const recentKills = (kills || []).filter(k => Date.now() / 1000 - k.Timestamp < 900).sort((a, b) => b.Timestamp - a.Timestamp);
  return `${head("CSRP Vision", "Kills, mod calls and joins from the ER:LC server.")}
  <h2 class="section-title" style="margin-top:0">Kills, last 15 minutes</h2>
  ${!kills ? gameWait() : recentKills.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Killer</th><th>Killed</th><th>When</th></tr></thead><tbody>${recentKills.map(k => `<tr><td>${esc(who(k.Killer).name)}</td><td>${esc(who(k.Killed).name)}</td><td>${gameTime(k.Timestamp)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">No kills.</p>`}
  <h2 class="section-title">Mod calls</h2>
  ${!calls ? gameWait() : calls.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Caller</th><th>Responder</th><th>When</th></tr></thead><tbody>${calls.slice().sort((a, b) => b.Timestamp - a.Timestamp).slice(0, 30).map(c => `<tr><td>${esc(who(c.Caller).name)}</td><td>${c.Moderator ? esc(who(c.Moderator).name) : `<span class="pill red">Nobody yet</span>`}</td><td>${gameTime(c.Timestamp)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">No mod calls.</p>`}
  <h2 class="section-title">Joins and leaves</h2>
  ${!joins ? gameWait() : joins.length ? `<div class="card list-card">${joins.slice().sort((a, b) => b.Timestamp - a.Timestamp).slice(0, 25).map(j => `<div class="ov-act"><span><b>${esc(who(j.Player).name)}</b> ${j.Join ? "joined" : "left"} the server</span><span class="dim">${gameTime(j.Timestamp)}</span></div>`).join("")}</div>` : `<p class="muted">No recent joins.</p>`}`;
};
PAGES.commands = () => {
  const logs = S.host ? gameLogs("commandlogs") : null;
  return `${head("Commands")}
  ${S.host ? `<form id="cmdF" class="card pad"><label class="lbl" for="cmdIn" style="margin-top:0">Run a command in the server</label>
    <div class="chat-input"><input class="input mono" id="cmdIn" placeholder=":h Server restart in 5 minutes" required maxlength="300" data-fresh><button class="btn primary" ${S.readOnly ? "disabled" : ""}>Run</button></div>
    <p class="dim" style="font-size:13px;margin:8px 0 0">${S.isAdmin ? "You can run any command." : "Staff can run moderator commands. :ban and other admin commands are HR only."}</p></form>`
    : notLinked("Running commands from the panel needs the ER:LC private server API, which this host can't reach. Use these in game for now.")}
  <div class="table-wrap" style="margin-top:16px"><table class="tbl"><thead><tr><th>Command</th><th>What it does</th><th>Rank</th><th>Usage</th></tr></thead><tbody>
  ${COMMANDS.map(c => `<tr><td>${c[0]}</td><td style="min-width:220px">${c[1]}</td><td>${c[2]}</td><td><code style="color:var(--text)">${esc(c[3])}</code></td></tr>`).join("")}
  </tbody></table></div>
  ${S.host ? `<h2 class="section-title">Recent commands in the server</h2>${!logs ? gameWait() : logs.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Player</th><th>Command</th><th>When</th></tr></thead><tbody>${logs.slice().sort((a, b) => b.Timestamp - a.Timestamp).slice(0, 40).map(c => `<tr><td>${esc(who(c.Player).name)}</td><td><code>${esc(c.Command)}</code></td><td>${gameTime(c.Timestamp)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">No commands yet.</p>`}` : ""}`;
};
PAGES.commands.after = () => {
  const f = $("#cmdF"); if (!f) return;
  f.addEventListener("submit", async e => {
    e.preventDefault(); const command = $("#cmdIn").value.trim(), btn = f.querySelector("button"); btn.disabled = true;
    try {
      const r = await fetch("/api/erlc/command", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ command }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok) { $("#cmdIn").value = ""; toast("Command sent"); G.logsAt.commandlogs = 0; } else toast(d.error || "Command failed");
    } catch { toast("Couldn't reach the server"); }
    btn.disabled = false;
  });
};
PAGES.players = () => {
  const mine = [...new Map(S.punishments.filter(p => p.by === S.uid).map(p => [p.player.toLowerCase(), p])).values()].slice(0, 8);
  return `${head("Players")}
  <div class="card pad"><h2 style="font-size:22px;margin-bottom:14px">Find a player</h2>
    <form id="findP" class="search" style="max-width:none">${icon("search")}<input class="input" id="findQ" placeholder="Roblox username or ID" data-fresh></form>
    <div id="findRes"></div></div>
  <div class="card list-card" style="margin-top:20px"><div class="lc-head">In the server${G.players ? ` <span class="count">${G.players.length}</span>` : ""}</div>
    ${!S.host ? `<div class="lc-empty">Needs the in-game connection.</div>` : !G.players ? `<div class="lc-empty">${G.err ? "Couldn't reach the ER:LC server." : "Loading…"}</div>` : G.players.length ? G.players.map(pl => { const w = who(pl.Player), past = S.punishments.filter(x => x.player.toLowerCase() === w.name.toLowerCase() || String(x.robloxId) === w.id).length; return `<div class="prow"><span class="team-dot" style="background:${TEAM_COLORS[pl.Team] || "#999"}"></span><div style="flex:1"><div class="nm">${esc(w.name)}</div><div class="id">${esc(pl.Team || "")}${pl.Callsign ? " · " + esc(pl.Callsign) : ""}${pl.Permission && pl.Permission !== "Normal" ? " · " + esc(pl.Permission) : ""}</div></div>${past ? `<span class="pill yellow">${past} on record</span>` : ""}</div>`; }).join("") : `<div class="lc-empty">Nobody is in the server.</div>`}</div>
  <div class="card list-card" style="margin-top:20px"><div class="lc-head">Players you punished recently</div>
    ${mine.length ? mine.map(p => `<div class="prow"><div><div class="nm">${esc(p.player)}</div><div class="id">${esc(p.robloxId || "No Roblox ID")}</div><div class="meta">${esc(p.action)} · ${ago(p.at)}</div></div></div>`).join("") : `<div class="lc-empty">You haven't logged any punishments yet.</div>`}
  </div>`;
};
PAGES.players.after = () => $("#findP").addEventListener("submit", e => {
  e.preventDefault(); const q = $("#findQ").value.trim().toLowerCase(); if (!q) return;
  const hits = S.punishments.filter(p => p.player.toLowerCase().includes(q) || String(p.robloxId || "") === q);
  $("#findRes").innerHTML = hits.length ? `<div class="table-wrap" style="margin-top:14px"><table class="tbl"><thead><tr><th>Player</th><th>Action</th><th>Reason</th><th>By</th><th>When</th></tr></thead><tbody>${hits.map(p => `<tr><td>${esc(p.player)}</td><td>${esc(p.action)}</td><td>${esc(p.reason)}</td><td>${esc(nameOf(p.by))}</td><td>${fmtShort(p.at)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted" style="margin:14px 0 0">No punishment records for that player.</p>`;
});
let pFilter = { q: "", t: "" };
PAGES.punishments = () => {
  const rows = S.punishments.filter(p => (!pFilter.t || p.action === pFilter.t) && (!pFilter.q || p.player.toLowerCase().includes(pFilter.q.toLowerCase()) || String(p.robloxId || "").includes(pFilter.q)));
  return `${head("Punishments")}
  <form id="pSearch">
    <label class="lbl" for="pq">Roblox username or ID</label><input class="input" id="pq" value="${esc(pFilter.q)}" data-fresh>
    <label class="lbl" for="pt">Action type</label>
    <select class="input" id="pt" data-fresh>${["", "Warning", "Kick", "Temp ban", "Ban"].map(o => `<option value="${o}" ${pFilter.t === o ? "selected" : ""}>${o || "All actions"}</option>`).join("")}</select>
    <button class="btn primary block" style="margin-top:14px">Search</button>
  </form>
  <div class="split"><a class="btn" href="#players">${icon("search", 16)} Search Players</a><button class="btn" id="logP" ${S.readOnly ? "disabled" : ""}>Log punishment</button></div>
  ${rows.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Action</th><th>Player</th><th>Roblox ID</th><th>Reason</th><th>Duration</th><th>Moderator</th><th>Recorded</th>${S.isAdmin ? "<th></th>" : ""}</tr></thead><tbody>
  ${rows.map(p => `<tr><td>${esc(p.action)}</td><td>${esc(p.player)}</td><td>${esc(p.robloxId || "-")}</td><td style="min-width:180px">${esc(p.reason)}</td><td>${esc(p.duration || "")}</td><td>${esc(nameOf(p.by))}</td><td style="white-space:nowrap">${fmtShort(p.at)}</td>${S.isAdmin ? `<td><button class="btn sm" data-delp="${esc(p.id)}">Delete</button></td>` : ""}</tr>`).join("")}
  </tbody></table></div>` : empty(S.punishments.length ? "No punishments match." : "No punishments logged yet.")}`;
};
PAGES.punishments.after = () => {
  $("#pSearch").addEventListener("submit", e => { e.preventDefault(); pFilter = { q: $("#pq").value.trim(), t: $("#pt").value }; document.activeElement?.blur(); route(true); });
  $("#logP").addEventListener("click", openLogPunishment);
  document.querySelectorAll("[data-delp]").forEach(b => b.addEventListener("click", () => {
    modal(`<h3>Delete this punishment?</h3><p class="muted">It's removed from the log for everyone.</p><div class="actions"><button class="btn" data-close>Cancel</button><button class="btn primary" id="cDel">Delete</button></div>`);
    $("#cDel").addEventListener("click", () => { closeModal(); save("punishments/" + b.dataset.delp, () => S.db.doc("punishments/" + b.dataset.delp).delete(), "Deleted"); });
  }));
};

boot();

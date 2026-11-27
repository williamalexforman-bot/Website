/* California State Roleplay — Staff panel (demo, no backend).
   All data below is sample data. Swap the DATA object for real API calls later. */

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

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

/* ---------------- Sample data ---------------- */
const now = Date.now();
const H = 3600e3, D = 24 * H;
const DATA = {
  server: { players: 0, max: 60, queue: 0, onDuty: 0 },
  punishments: [
    { action: "Warning", player: "Sunset_Driver22", id: 5512093341, reason: "Tool abuse, pepper spraying people who were no threat.", duration: "", mod: "GoldenGate_Mod", at: now - 0.9 * D },
    { action: "Warning", player: "MaverickRP_01", id: 1834402291, reason: "VDM, tool abuse, staff evasion.", duration: "", mod: "GoldenGate_Mod", at: now - 1.4 * D },
    { action: "Warning", player: "PacificCoastKid", id: 9902114872, reason: "Cuff rushing players.", duration: "", mod: "redwood_ranger", at: now - 1.6 * D },
    { action: "Warning", player: "PacificCoastKid", id: 9902114872, reason: "VDM, spiking LEO cars.", duration: "", mod: "GoldenGate_Mod", at: now - 1.7 * D },
    { action: "Warning", player: "CanyonWolf_77", id: 1203448811, reason: "Trolling and failed roleplay.", duration: "", mod: "GoldenGate_Mod", at: now - 1.8 * D },
    { action: "Kick", player: "xX_Chaos_Xx", id: 4377129055, reason: "Mass RDM, trolling, staff disrespect.", duration: "", mod: "GoldenGate_Mod", at: now - 2.1 * D },
    { action: "Kick", player: "MojaveMayhem", id: 3994012883, reason: "RDM in safe zone.", duration: "", mod: "redwood_ranger", at: now - 3.2 * D },
    { action: "Ban", player: "Exploiter_9000", id: 2210048857, reason: "Exploiting / flying.", duration: "Permanent", mod: "SierraAdmin", at: now - 4 * D },
    { action: "Temp ban", player: "BayAreaBandit", id: 7781203456, reason: "Repeated RDM after warnings.", duration: "3 days", mod: "SierraAdmin", at: now - 5 * D },
  ],
  commands: [
    [":h", "Send a server hint.", "Moderator", ":h <message>"],
    [":m", "Send a server message.", "Moderator", ":m <message>"],
    [":kick", "Kick one player. Equal or higher staff cannot be targeted.", "Moderator", ":kick <Roblox ID or username>"],
    [":tp", "Teleport your verified Roblox account to one player. Both must be in game.", "Moderator", ":tp <Roblox ID or username>"],
    [":bring", "Bring one player to your verified Roblox account. Both must be in game.", "Moderator", ":bring <Roblox ID or username>"],
    [":ban", "Ban one account. Requires confirmation; cannot target equal or higher staff.", "Administrator", ":ban <Roblox ID or username>"],
    [":unban", "Remove one account ban. Requires confirmation.", "Administrator", ":unban <Roblox ID or username>"],
  ],
  recentCommands: [],
  recentPlayers: [
    { name: "Sunset_Driver22", id: 5512093341, ago: "11 days ago" },
    { name: "Coastline_Tom", id: 3020188431, ago: "27 days ago" },
    { name: "Sequoia_Steve", id: 4391001276, ago: "27 days ago" },
    { name: "fresnofrank", id: 1514410072, ago: "27 days ago" },
  ],
  tickets: {
    opened: 692, closed: 675, open: 17, firstReply: "36m", toClose: "38h 5m", perDay: 20.3,
    staff: [
      ["coastal_carter", 32, "44m", "3h 32m"], ["bigsur_ben", 31, "9m", "5h 28m"], ["napa_nova", 29, "6m", "6h 14m"],
      ["tahoe_tess", 27, "2h 0m", "15h 15m"], ["oakland_ollie", 24, "5m", "5h 53m"], ["malibu_max", 18, "2m", "11h 55m"],
      ["yosemite_yara", 17, "32m", "7h 33m"], ["ventura_vic", 16, "5m", "9h 23m"], ["shasta_sam", 13, "12m", "6h 33m"], ["redding_rae", 13, "3m", "9h 24m"],
    ],
    hours: [3, 2, 2, 2, 2, 7, 6, 6, 8, 10, 17, 22, 19, 20, 23, 38, 35, 21, 19, 11, 6, 8, 1, 4],
    openList: [
      ["#0752", "High Rank Support", "oceanside_owen", "Affiliate request", now - 0.3 * D, "No"],
      ["#0751", "General Support", "PacificCoastKid", "Question about warnings", now - 0.6 * D, "Yes"],
      ["#0749", "Report", "Sunset_Driver22", "Player report, RDM", now - 1.1 * D, "Yes"],
      ["#0746", "Appeal", "MojaveMayhem", "Kick appeal", now - 2 * D, "No"],
    ],
  },
  training: {
    sessions: 69, passed: 26, failed: 41, rate: "39%", avg: "5.3/10", last30: 69,
    waiting: [["#100068", "TM-378 | delmar_dan", now - 0.4 * D], ["#100067", "TM-943 | chico_chris", now - 1.4 * D]],
    list: [
      ["#100069", "TM-627 | sacramento_sky", "Passed", "8/10", now - 0.3 * D],
      ["#100066", "TM-631 | lompoc_leo", "Passed", "10/10", now - 2.3 * D],
      ["#100065", "TM-585 | eureka_eli", "Failed", "5/10", now - 3.2 * D],
      ["#100064", "TM-111 | pasadena_pat", "Passed", "8/10", now - 11.2 * D],
      ["#100063", "TM-702 | irvine_ivy", "Failed", "4/10", now - 12 * D],
    ],
  },
  leavers: [
    { name: "palmsprings_pj", id: "1379501772183170001", how: "Left on their own", at: now - 2 * D, roles: ["Highranking Team", "CSRP | Administration Team", "Trial Administrator", "CSRP | Staff Team", "Community Member", "Session Ping", "Strike 1"] },
    { name: "longbeach_lou", id: "1519159389607430002", how: "Left on their own", at: now - 5 * D, roles: ["CSRP | Moderation Team", "Trial Moderator", "CSRP | Staff Team", "Community Member", "Session Ping", "Strike 1"] },
    { name: "carmel_cody", id: "1210004418765430003", how: "Kicked", at: now - 19 * D, roles: ["Moderator", "CSRP | Staff Team", "Community Member"] },
  ],
  suggestions: [
    { cat: "Staff Management", pri: "hi", title: "Cover recurring understaffed window around Sat 16:00 UTC", body: "Server population reached 25+ players during 1,657 tracked minutes this week, with 1,057 minutes having 2 or fewer staff on duty (613 critical minutes at 0–1 staff).", data: "Top understaffed slots: Sat 16:00 UTC (48.9 avg players, 1 staff); Sat 15:00 UTC (48.1 avg players, 1 staff); Sat 19:00 UTC (43.5 avg players, 1 staff). Weekly coverage rate: 36% (36 active staff across 127 shifts, 13 approved LOAs).", action: "Announce 1.5x bonus shift windows for Sat 16:00 UTC in Staff Updates and recruit moderators available in that time zone." },
    { cat: "Community Management", pri: "hi", title: "Address recurring RDM incidents and modcall response times", body: "In the last 7 days, 0 modcalls were logged (0 without an assigned responder) alongside 351 recorded punishments and 0 staff backup requests.", data: "Modcalls (7d): 0 (unanswered: 0) | Staff requests: 0 | Top punishment tags: RDM (42), TROLLING (12), VDM (12), COMBAT_LOG (9).", action: "Post an in-game reminder and host a structured RP patrol event focused on reducing RDM hotspots." },
    { cat: "Economy", pri: "lo", title: "Encourage registered vehicle trading on the CAD Marketplace", body: "Over the past 7 days, 0 marketplace listings were posted (0 registered vehicles, 0 sold) with 0 settled escrow vehicle transfers.", data: "Listings (7d): 0 (0 open, 0 sold) | Avg price: $0 | Active escrow offers: 0 ($0 held).", action: "Highlight vehicle escrow protection in community announcements to boost safe player-to-player vehicle sales." },
  ],
  staff: {
    total: 84, inactive: 67, leave: 9, disc: 52,
    groups: [
      ["Leadership", [
        ["Founder_CA", "Server Lead", "0m", "0m", "No shifts", "Clean", 14],
        ["SierraAdmin", "Server Lead", "0m", "4h 0m", "11 days ago", "2 strikes", 51],
        ["VC-540 | GoldenState_G", "Vice Chairman", "0m", "1h 36m", "22 days ago", "1 strike", 51],
        ["C | Pacific_Pete", "Chairman", "0m", "46m", "22 days ago", "1 strike", 11],
        ["VC-629 | baywatch_bri", "Vice Chairman", "0m", "30m", "25 days ago", "1 strike", 0],
        ["AC-950 | delta_dev", "Assistant Chairman", "0m", "0m", "No shifts", "1 strike", 0],
        ["LSA-490 | fog_city", "Leadership Advisory", "0m", "1h 2m", "11 days ago", "1 warning", 3],
      ]],
      ["Executive", [
        ["EX-265 | oakland_ollie", "Executive", "0m", "1h 21m", "27 days ago", "1 strike", 0],
        ["TE-926 | santa_cruz_sid", "Trial Executive", "5m", "10h 10m", "3 days ago", "Clean", 26],
      ]],
      ["Administration", [
        ["GoldenGate_Mod", "Administrator", "2h 16m", "41h 2m", "Today", "Clean", 188],
        ["redwood_ranger", "Senior Moderator", "54m", "22h 40m", "1 day ago", "Clean", 74],
      ]],
      ["Moderation", [
        ["tahoe_tess", "Moderator", "43m", "8h 12m", "2 days ago", "1 warning", 19],
        ["napa_nova", "Moderator", "22m", "5h 51m", "3 days ago", "Clean", 12],
        ["malibu_max", "Trial Moderator", "15m", "1h 4m", "4 days ago", "Clean", 3],
      ]],
    ],
  },
  forms: [
    { title: "appeals", open: true, resp: "1 response", slug: "appeals" },
    { title: "Community manager application", open: false, resp: "9 responses, 8 waiting", slug: "community-manager-application" },
    { title: "Staff Trainer Application", open: true, resp: "8 responses", slug: "staff-trainer-application" },
    { title: "Staff Application", open: true, resp: "13 responses", slug: "staff-application" },
  ],
  departments: [
    ["California Highway Patrol", [
      ["SP-011 | GoldenState_G", "Commissioner | CHP", "GoldenState_G", true], ["SP-010 | Pacific_Pete", "Deputy Commissioner | CHP", "Pacific_Pete", true],
      ["SP-400 | baywatch_bri", "Assistant Commissioner | CHP", "baywatch_bri", true], ["3P-001 | delta_dev", "Captain | CHP", "delta_dev", true],
      ["2P-777 | fog_city", "Lieutenant | CHP", "fog_city", true], ["1P-489 | tahoe_tess", "Officer II | CHP", "tahoe_tess", true],
      ["malibu_max", "Cadet | CHP", "malibu_max", true], ["CHP Bots", "Bots", "Not linked", false],
    ]],
    ["State Police Department", [
      ["Chief | Founder_CA", "Chief of Police", "Founder_CA", true], ["Cmdr. | SierraAdmin", "Commander", "SierraAdmin", true],
      ["Sgt. | redwood_ranger", "Sergeant", "redwood_ranger", true], ["Ofc. | napa_nova", "Officer", "napa_nova", true],
      ["SPD Utils", "Bots", "Not linked", false],
    ]],
    ["Sheriff's Office", [
      ["Sheriff | oakland_ollie", "Sheriff", "oakland_ollie", true], ["Dep. | santa_cruz_sid", "Deputy", "santa_cruz_sid", true],
    ]],
  ],
  leaderboard: { week: [["GoldenGate_Mod", "2h 16m"], ["redwood_ranger", "54m"], ["tahoe_tess", "43m"], ["napa_nova", "22m"], ["malibu_max", "15m"], ["santa_cruz_sid", "7m"], ["coastal_carter", "5m"]],
    month: [["GoldenGate_Mod", "18h 40m"], ["redwood_ranger", "9h 12m"], ["tahoe_tess", "6h 3m"], ["SierraAdmin", "4h 0m"], ["napa_nova", "3h 51m"], ["santa_cruz_sid", "3h 10m"]],
    all: [["GoldenGate_Mod", "41h 2m"], ["redwood_ranger", "22h 40m"], ["santa_cruz_sid", "10h 10m"], ["tahoe_tess", "8h 12m"], ["napa_nova", "5h 51m"], ["SierraAdmin", "4h 0m"]] },
};

/* ---------------- Routes ---------------- */
const NAV = [
  ["Me", [["", "Overview", "grid"], ["shifts", "My shifts", "clock"], ["profile", "Profile", "idcard"], ["timeoff", "Time off", "plane"], ["activity", "My activity", "history"], ["guide", "Guide", "book"]]],
  ["Staff", [["onduty", "On duty", "radio"], ["coverage", "Coverage", "pulse"], ["leaderboard", "Leaderboard", "trophy"], ["departments", "Departments", "shield"], ["assistant", "Ask Goldie", "chat"], ["forms", "Forms", "form"]]],
  ["HR", [["staff", "Staff management", "users"], ["ai", "Suggestions", "clipboard"], ["training", "Staff training", "grad"], ["leavers", "Staff leavers", "alert"], ["transcripts", "Transcripts", "scroll"], ["log", "Website log", "pulse"], ["mail", "CSRP Mail", "mail"]]],
  ["In game", [["map", "Map", "pin"], ["players", "Players", "search"], ["vision", "Vision", "eye"], ["commands", "Commands", "term"], ["punishments", "Punishments", "gavel"]]],
];
const TITLES = { ...Object.fromEntries(NAV.flatMap(g => g[1]).map(([k, t]) => [k, t])), coverage: "Staff coverage", profile: "My Profile", "guide-staff": "Staff guide", "guide-instructor": "Staff instructor guide" };

/* ---------------- Helpers ---------------- */
function fmtDate(t) {
  const d = new Date(t), diff = now - t;
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diff < D && new Date().getDate() === d.getDate()) return `Today ${time}`;
  if (diff < 2 * D) return `Yesterday ${time}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })} at ${time}`;
}
const avatarColor = s => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return `linear-gradient(135deg,hsl(${h} 55% 55%),hsl(${(h + 40) % 360} 50% 30%))`; };
const avatar = (name, size = 36) => `<span class="avatar" style="width:${size}px;height:${size}px;background:${avatarColor(name)};color:#fff">${esc(name.replace(/^.*\|\s*/, "").slice(0, 2).toUpperCase())}</span>`;
const head = (title, sub = "") => `<a class="back" href="#overview">${icon("arrowL", 16)} Back to Overview</a>
<div class="page-head"><div><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ""}</div><button class="btn" data-refresh>Refresh</button></div>`;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200); }
function modal(html) { $("#modal").innerHTML = html; $("#modalBg").classList.add("open"); }
function closeModal() { $("#modalBg").classList.remove("open"); }
$("#modalBg").addEventListener("click", e => { if (e.target.id === "modalBg" || e.target.closest("[data-close]")) closeModal(); });

/* ---------------- Pages ---------------- */
const PAGES = {};

/* ---------- Personal state (browser only) ---------- */
const readJSON = (k, d) => { try { const v = JSON.parse(store.get(k)); return v ?? d; } catch { return d; } };
const writeJSON = (k, v) => store.set(k, JSON.stringify(v));
const me = () => ({ name: store.get("csrp_name") || "csrp_staff", roblox: store.get("csrp_roblox") || "", rank: "Administrator" });
function logActivity(action, target = "") { const a = readJSON("csrp_activity", []); a.unshift({ at: Date.now(), action, target }); writeJSON("csrp_activity", a.slice(0, 200)); }
const QUOTA_MIN = 30;
const fmtMin = m => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);
const fmtShort = t => new Date(t).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
function weekStart() {
  const d = new Date();
  const r = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - d.getUTCDay(), 21));
  if (r > d) r.setUTCDate(r.getUTCDate() - 7);
  return +r;
}
const shiftHistory = () => readJSON("csrp_shifts", []);
function weekMinutes() {
  const ws = weekStart();
  let m = shiftHistory().filter(s => s.end >= ws).reduce((a, s) => a + s.mins, 0);
  if (shiftStart) m += Math.floor((Date.now() - Math.max(shiftStart, ws)) / 60000);
  return m;
}
function resetsIn() { const ms = weekStart() + 7 * D - Date.now(); return `${Math.floor(ms / D)}d ${Math.floor((ms % D) / H)}h`; }
const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };

DATA.activityFeed = [
  ["Sunset_Driver22", "left", 1], ["GoldenState_G", "left", 1], ["santa_cruz_sid", "left", 1], ["fresnofrank", "left", 1], ["MojaveMayhem", "left", 1],
  ["Coastline_Tom", "joined", 1.4], ["Sequoia_Steve", "left", 2], ["fresnofrank", "joined", 2], ["oakland_ollie", "left", 2], ["BayAreaBandit", "left", 2],
  ["CanyonWolf_77", "joined", 2.2], ["Sunset_Driver22", "joined", 2.5],
];
DATA.websiteLog = [
  [now - 0.9 * D, "GoldenGate_Mod", "Recorded a punishment", "Sunset_Driver22"],
  [now - 1.4 * D, "GoldenGate_Mod", "Recorded a punishment", "MaverickRP_01"],
  [now - 1.6 * D, "redwood_ranger", "Recorded a punishment", "PacificCoastKid"],
  [now - 1.9 * D, "SierraAdmin", "Approved an LOA request", "tahoe_tess"],
  [now - 2.4 * D, "SierraAdmin", "Changed bonus shift settings", ""],
  [now - 3 * D, "redwood_ranger", "Started a shift", ""],
  [now - 3.1 * D, "redwood_ranger", "Ran :kick", "MojaveMayhem"],
  [now - 4 * D, "SierraAdmin", "Ran :ban", "Exploiter_9000"],
  [now - 5 * D, "Founder_CA", "Closed form", "Community manager application"],
];
DATA.mail = [
  { id: 1, from: "SierraAdmin", subject: "Weekend coverage push", at: now - 0.5 * D, body: "Hey team, Saturday afternoons (UTC) are badly understaffed. Bonus shift credit is on at 1.5x for 16:00–19:00 UTC. If you can cover, please do.", read: false },
  { id: 2, from: "Founder_CA", subject: "Staff meeting this Sunday", at: now - 2 * D, body: "Staff meeting Sunday at 20:00 UTC in the Staff VC. Attendance is expected for Moderators and above. Post in #loa if you can't make it.", read: false },
  { id: 3, from: "redwood_ranger", subject: "RDM ladder reminder", at: now - 6 * D, body: "Quick reminder: RDM is warning → kick → 1 day ban → 3 day ban. Mass RDM can skip straight to a kick. Log everything in the panel.", read: true },
];

/* ---------- Overview ---------- */
PAGES[""] = () => {
  const u = me(), wm = weekMinutes(), pct = Math.min(100, Math.round((wm / QUOTA_MIN) * 100));
  const shiftsWeek = shiftHistory().filter(s => s.end >= weekStart()).length;
  const tickets = 0, ok5050 = wm >= QUOTA_MIN && tickets >= 2;
  return `<div class="ov-hello"><div class="muted">${greeting()}</div><h1>${esc(u.name)}</h1>
    <div class="ov-id">${icon("discord", 15)} Signed in as ${esc(u.name)}</div>
    <div class="ov-id">${icon("roblox", 15)} ${u.roblox ? `Connected to Roblox ID ${esc(u.roblox)}` : `Roblox not linked · <a href="#profile">link it</a>`}</div></div>
  <div class="card shift-card">
    <div class="sc-lab">${shiftStart ? "On shift" : "Off shift"}</div>
    <div class="sc-time mono" data-shift-time>00:00:00</div>
    <div class="muted" style="font-size:16px">Breaks are not counted.</div>
    <div class="quota-row"><span>Weekly quota</span><b>${pct}%</b></div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="muted" style="font-size:16px;margin-top:10px">${fmtMin(wm)} of ${QUOTA_MIN}m this week${wm < QUOTA_MIN ? `, ${QUOTA_MIN - wm}m to go` : " · quota met"}</div>
    <button class="btn block shift-toggle ${shiftStart ? "end" : ""}" data-toggle-shift>${icon(shiftStart ? "stop" : "play", 16)} ${shiftStart ? "End shift" : "Start shift"}</button>
    <div class="card inner5050">
      <div style="display:flex;align-items:center;gap:8px"><b style="font-family:var(--head)">50/50 shift</b><span class="pill">${ok5050 ? "Ready" : "Locked"}</span></div>
      <div class="muted" style="font-size:16px;margin:6px 0 10px">Roleplay as normal and take calls when they come in.</div>
      <div class="check ${wm >= QUOTA_MIN ? "done" : ""}"><i></i>Hours: ${fmtMin(Math.min(wm, QUOTA_MIN))} of ${QUOTA_MIN}m</div>
      <div class="check ${tickets >= 2 ? "done" : ""}"><i></i>Tickets claimed: ${tickets} of 2</div>
      <button class="btn block" style="margin-top:12px" ${ok5050 ? "" : "disabled"} id="go5050">Go 50/50</button>
    </div>
    <div class="sc-foot"><span>${icon("clock", 15)} Resets in ${resetsIn()}</span><span>${icon("history", 15)} ${shiftsWeek} shift${shiftsWeek === 1 ? "" : "s"} this week</span></div>
  </div>
  <div class="card list-card ov-card"><div class="lc-head split-head">Recent punishments <a href="#punishments">See all</a></div>
    ${DATA.punishments.slice(0, 5).map(p => `<div class="ov-pun"><div class="split-head"><b>${esc(p.player)}</b><span class="pill">${esc(p.action)}</span></div><div>${esc(p.reason)}</div><div class="muted">${esc(p.mod)}, ${agoShort(p.at)}</div></div>`).join("")}
  </div>
  <div class="card list-card ov-card"><div class="lc-head">Quick actions</div>
    <button class="qa" id="qaCmd">${icon("term", 16)} Run command</button>
    <button class="qa" id="qaReq">${icon("users", 16)} Request staff</button>
    <button class="qa" id="qaLog">${icon("fileplus", 16)} Log punishment</button>
  </div>
  <div class="card list-card ov-card"><div class="lc-head">Activity</div>
    ${DATA.activityFeed.map(([n, v, h]) => `<div class="ov-act"><span><b>${esc(n)}</b> ${v} the server</span><span class="dim">${Math.round(h)}h ago</span></div>`).join("")}
  </div>
  <div class="ov-footer"><span>California State Roleplay · Staff Panel</span><button class="btn ghost sm" data-refresh>${icon("refresh", 14)} Refresh</button></div>`;
};
function agoShort(t) { const d = Date.now() - t; return d < H ? `${Math.max(1, Math.round(d / 60000))}m ago` : d < D ? `${Math.round(d / H)}h ago` : `${Math.round(d / D)}d ago`; }
PAGES[""].after = () => {
  $("#qaCmd").addEventListener("click", openRunCommand);
  $("#qaLog").addEventListener("click", openLogPunishment);
  $("#qaReq").addEventListener("click", () => {
    modal(`<h3>Request staff</h3><p class="muted" style="margin:0">Pings on-duty staff for backup in game. Demo only: nothing is sent.</p>
    <form id="rqF"><label class="lbl">What's happening?</label><textarea class="input" id="rqR" rows="3" required placeholder="Mass RDM at the gas station"></textarea>
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Send request</button></div></form>`);
    $("#rqF").addEventListener("submit", e => { e.preventDefault(); logActivity("Requested staff backup"); closeModal(); toast("Staff request sent (demo)"); });
  });
  $("#go5050").addEventListener("click", () => toast("50/50 mode isn't connected yet"));
};

/* ---------- My shifts ---------- */
PAGES.shifts = () => {
  const list = shiftHistory();
  const live = shiftStart ? `<tr><td>${fmtShort(shiftStart)}</td><td>-</td><td>${fmtMin(Math.floor((Date.now() - shiftStart) / 60000))}</td><td>0m</td><td>-</td><td>0m</td><td><span class="pill green">In progress</span></td></tr>` : "";
  return `${head("My shifts")}
  <p class="muted" style="font-size:19px;margin:0 0 18px">This week <b style="color:var(--text)">${fmtMin(weekMinutes())}</b> of ${QUOTA_MIN}m. Resets Sunday 21:00 UTC.</p>
  ${list.length || shiftStart ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Started</th><th>Ended</th><th>Length</th><th>Breaks</th><th>Counted</th><th>Bonus credit</th><th>Status</th></tr></thead><tbody>
  ${live}${list.map(s => `<tr><td>${fmtShort(s.start)}</td><td>${fmtShort(s.end)}</td><td>${fmtMin(s.mins)}</td><td>0m</td><td>${fmtMin(s.mins)}</td><td>0m</td><td>Ended manually</td></tr>`).join("")}
  </tbody></table></div>` : `<div class="card pad muted">No shifts yet. Start one from the top bar or the Overview.</div>`}`;
};

/* ---------- Profile ---------- */
PAGES.profile = () => {
  const u = me(), all = shiftHistory(), mins = all.reduce((a, s) => a + s.mins, 0);
  const t = k => store.get(k) !== "0";
  return `${head("My Profile")}
  <div class="card prof-top">
    <div class="prof-acc">${avatar(u.name, 56)}<div><div class="nm">${esc(u.name)}</div><div class="muted">@${esc(u.name)} · Discord</div></div></div>
    <span class="dim">${icon("arrowR", 18)}</span>
    <div class="prof-acc">${avatar("RB", 56)}<div><div class="nm">${u.roblox ? `Roblox ID ${esc(u.roblox)}` : "Roblox not linked"}</div><div class="muted">Roblox · ${u.roblox ? "Verified" : "Unverified"}</div></div></div>
    <span class="pill yellow" style="margin-left:auto;font-size:14px;padding:5px 12px">Staff</span>
  </div>
  <div class="card prof-sec">
    <h2>Roblox Account</h2>
    <div class="kv"><span>User ID</span><b>${esc(u.roblox || "-")}</b></div>
    <div class="kv"><span>Verification</span><b>${u.roblox ? "Verified" : "Not verified"}</b></div>
    <div class="kv"><span>Profile</span>${u.roblox ? `<a style="color:var(--link)" href="https://www.roblox.com/users/${encodeURIComponent(u.roblox)}/profile" target="_blank" rel="noopener">Open on Roblox</a>` : `<b>-</b>`}</div>
    <h2>Staff Details</h2>
    <div class="kv"><span>In-game rank</span><b>Staff</b></div>
    <div class="kv"><span>Panel rank</span><b>${u.rank}</b></div>
    <div class="kv"><span>Staff access</span><b>Granted</b></div>
    <div class="kv"><span>Current shift</span><b>${shiftStart ? "On shift" : "Off shift"}</b></div>
    <h2>Recorded Activity</h2>
    <div class="kv"><span>In-game playtime</span><b>-</b></div>
    <div class="kv"><span>Completed shifts</span><b>${all.length}</b></div>
    <div class="kv"><span>Qualifying shift time</span><b>${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m</b></div>
    <button class="btn" id="editProf" style="margin-top:18px">Edit demo profile</button>
  </div>
  <div class="card prof-sec">
    <h2 style="margin-top:0">Shift Notifications</h2>
    <label class="tgl"><input type="checkbox" data-pref="csrp_n_ingame" ${t("csrp_n_ingame") ? "checked" : ""}><i></i><div><b>In-game messages</b><div class="muted">A private message when your shift starts and when you end it.</div></div></label>
    <label class="tgl"><input type="checkbox" data-pref="csrp_n_dm" ${t("csrp_n_dm") ? "checked" : ""}><i></i><div><b>Discord DM after disconnecting</b><div class="muted">A shift summary when your shift ends because you left the server.</div></div></label>
  </div>`;
};
PAGES.profile.after = () => {
  document.querySelectorAll("[data-pref]").forEach(c => c.addEventListener("change", () => { store.set(c.dataset.pref, c.checked ? "1" : "0"); toast("Saved"); }));
  $("#editProf").addEventListener("click", () => {
    const u = me();
    modal(`<h3>Edit demo profile</h3><p class="muted" style="margin:0">Saved in this browser only. Real sign-in will fill these in.</p>
    <form id="profF"><label class="lbl">Discord name</label><input class="input" id="profN" value="${esc(u.name)}" required>
    <label class="lbl">Roblox user ID</label><input class="input" id="profR" value="${esc(u.roblox)}" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 1234567890">
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Save</button></div></form>`);
    $("#profF").addEventListener("submit", e => { e.preventDefault(); store.set("csrp_name", $("#profN").value.trim()); store.set("csrp_roblox", $("#profR").value.trim()); closeModal(); route(true); toast("Profile saved"); });
  });
};

/* ---------- Time off ---------- */
PAGES.timeoff = () => {
  const reqs = readJSON("csrp_loa", []);
  return `${head("Time off")}
  <div class="card pad"><h2 style="font-size:22px">Request leave</h2>
    <form id="loaF"><label class="lbl">From</label><input class="input" type="date" id="loaFrom" required>
    <label class="lbl">Until</label><input class="input" type="date" id="loaTo" required>
    <label class="lbl">Reason</label><textarea class="input" id="loaR" rows="3" required></textarea>
    <button class="btn primary" style="margin-top:16px">Request leave</button></form></div>
  <h2 class="section-title">Your requests</h2>
  ${reqs.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Staff</th><th>Dates</th><th>Reason</th><th>Status</th><th>Decision</th><th>Actions</th></tr></thead><tbody>
  ${reqs.map((r, i) => `<tr><td>${esc(r.staff)}</td><td style="white-space:nowrap">${r.from} to<br>${r.to}</td><td style="min-width:200px">${esc(r.reason)}</td><td><span class="pill ${r.status === "approved" ? "green" : r.status === "cancelled" ? "" : "yellow"}">${r.status}</span></td><td>${esc(r.decision || "-")}</td><td>${r.status === "pending" ? `<button class="btn sm" data-cancel="${i}">Cancel</button>` : ""}</td></tr>`).join("")}
  </tbody></table></div>` : `<p class="muted">You have not requested any leave.</p>`}`;
};
PAGES.timeoff.after = () => {
  $("#loaF").addEventListener("submit", e => {
    e.preventDefault();
    const from = $("#loaFrom").value, to = $("#loaTo").value;
    if (to < from) { toast("Until must be after From"); return; }
    const reqs = readJSON("csrp_loa", []);
    reqs.unshift({ staff: me().name, from, to, reason: $("#loaR").value.trim(), status: "pending", decision: "" });
    writeJSON("csrp_loa", reqs); logActivity("Submitted an LOA request"); route(true); toast("Leave requested");
  });
  document.querySelectorAll("[data-cancel]").forEach(b => b.addEventListener("click", () => {
    const reqs = readJSON("csrp_loa", []); reqs[+b.dataset.cancel].status = "cancelled"; writeJSON("csrp_loa", reqs); route(true); toast("Request cancelled");
  }));
};

/* ---------- My activity ---------- */
PAGES.activity = () => {
  const a = readJSON("csrp_activity", []);
  return `${head("My activity")}
  ${a.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>When</th><th>Action</th><th>Target</th></tr></thead><tbody>
  ${a.map(r => `<tr><td style="white-space:nowrap">${fmtShort(r.at)}</td><td>${esc(r.action)}</td><td>${esc(r.target)}</td></tr>`).join("")}</tbody></table></div>`
  : `<div class="card pad muted">Nothing yet. Shifts, punishments, commands and leave requests you make will show here.</div>`}`;
};

/* ---------- Guide ---------- */
PAGES.guide = () => `${head("Guide")}
  <p class="muted" style="margin-top:-6px">Pick the guide you need. The instructor guide is only for Staff Trainers and HR.</p>
  <div class="grid-2">
    <div class="card guide-card"><span class="t-ico">${icon("book")}</span><h3>Staff guide</h3><p>Rules, how to punish them, the panel and the in-game commands.</p><a class="go" href="#guide-staff">Open guide ${icon("arrowR", 14)}</a></div>
    <div class="card guide-card"><span class="t-ico">${icon("grad")}</span><h3>Staff instructor</h3><p>Running Moderation Training: hosting phases and checking marks.</p><a class="go" href="#guide-instructor">Open guide ${icon("arrowR", 14)}</a></div>
    <div class="card guide-card locked"><span class="t-ico">${icon("shield")}</span><h3>IA handbook</h3><p>Only the Internal Affairs team can open this one.</p><span class="pill">Locked</span></div>
  </div>`;
const guidePage = (title, secs) => `<a class="back" href="#guide">${icon("arrowL", 16)} Back to Guide</a>
  <div class="page-head"><div><h1>${title}</h1></div></div>
  ${secs.map(([h, items]) => `<div class="card pad" style="margin-bottom:14px"><h2 style="font-size:20px;margin-bottom:10px">${h}</h2><ul class="guide-list">${items.map(i => `<li>${i}</li>`).join("")}</ul></div>`).join("")}`;
PAGES["guide-staff"] = () => guidePage("Staff guide", [
  ["Common rules", ["<b>RDM</b>: killing without a roleplay reason.", "<b>VDM</b>: using a vehicle as a weapon without a reason.", "<b>NLR</b>: after death, forget what led to it and don't return to the scene.", "<b>Tool abuse</b>: using items (pepper spray, spikes, cuffs) to troll.", "<b>FRP</b>: fail roleplay, doing things your character couldn't realistically do."]],
  ["Punishment ladder", ["1st offense: Warning", "2nd offense: Kick", "3rd offense: 1 day ban", "4th offense: 3 day ban, then HR review", "Exploiting or hate speech: permanent ban straight away"]],
  ["Using the panel", ["Start a shift before you moderate. Breaks are not counted.", "Log every warning, kick and ban in <a href='#punishments'>Punishments</a> with a clear reason.", "Check a player's history in <a href='#players'>Players</a> before you punish.", "Request leave in <a href='#timeoff'>Time off</a> before you go inactive."]],
  ["In-game commands", DATA.commands.map(c => `<code>${esc(c[3])}</code>: ${c[1]}`)],
]);
PAGES["guide-instructor"] = () => guidePage("Staff instructor guide", [
  ["Phase 1", ["Trial Moderators start with <code>/requesttraining phase:1</code> in their DMs.", "10 questions, 150 seconds each, pass mark 8/10, up to 3 attempts a day."]],
  ["Marking", ["Open the session in <a href='#training'>Staff training</a> and read every answer.", "Mark answers that show the right idea, even if worded differently.", "Leave a short note on every failed answer so the trainee can learn."]],
  ["Phase 2", ["Host an in-game shadow shift of at least 30 minutes.", "The trainee handles calls; you step in only if needed.", "Pass or fail them in the training channel with a short summary."]],
]);

/* ---------- On duty ---------- */
PAGES.onduty = () => `${head("On duty")}
  ${shiftStart ? `<div class="card list-card"><div class="prow">${avatar(me().name, 40)}<div style="flex:1"><div class="nm">${esc(me().name)}</div><div class="id">${me().rank}</div></div><span class="pill green mono" data-shift-time>00:00:00</span></div></div>`
  : `<p class="muted">Nobody is on shift.</p>`}`;

/* ---------- Coverage ---------- */
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function coverageData(monthly) {
  const r = rng(monthly ? 99 : 7), days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days.map((d, di) => ({ day: d, hours: Array.from({ length: 24 }, (_, h) => {
    const weekend = di === 0 || di === 6 ? 1.35 : 1;
    const curve = Math.max(0, Math.sin(((h - 9) / 24) * Math.PI * 2)) ** 1.6;
    const p = Math.round(curve * 40 * weekend * (0.6 + r() * 0.6) * 10) / 10;
    const s = p < 1 ? 0 : Math.round(Math.min(5, p / 45 + r() * 2.2) * 10) / 10;
    return { p, s };
  }) }));
}
const covCls = (c, cfg) => (c.p === 0 ? "nd" : c.p < cfg.busy ? "norm" : c.s <= cfg.t1 ? "crit" : c.s <= cfg.t2 ? "tight" : "ok");
const bonusCfg = () => ({ busy: 25, t1: 1, m1: 1.5, t2: 2, m2: 1.25, on: "Enabled", ...readJSON("csrp_bonus", {}) });
let covMonthly = false;
PAGES.coverage = () => {
  const cfg = bonusCfg(), data = coverageData(covMonthly), cells = data.flatMap(d => d.hours.map((c, h) => ({ ...c, day: d.day, h })));
  const busy = cells.filter(c => c.p >= cfg.busy), crit = busy.filter(c => c.s <= cfg.t1), tight = busy.filter(c => c.s > cfg.t1 && c.s <= cfg.t2);
  const covered = busy.length - crit.length - tight.length;
  const avgBusyStaff = busy.length ? (busy.reduce((a, c) => a + c.s, 0) / busy.length).toFixed(1) : "0";
  const under = [...crit, ...tight].sort((a, b) => b.p - a.p).slice(0, 6);
  return `${head("Staff coverage", "7-day activity heatmap, hourly staff availability, and understaffed bonus shift credit.")}
  <div class="seg"><button class="${covMonthly ? "" : "on"}" data-cov="0">Weekly (7 days)</button><button class="${covMonthly ? "on" : ""}" data-cov="1">Monthly (30 days)</button></div>
  <div class="card notice" style="margin-top:14px"><b>Bonus shift credit (${cfg.on === "Enabled" ? "Active" : "Off"}):</b> ${cfg.busy}+ players &amp; 0–${cfg.t1} staff = <b>${cfg.m1}x</b> · ${cfg.busy}+ players &amp; ${cfg.t2} staff = <b>${cfg.m2}x</b> · Normal = <b>1x</b></div>
  <div class="kpis" style="margin-top:14px;grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
    <div class="kpi"><div class="l" style="margin:0 0 6px">Busy coverage rate</div><div class="v">${busy.length ? Math.round((covered / busy.length) * 100) : 0}%</div><div class="l" style="font-size:12.5px">${covered}h covered of ${busy.length}h with ${cfg.busy}+ players</div></div>
    <div class="kpi"><div class="l" style="margin:0 0 6px">Understaffed time</div><div class="v">${crit.length + tight.length}h</div><div class="l" style="font-size:12.5px">${crit.length}h critical (${cfg.m1}x) · ${tight.length}h tight (${cfg.m2}x)</div></div>
    <div class="kpi"><div class="l" style="margin:0 0 6px">Avg staff when busy</div><div class="v">${avgBusyStaff}</div><div class="l" style="font-size:12.5px">Across busy hours</div></div>
    <div class="kpi"><div class="l" style="margin:0 0 6px">Shift duration vs bonus</div><div class="v">6h 15m <span class="pill green" style="font-size:11px;vertical-align:middle">+9m bonus</span></div><div class="l" style="font-size:12.5px">Base shift time is tracked separately from bonus credit</div></div>
  </div>
  <div class="card pad" style="margin-top:18px"><h2 style="font-size:20px">${covMonthly ? "30-Day" : "7-Day"}, 24-Hour Activity Heatmap (UTC)</h2>
    <p class="muted" style="font-size:16px">Each cell shows <code>avg players / avg staff</code>. Select a cell to inspect it.</p>
    <div class="hm-legend"><span><i class="crit"></i>Understaffed (${cfg.m1}x)</span><span><i class="tight"></i>Tight (${cfg.m2}x)</span><span><i class="ok"></i>Busy &amp; covered (1x)</span><span><i class="norm"></i>Normal (&lt;${cfg.busy} players)</span><span><i class="nd"></i>No data</span></div>
    <div class="hm-wrap"><table class="hm"><thead><tr><th>Day</th>${Array.from({ length: 24 }, (_, h) => `<th>${String(h).padStart(2, "0")}</th>`).join("")}</tr></thead><tbody>
    ${data.map(d => `<tr><th>${d.day}</th>${d.hours.map((c, h) => `<td class="${covCls(c, cfg)}" data-cell="${d.day}|${h}|${c.p}|${c.s}">${Math.round(c.p)}/${c.s}</td>`).join("")}</tr>`).join("")}
    </tbody></table></div>
    <div class="card hm-info" id="hmInfo">Click or hover any hour cell above to inspect population and staff coverage.</div>
  </div>
  <div class="grid-2" style="margin-top:18px">
    <div class="card pad"><h2 style="font-size:18px">Highlighted Understaffed Periods</h2><p class="muted" style="font-size:14px">Busy periods (${cfg.busy}+ players) with ${cfg.t2} or fewer staff on duty.</p>
      ${under.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Window</th><th>Players</th><th>Avg staff</th><th>Credit</th></tr></thead><tbody>${under.map(c => `<tr><td>${c.day} ${String(c.h).padStart(2, "0")}:00 UTC</td><td>${c.p}</td><td>${c.s}</td><td><span class="pill ${c.s <= cfg.t1 ? "red" : "yellow"}">${c.s <= cfg.t1 ? cfg.m1 : cfg.m2}x</span></td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">No understaffed periods.</p>`}
    </div>
    <div class="card pad"><h2 style="font-size:18px">Average Staff Availability by Hour (UTC)</h2><p class="muted" style="font-size:14px">Hourly rollup comparing player population against active staff.</p>
      <div class="table-wrap" style="max-height:320px;overflow-y:auto"><table class="tbl"><thead><tr><th>Hour</th><th>Avg players</th><th>Avg staff</th><th>Busy days</th></tr></thead><tbody>
      ${Array.from({ length: 24 }, (_, h) => { const col = data.map(d => d.hours[h]); const ap = col.reduce((a, c) => a + c.p, 0) / 7, as = col.reduce((a, c) => a + c.s, 0) / 7; return `<tr><td>${String(h).padStart(2, "0")}:00</td><td>${ap.toFixed(1)}</td><td>${as.toFixed(1)}</td><td>${col.filter(c => c.p >= cfg.busy).length}</td></tr>`; }).join("")}
      </tbody></table></div>
    </div>
  </div>
  <div class="card pad" style="margin-top:18px"><h2 style="font-size:18px">Bonus Shift Credit Configuration (HR &amp; Management)</h2>
    <p style="font-size:16px;line-height:1.5">Eligible minutes require verified in-game presence, exclude breaks, and are counted once per clock minute so restarting a shift can't multiply credit.</p>
    <form id="bonusF">
      <label class="lbl">Busy player threshold</label><input class="input" type="number" id="bBusy" min="1" value="${cfg.busy}">
      <label class="lbl">Tier 1 max staff (critical)</label><input class="input" type="number" id="bT1" min="0" value="${cfg.t1}">
      <label class="lbl">Tier 1 multiplier</label><input class="input" type="number" step="0.05" id="bM1" value="${cfg.m1}">
      <label class="lbl">Tier 2 max staff (tight)</label><input class="input" type="number" id="bT2" min="0" value="${cfg.t2}">
      <label class="lbl">Tier 2 multiplier</label><input class="input" type="number" step="0.05" id="bM2" value="${cfg.m2}">
      <label class="lbl">Bonus system status</label><select class="input" id="bOn"><option ${cfg.on === "Enabled" ? "selected" : ""}>Enabled</option><option ${cfg.on !== "Enabled" ? "selected" : ""}>Disabled</option></select>
      <button class="btn primary" style="margin-top:16px">Save bonus configuration</button>
    </form>
  </div>`;
};
PAGES.coverage.after = () => {
  document.querySelectorAll("[data-cov]").forEach(b => b.addEventListener("click", () => { covMonthly = b.dataset.cov === "1"; route(true); }));
  const show = td => { const [d, h, p, s] = td.dataset.cell.split("|"); $("#hmInfo").innerHTML = `<b>${d} ${String(h).padStart(2, "0")}:00 UTC</b> · ${p} avg players · ${s} avg staff`; };
  document.querySelectorAll("[data-cell]").forEach(td => { td.addEventListener("mouseenter", () => show(td)); td.addEventListener("click", () => show(td)); });
  $("#bonusF").addEventListener("submit", e => {
    e.preventDefault();
    writeJSON("csrp_bonus", { busy: +$("#bBusy").value, t1: +$("#bT1").value, m1: +$("#bM1").value, t2: +$("#bT2").value, m2: +$("#bM2").value, on: $("#bOn").value });
    logActivity("Changed bonus shift settings"); route(true); toast("Bonus configuration saved");
  });
};

/* ---------- Website log ---------- */
PAGES.log = () => {
  const mine = readJSON("csrp_activity", []).map(a => [a.at, me().name, a.action, a.target]);
  const rows = [...mine, ...DATA.websiteLog].sort((a, b) => b[0] - a[0]);
  return `${head("Website log")}
  <p class="muted" style="margin-top:-6px">Everything staff do on the panel, newest first.</p>
  <div class="toolbar"><div class="search">${icon("search")}<input class="input" id="logQ" placeholder="Staff, action or target"></div></div>
  <div class="table-wrap"><table class="tbl"><thead><tr><th>When</th><th>Staff</th><th>Action</th><th>Target</th></tr></thead><tbody id="logBody">
  ${rows.map(r => `<tr><td style="white-space:nowrap">${fmtShort(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join("")}
  </tbody></table></div>`;
};
PAGES.log.after = () => $("#logQ").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  document.querySelectorAll("#logBody tr").forEach(tr => { tr.hidden = q && !tr.textContent.toLowerCase().includes(q); });
});

/* ---------- CSRP Mail ---------- */
PAGES.mail = () => `${head("CSRP Mail")}
  <div class="split" style="margin-top:0"><span class="muted">${DATA.mail.filter(m => !m.read).length} unread</span><button class="btn primary" id="compose">New message</button></div>
  <div class="card list-card">${DATA.mail.map(m => `<button class="mail-row ${m.read ? "" : "unread"}" data-mail="${m.id}">${avatar(m.from, 38)}<div style="flex:1;min-width:0"><div class="split-head"><b>${esc(m.from)}</b><span class="dim" style="font-size:13px">${agoShort(m.at)}</span></div><div class="subj">${esc(m.subject)}</div><div class="muted prev">${esc(m.body)}</div></div></button>`).join("")}</div>`;
PAGES.mail.after = () => {
  document.querySelectorAll("[data-mail]").forEach(b => b.addEventListener("click", () => {
    const m = DATA.mail.find(x => x.id === +b.dataset.mail); m.read = true;
    modal(`<h3>${esc(m.subject)}</h3><p class="muted" style="margin:0 0 14px">From ${esc(m.from)} · ${fmtDate(m.at)}</p><p style="line-height:1.6">${esc(m.body)}</p><div class="actions"><button class="btn" data-close>Close</button></div>`);
    route(true);
  }));
  $("#compose").addEventListener("click", () => {
    modal(`<h3>New message</h3><p class="muted" style="margin:0">Demo only: messages aren't delivered.</p>
    <form id="mailF"><label class="lbl">To</label><select class="input" id="mTo"><option>All staff</option><option>HR</option><option>Leadership</option></select>
    <label class="lbl">Subject</label><input class="input" id="mSub" required><label class="lbl">Message</label><textarea class="input" rows="4" required></textarea>
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Send</button></div></form>`);
    $("#mailF").addEventListener("submit", e => { e.preventDefault(); logActivity("Sent CSRP Mail", $("#mTo").value); closeModal(); toast("Message sent (demo)"); });
  });
};

PAGES.punishments = () => `${head("Punishments")}
  <form id="pSearch">
    <label class="lbl" for="pq">Roblox username or ID</label><input class="input" id="pq">
    <label class="lbl" for="pt">Action type</label>
    <select class="input" id="pt"><option value="">All actions</option><option>Warning</option><option>Kick</option><option>Temp ban</option><option>Ban</option></select>
    <button class="btn primary block" style="margin-top:14px">Search</button>
  </form>
  <div class="split"><a class="btn" href="#players">${icon("search", 16)} Search Players</a><button class="btn" id="logP">Log punishment</button></div>
  <div class="table-wrap"><table class="tbl"><thead><tr><th>Action</th><th>Player</th><th>Roblox ID</th><th>Reason</th><th>Duration</th><th>Moderator</th><th>Recorded</th></tr></thead><tbody id="pBody"></tbody></table></div>`;
function renderPunishRows(q = "", t = "") {
  const rows = DATA.punishments.filter(p => (!t || p.action === t) && (!q || p.player.toLowerCase().includes(q.toLowerCase()) || String(p.id).includes(q)));
  $("#pBody").innerHTML = rows.length ? rows.map(p => `<tr><td>${esc(p.action)}</td><td><a class="player-link" href="#players">${esc(p.player)}</a></td><td>${p.id}</td><td style="min-width:180px">${esc(p.reason)}</td><td>${esc(p.duration)}</td><td>${esc(p.mod)}</td><td style="white-space:nowrap">${fmtDate(p.at)}</td></tr>`).join("") : `<tr><td colspan="7" class="muted">No punishments found.</td></tr>`;
}
PAGES.punishments.after = () => {
  renderPunishRows();
  $("#pSearch").addEventListener("submit", e => { e.preventDefault(); renderPunishRows($("#pq").value.trim(), $("#pt").value); });
  $("#logP").addEventListener("click", openLogPunishment);
};
function openLogPunishment() {
  modal(`<h3>Log punishment</h3><p class="muted" style="margin:0">Demo only: this is saved in your browser until you refresh.</p>
  <form id="lpForm"><label class="lbl">Roblox username</label><input class="input" id="lpU" required>
  <label class="lbl">Action</label><select class="input" id="lpA"><option>Warning</option><option>Kick</option><option>Temp ban</option><option>Ban</option></select>
  <label class="lbl">Reason</label><textarea class="input" id="lpR" rows="3" required></textarea>
  <label class="lbl">Duration (optional)</label><input class="input" id="lpD" placeholder="e.g. 3 days">
  <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Log punishment</button></div></form>`);
  $("#lpForm").addEventListener("submit", e => {
    e.preventDefault();
    const player = $("#lpU").value.trim();
    DATA.punishments.unshift({ action: $("#lpA").value, player, id: Math.floor(1e9 + Math.random() * 9e9), reason: $("#lpR").value.trim(), duration: $("#lpD").value.trim(), mod: me().name, at: Date.now() });
    logActivity("Recorded a punishment", player);
    closeModal(); if ($("#pBody")) renderPunishRows(); else route(); toast("Punishment logged");
  });
}

PAGES.commands = () => `${head("Commands")}
  <div class="table-wrap"><table class="tbl"><thead><tr><th>Command</th><th>What it does</th><th>Rank</th><th>Usage</th></tr></thead><tbody>
  ${DATA.commands.map(c => `<tr><td>${c[0]}</td><td style="min-width:220px">${c[1]}</td><td>${c[2]}</td><td><code style="color:var(--text)">${esc(c[3])}</code></td></tr>`).join("")}
  </tbody></table></div>
  <button class="btn" id="runCmd" style="margin-top:16px">Run command</button>
  <h2 class="section-title">Your recent commands</h2><div id="recentCmds"></div>`;
function renderRecentCmds() {
  $("#recentCmds").innerHTML = DATA.recentCommands.length ? `<div class="table-wrap"><table class="tbl"><thead><tr><th>Command</th><th>Status</th><th>When</th></tr></thead><tbody>${DATA.recentCommands.map(c => `<tr><td><code>${esc(c.cmd)}</code></td><td><span class="pill yellow">Not sent (demo)</span></td><td>${fmtDate(c.at)}</td></tr>`).join("")}</tbody></table></div>` : `<p class="muted">You have not run any commands yet.</p>`;
}
PAGES.commands.after = () => {
  renderRecentCmds();
  $("#runCmd").addEventListener("click", openRunCommand);
};
function openRunCommand() {
  modal(`<h3>Run command</h3><p class="muted" style="margin:0">The server isn't connected, so commands are recorded but not sent.</p>
  <form id="cmdForm"><label class="lbl">Command</label><input class="input mono" id="cmdIn" placeholder=":m Server restart in 5 minutes" required>
  <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Run</button></div></form>`);
  $("#cmdIn").focus();
  $("#cmdForm").addEventListener("submit", e => {
    e.preventDefault(); const v = $("#cmdIn").value.trim();
    if (!v.startsWith(":")) { toast("Commands start with a colon, like :m"); return; }
    DATA.recentCommands.unshift({ cmd: v, at: Date.now() }); logActivity("Ran a command", v.split(" ")[0]);
    closeModal(); if ($("#recentCmds")) renderRecentCmds(); toast("Command recorded");
  });
}

PAGES.vision = () => `${head("CSRP Vision")}
  <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><button class="btn" disabled>Pop out Vision</button><span class="muted" style="font-size:13px">Needs Chrome or Edge on a computer.</span></div>
  <p style="font-size:17px;margin:20px 0 10px">You are not in the server, so players are not sorted by distance.</p>
  <p class="muted" style="font-size:17px;margin:0">Nobody else is in the server.</p>
  <h2 class="section-title">Kills, last 15 minutes</h2><p style="font-size:17px">No kills.</p>`;

PAGES.players = () => `${head("Players")}
  <div class="card pad"><h2 style="font-size:22px;margin-bottom:14px">Find a player</h2>
    <form id="findP" class="search" style="max-width:none">${icon("search")}<input class="input" id="findQ" placeholder="Roblox username or ID"></form>
    <div id="findRes"></div></div>
  <div class="card list-card" style="margin-top:20px"><div class="lc-head">In the server</div><div class="lc-empty">Nobody is in the server.</div></div>
  <div class="card list-card" style="margin-top:20px"><div class="lc-head">Your recent players</div>
    ${DATA.recentPlayers.map(p => `<div class="prow">${avatar(p.name, 40)}<div><div class="nm">${esc(p.name)}</div><div class="id">${p.id}</div><div class="meta">Punishment recorded · ${p.ago}</div></div></div>`).join("")}
  </div>`;
PAGES.players.after = () => {
  $("#findP").addEventListener("submit", e => {
    e.preventDefault(); const q = $("#findQ").value.trim().toLowerCase(); if (!q) return;
    const hits = DATA.punishments.filter(p => p.player.toLowerCase().includes(q) || String(p.id).includes(q));
    const byPlayer = {}; hits.forEach(h => (byPlayer[h.player] ||= []).push(h));
    $("#findRes").innerHTML = Object.keys(byPlayer).length ? Object.entries(byPlayer).map(([n, l]) => `<div class="prow" style="padding:14px 0">${avatar(n, 40)}<div><div class="nm">${esc(n)}</div><div class="id">${l[0].id}</div><div class="meta">${l.length} punishment${l.length > 1 ? "s" : ""} on record</div></div></div>`).join("") : `<p class="muted" style="margin:14px 0 0">No player found in the sample data.</p>`;
  });
};

PAGES.map = () => `${head("Map")}
  <p style="font-size:19px;margin:0" class="muted">0 of 0 players on the map.</p>
  <div class="legend">${[["Police", "#5b8def"], ["Sheriff", "#4cc38a"], ["Fire", "#f06363"], ["DOT", "#f0963a"], ["Jail", "#a37cf0"], ["Civilian", "#ffffff"]].map(([n, c]) => `<span><i style="border-color:${c}"></i>${n}</span>`).join("")}</div>
  <div style="display:flex;gap:10px;margin-bottom:16px"><button class="btn" data-z="1.25">Zoom in</button><button class="btn" data-z="0.8">Zoom out</button><button class="btn" data-z="0">Reset zoom</button></div>
  <div class="map-box">${mapSVG()}</div>
  <p class="muted" style="font-size:18px;margin-top:20px">Nothing here yet.</p>`;
PAGES.map.after = () => {
  let z = 1; const svg = $(".map-box svg");
  document.querySelectorAll("[data-z]").forEach(b => b.addEventListener("click", () => { const f = +b.dataset.z; z = f ? Math.min(4, Math.max(1, z * f)) : 1; svg.style.transform = `scale(${z})`; }));
};
function mapSVG() {
  return `<svg viewBox="0 0 400 420" xmlns="http://www.w3.org/2000/svg">
  <defs><pattern id="trees" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="#3b5233"/><circle cx="6" cy="6" r="1" fill="#2f4529"/></pattern></defs>
  <rect width="400" height="420" fill="#0e1216"/>
  <ellipse cx="200" cy="345" rx="165" ry="60" fill="#3a6170"/>
  <path d="M70 60 Q140 20 220 30 Q300 22 330 70 Q360 120 350 200 Q365 260 330 300 Q260 320 200 315 Q120 322 70 300 Q40 240 55 180 Q35 110 70 60z" fill="#3e4c39"/>
  <path d="M70 60 Q140 20 220 30 Q300 22 330 70 Q360 120 350 200 Q365 260 330 300 Q260 320 200 315 Q120 322 70 300 Q40 240 55 180 Q35 110 70 60z" fill="url(#trees)" opacity=".7"/>
  <ellipse cx="190" cy="70" rx="38" ry="20" fill="#3a6170"/>
  <path d="M110 95 q-25 20 -5 45 q20 10 25 -15z" fill="#3a6170"/>
  <ellipse cx="300" cy="190" rx="8" ry="18" fill="#3a6170"/>
  <path d="M190 88 C195 140 175 190 182 240 C185 280 178 300 182 318" stroke="#3a6170" stroke-width="7" fill="none"/>
  <g stroke="#8b9097" stroke-width="3" fill="none" opacity=".85">
    <path d="M60 140 L180 170 L250 140 L300 80"/><path d="M200 310 L205 200 L280 140 L300 40"/>
    <path d="M65 290 L340 290"/><path d="M95 120 Q110 220 100 290"/><path d="M290 60 L290 290"/>
  </g>
  <g fill="#6d7680" opacity=".75">
    <rect x="95" y="240" width="70" height="40" rx="2"/><rect x="210" y="245" width="70" height="35" rx="2"/>
    <rect x="270" y="105" width="30" height="40" rx="2"/><rect x="80" y="75" width="35" height="30" rx="2"/><rect x="215" y="155" width="30" height="25" rx="2"/>
  </g>
  <rect x="160" y="95" width="5" height="45" fill="#222"/>
  <text x="200" y="404" text-anchor="middle" fill="#6d7680" font-size="10" font-family="IBM Plex Sans">Placeholder map: replace with your game's map image</text>
  </svg>`;
}

PAGES.transcripts = () => {
  const T = DATA.tickets, max = Math.max(...T.hours);
  return `${head("Transcripts")}
  <div class="card pad"><h2 style="font-size:26px;margin-bottom:18px">Ticket stats</h2>
    <div class="kpis"><div class="kpi"><div class="v">${T.opened}</div><div class="l">Opened</div></div><div class="kpi"><div class="v">${T.closed}</div><div class="l">Closed</div></div><div class="kpi"><div class="v">${T.open}</div><div class="l">Open now</div></div><div class="kpi"><div class="v">${T.firstReply}</div><div class="l">Average first reply</div></div><div class="kpi"><div class="v">${T.toClose}</div><div class="l">Average time to close</div></div><div class="kpi"><div class="v">${T.perDay}</div><div class="l">Tickets per day (30 days)</div></div></div>
    <h3 style="font-size:20px;margin:28px 0 12px">Per staff member</h3>
    <div class="table-wrap"><table class="tbl"><thead><tr><th>Staff member</th><th>Handled</th><th>First reply</th><th>Time to close</th></tr></thead><tbody>${T.staff.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    <h3 style="font-size:20px;margin:28px 0 0">Busiest hours (opened, your time)</h3>
    <div class="bars">${T.hours.map((h, i) => `<div style="height:${(h / max) * 100}%" title="${String(i).padStart(2, "0")}:00 · ${h} tickets"></div>`).join("")}</div>
    <div class="bars-x"><span>00</span><span>06</span><span>12</span><span>18</span><span>23</span></div>
  </div>
  <div class="toolbar" style="margin-top:22px">
    <input class="input" placeholder="Name or Discord ID of the user" style="max-width:260px" id="tOpen">
    <select class="input" style="max-width:220px" id="tBy"><option value="">Handled by: Anyone</option>${T.staff.map(s => `<option>${s[0]}</option>`).join("")}</select>
    <select class="input" style="max-width:200px" id="tType"><option value="">All types</option><option>General Support</option><option>High Rank Support</option><option>Report</option><option>Appeal</option></select>
    <button class="btn" id="tClear">Clear</button>
  </div>
  <h2 class="section-title" style="font-size:30px">Open tickets</h2>
  <div class="table-wrap"><table class="tbl"><thead><tr><th>Ticket</th><th>Type</th><th>Opened by</th><th>Subject</th><th>Opened</th><th>Claimed</th></tr></thead><tbody id="tBody"></tbody></table></div>`;
};
PAGES.transcripts.after = () => {
  const draw = () => {
    const o = $("#tOpen").value.toLowerCase(), ty = $("#tType").value;
    const rows = DATA.tickets.openList.filter(r => (!o || r[2].toLowerCase().includes(o)) && (!ty || r[1] === ty));
    $("#tBody").innerHTML = rows.length ? rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${fmtDate(r[4])}</td><td>${r[5] === "Yes" ? '<span class="pill green">Yes</span>' : "No"}</td></tr>`).join("") : `<tr><td colspan="6" class="muted">No tickets match.</td></tr>`;
  };
  draw();
  ["#tOpen", "#tType", "#tBy"].forEach(s => $(s).addEventListener("input", draw));
  $("#tClear").addEventListener("click", () => { $("#tOpen").value = ""; $("#tType").value = ""; $("#tBy").value = ""; draw(); });
};

PAGES.training = () => {
  const T = DATA.training;
  const row = (r, waiting) => `<tr><td>${r[0]}</td><td>${esc(r[1])}</td><td>${waiting ? '<span class="pill yellow">Waiting for a trainer</span>' : `<span class="pill ${r[2] === "Passed" ? "green" : "red"}">${r[2]}</span>`}</td><td>${waiting ? "?" : r[3]}</td><td>${waiting ? "-" : "Trainer"}</td><td>${fmtDate(waiting ? r[2] : r[4])}</td><td><button class="btn sm" data-view="${r[0]}">View</button></td></tr>`;
  return `${head("Staff training")}
  <div class="card pad"><h2 style="font-size:26px;margin-bottom:18px">Training stats</h2>
  <div class="kpis"><div class="kpi"><div class="v">${T.sessions}</div><div class="l">Phase 1 sessions</div></div><div class="kpi"><div class="v">${T.passed}</div><div class="l">Passed</div></div><div class="kpi"><div class="v">${T.failed}</div><div class="l">Failed</div></div><div class="kpi"><div class="v">${T.rate}</div><div class="l">Pass rate</div></div><div class="kpi"><div class="v">${T.avg}</div><div class="l">Average score</div></div><div class="kpi"><div class="v">${T.last30}</div><div class="l">Sessions (30 days)</div></div></div>
  <p class="muted" style="font-size:17px;line-height:1.55;margin:16px 0 0">Pass mark 8/10. Trial Moderators start Phase 1 in their DMs with <code>/requesttraining phase:1</code>: 10 questions written for each session, 150 seconds per question, up to 3 a day.</p></div>
  <h2 class="section-title">Waiting for a trainer</h2>
  <div class="table-wrap"><table class="tbl"><thead><tr><th>Session</th><th>Trainee</th><th>Result</th><th>Score</th><th>Marked by</th><th>Submitted</th><th></th></tr></thead><tbody>${T.waiting.map(r => row(r, true)).join("")}</tbody></table></div>
  <h2 class="section-title">Training sessions</h2>
  <div class="table-wrap"><table class="tbl"><thead><tr><th>Session</th><th>Trainee</th><th>Result</th><th>Score</th><th>Marked by</th><th>Submitted</th><th></th></tr></thead><tbody>${T.list.map(r => row(r, false)).join("")}</tbody></table></div>`;
};
PAGES.training.after = () => document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => {
  modal(`<h3>Session ${b.dataset.view}</h3><p class="muted">Answers will appear here once the training bot is connected.</p><div class="actions"><button class="btn" data-close>Close</button></div>`);
}));

PAGES.leavers = () => `${head("Staff leavers")}
  <p class="muted" style="margin-top:-6px;line-height:1.5">Staff who left the Discord while holding the staff role, from the bot's Staff Member Left alerts (kept 90 days). Resolve them in Discord.</p>
  <div class="table-wrap"><table class="tbl"><thead><tr><th>Staff member</th><th>How they left</th><th>Left</th><th>Roles they had</th></tr></thead><tbody>
  ${DATA.leavers.map(l => `<tr><td>${esc(l.name)}<div class="dim" style="font-size:12px;margin-top:2px">${l.id}</div></td><td>${l.how}</td><td style="white-space:nowrap">${new Date(l.at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</td><td><div style="display:flex;flex-wrap:wrap;gap:6px">${l.roles.map(r => `<span class="pill">${esc(r)}</span>`).join("")}</div></td></tr>`).join("")}
  </tbody></table></div>`;

PAGES.ai = () => `${head("AI Suggestions", "Advisory-only recommendations across staff coverage, community moderation, and economy.")}
  <div class="card notice"><b>Advisory-only analysis:</b> Suggestions are advisory only and never execute automated actions, modify balances/quotas, or evaluate individual staff members.</div>
  <div class="kpis" style="margin-top:16px;grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">
    <div class="kpi"><div class="l" style="margin:0 0 6px">Staff coverage (7d)</div><div class="v">6%</div><div class="l" style="font-size:12.5px">30m understaffed · 12 shifts</div></div>
    <div class="kpi"><div class="l" style="margin:0 0 6px">Community &amp; modcalls (7d)</div><div class="v">0 calls</div><div class="l" style="font-size:12.5px">0 unanswered · 0 staff requests</div></div>
    <div class="kpi"><div class="l" style="margin:0 0 6px">Marketplace &amp; vehicles (7d)</div><div class="v">0 listings</div><div class="l" style="font-size:12.5px">0 vehicle sales ($0)</div></div>
    <div class="kpi"><div class="l" style="margin:0 0 6px">Economy review flags (7d)</div><div class="v">0</div><div class="l" style="font-size:12.5px">0 txs ≥$100k · 0 rapid pairs</div></div>
  </div>
  <div class="toolbar" style="align-items:flex-end">
    <div><label class="lbl" style="margin-top:0">Category</label><select class="input" id="aiCat"><option value="">All categories</option><option>Staff Management</option><option>Community Management</option><option>Economy</option></select></div>
    <div><label class="lbl" style="margin-top:0">View</label><select class="input" id="aiView"><option value="active">Active (Open &amp; Saved)</option><option value="saved">Saved</option><option value="dismissed">Dismissed</option></select></div>
    <button class="btn" id="aiGen" style="margin-left:auto;padding:13px 20px">Generate fresh suggestions</button>
  </div>
  <div id="aiList"></div>`;
PAGES.ai.after = () => {
  const draw = () => {
    const c = $("#aiCat").value, v = $("#aiView").value;
    const list = DATA.suggestions.filter(s => (!c || s.cat === c) && (v === "active" ? s.state !== "dismissed" : s.state === v));
    $("#aiList").innerHTML = list.length ? list.map(s => `<div class="card sugg"><div class="sugg-top"><div style="display:flex;gap:8px"><span class="tag">${s.cat}</span><span class="tag ${s.pri}">${s.pri === "hi" ? "High" : "Low"} priority</span></div>
      <div style="display:flex;gap:6px"><button class="btn sm green" data-act="saved" data-t="${esc(s.title)}">${s.state === "saved" ? "Saved" : "Save"}</button><button class="btn sm" data-act="dismissed" data-t="${esc(s.title)}">Dismiss</button></div></div>
      <h3>${s.title}</h3><p>${s.body}</p><div class="sugg-data"><div><h5>Supporting data</h5>${s.data}</div><div><h5>Recommended action</h5>${s.action}</div></div></div>`).join("") : `<p class="muted" style="margin-top:20px">Nothing here.</p>`;
    document.querySelectorAll("[data-act]").forEach(b => b.addEventListener("click", () => { DATA.suggestions.find(s => s.title === b.dataset.t).state = b.dataset.act; draw(); toast(b.dataset.act === "saved" ? "Saved" : "Dismissed"); }));
  };
  draw();
  $("#aiCat").addEventListener("change", draw); $("#aiView").addEventListener("change", draw);
  $("#aiGen").addEventListener("click", () => toast("AI isn't connected yet (demo)"));
};

PAGES.staff = () => {
  const S = DATA.staff;
  return `${head("Staff management")}
  <div class="kpis"><div class="kpi active click" data-f="all"><div class="v">${S.total}</div><div class="l">Staff</div></div><div class="kpi click" data-f="inactive"><div class="v">${S.inactive}</div><div class="l">Inactive 7 days</div></div><div class="kpi click" data-f="leave"><div class="v">${S.leave}</div><div class="l">On leave</div></div><div class="kpi click" data-f="disc"><div class="v">${S.disc}</div><div class="l">On warnings or strikes</div></div></div>
  <div class="toolbar"><div class="search">${icon("search")}<input class="input" id="sQ" placeholder="Staff member name or ID"></div>
    <span class="muted">Show</span><select class="input" id="sShow" style="max-width:200px"><option value="all">All staff</option><option value="inactive">Inactive 7 days</option><option value="disc">On warnings or strikes</option></select>
    <span class="muted">Sort</span><select class="input" id="sSort" style="max-width:180px"><option value="rank">Rank</option><option value="week">This week</option><option value="pun">Punishments</option></select></div>
  <div id="sGroups"></div>`;
};
PAGES.staff.after = () => {
  const mins = t => { const h = /(\d+)h/.exec(t), m = /(\d+)m/.exec(t); return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0); };
  const draw = () => {
    const q = $("#sQ").value.toLowerCase(), show = $("#sShow").value, sort = $("#sSort").value;
    $("#sGroups").innerHTML = DATA.staff.groups.map(([g, rows]) => {
      let r = rows.filter(x => (!q || x[0].toLowerCase().includes(q)) && (show === "all" || (show === "inactive" ? x[2] === "0m" : x[5] !== "Clean")));
      if (sort === "week") r = [...r].sort((a, b) => mins(b[2]) - mins(a[2]));
      if (sort === "pun") r = [...r].sort((a, b) => b[6] - a[6]);
      if (!r.length) return "";
      return `<h2 class="section-title">${g} <span class="count">${r.length}</span></h2>
      <div class="table-wrap"><table class="tbl"><thead><tr><th>Staff member</th><th>This week</th><th>All time</th><th>Last shift</th><th>Discipline</th><th>Punishments</th></tr></thead><tbody>
      ${r.map(x => `<tr><td><div class="staff-cell">${avatar(x[0])}<div><div class="nm">${esc(x[0])}</div><div class="rk">${x[1]}</div></div></div></td><td>${x[2]}</td><td>${x[3]}</td>
      <td>${/day|No/.test(x[4]) ? `<span class="pill yellow">${x[4]}</span>` : x[4]}</td>
      <td>${x[5] === "Clean" ? '<span class="muted">Clean</span>' : `<span class="pill ${/warning/.test(x[5]) ? "yellow" : "red"}">${x[5]}</span>`}</td><td>${x[6]}</td></tr>`).join("")}</tbody></table></div>`;
    }).join("") || `<p class="muted">No staff match.</p>`;
  };
  draw();
  $("#sQ").addEventListener("input", draw); $("#sShow").addEventListener("change", draw); $("#sSort").addEventListener("change", draw);
  document.querySelectorAll(".kpi[data-f]").forEach(k => k.addEventListener("click", () => {
    document.querySelectorAll(".kpi[data-f]").forEach(x => x.classList.remove("active")); k.classList.add("active");
    const f = k.dataset.f; if ([...$("#sShow").options].some(o => o.value === f)) { $("#sShow").value = f; draw(); } else toast("Leave tracking isn't connected yet");
  }));
};

PAGES.forms = () => `${head("Forms")}
  <button class="btn" id="newForm" style="margin-bottom:16px">New form</button>
  ${DATA.forms.map(f => `<div class="card form-row"><div><h3>${esc(f.title)}</h3><span class="pill ${f.open ? "green" : ""}">${f.open ? "Open" : "Closed"}</span>
    <div class="muted" style="margin-top:6px">${f.resp} · <a href="../forms.html#${f.slug}">csrp/forms/${f.slug}</a></div></div>
    <div class="actions"><button class="btn" data-copy="${f.slug}">Copy link</button><button class="btn" data-resp>Responses</button><button class="btn" data-edit>Edit</button></div></div>`).join("")}`;
PAGES.forms.after = () => {
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
    const url = new URL(`../forms.html#${b.dataset.copy}`, location.href).href;
    try { await navigator.clipboard.writeText(url); toast("Link copied"); } catch { toast(url); }
  }));
  document.querySelectorAll("[data-resp],[data-edit],#newForm").forEach(b => b.addEventListener("click", () => toast("Form builder isn't connected yet (demo)")));
};

const BOT = "Goldie";
PAGES.assistant = () => `${head("Ask " + BOT)}
  <div class="card chat"><div class="msgs" id="msgs"><div class="msg"><span class="brand-mark" style="width:36px;height:36px;font-size:12px;flex:none">CS</span><div class="bubble">hey, i'm ${BOT.toLowerCase()}. ask me about the rules, punishments, who to go to, or just chat.</div></div></div>
  <div class="suggests">${["What is the punishment for RDM?", "Who is in charge of HR?", "How many players are in the server?", "What does NLR mean?"].map(s => `<button class="suggest">${s}</button>`).join("")}</div>
  <form class="chat-input" id="chatF"><input class="input" id="chatIn" placeholder="Ask ${BOT} anything..." autocomplete="off"><button class="send" aria-label="Send">${icon("arrowR")}</button></form>
  <p class="muted" style="line-height:1.5;margin:16px 0 0">${BOT} is a demo right now and only knows a few canned answers. Once connected, it can answer from the rulebook and use staff tools. It can be wrong, so check anything important.</p></div>`;
PAGES.assistant.after = () => {
  const answers = [
    [/rdm/i, "RDM (random deathmatch) is usually a warning first, then a kick, then a temp ban for repeat offenses. Mass RDM can go straight to a kick or ban."],
    [/nlr/i, "NLR is the New Life Rule: after you die, you forget everything that led to your death and can't return to that scene for a while."],
    [/hr|human resources/i, "HR is run by the Leadership team. Open a High Rank Support ticket and they'll pick it up."],
    [/players|server/i, `Right now there are ${DATA.server.players} of ${DATA.server.max} players in the server.`],
    [/vdm/i, "VDM is vehicle deathmatch: running people over without a roleplay reason. Same ladder as RDM."],
  ];
  const add = (t, me) => { const m = document.createElement("div"); m.className = "msg" + (me ? " me" : ""); m.innerHTML = (me ? avatar("You") : `<span class="brand-mark" style="width:36px;height:36px;font-size:12px;flex:none">CS</span>`) + `<div class="bubble">${esc(t)}</div>`; $("#msgs").appendChild(m); $("#msgs").scrollTop = 1e9; };
  const ask = q => { if (!q) return; add(q, true); setTimeout(() => add((answers.find(([r]) => r.test(q)) || [0, "I'm not connected to the rulebook yet, so I can't answer that one. Try asking about RDM, VDM or NLR."])[1]), 450); };
  $("#chatF").addEventListener("submit", e => { e.preventDefault(); ask($("#chatIn").value.trim()); $("#chatIn").value = ""; });
  document.querySelectorAll(".suggest").forEach(b => b.addEventListener("click", () => ask(b.textContent)));
};

PAGES.departments = () => `${head("Departments")}
  ${DATA.departments.map(([d, m]) => `<div class="card" style="margin-bottom:20px;padding:4px 0 0"><h2 style="font-size:20px;padding:16px 20px 12px">${d} <span class="muted" style="font-size:15px;font-weight:500">${m.length} members</span></h2>
  <div style="overflow-x:auto"><table class="tbl"><thead><tr><th>Member</th><th>Rank</th><th>Roblox</th><th>Main server</th></tr></thead><tbody>
  ${m.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="${r[3] ? "" : "muted"}">${esc(r[2])}</td><td>${r[3] ? "Yes" : '<span class="pill yellow">Not in main server</span>'}</td></tr>`).join("")}
  </tbody></table></div></div>`).join("")}
  <p class="dim" style="font-size:13px">Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. Changes in a department server show here within 5 minutes.</p>`;

PAGES.leaderboard = () => `${head("Leaderboard")}
  <div style="display:flex;align-items:center;gap:14px"><span class="muted">Ranking period</span><select class="input" id="lbP" style="width:auto"><option value="week">This week</option><option value="month">This month</option><option value="all">All time</option></select></div>
  <p class="dim" id="lbSince" style="margin:18px 0"></p>
  <div class="table-wrap"><table class="tbl"><thead><tr><th style="width:90px">#</th><th>Staff</th><th>Time</th></tr></thead><tbody id="lbBody"></tbody></table></div>`;
PAGES.leaderboard.after = () => {
  const draw = () => {
    const p = $("#lbP").value;
    $("#lbSince").textContent = p === "all" ? "All recorded shifts" : `Since ${new Date(now - (p === "week" ? 5 : 27) * D).toLocaleDateString([], { month: "short", day: "numeric" })}`;
    $("#lbBody").innerHTML = DATA.leaderboard[p].map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r[0])}</td><td>${r[1]}</td></tr>`).join("");
  };
  draw(); $("#lbP").addEventListener("change", draw);
};

/* ---------------- Shell ---------------- */
function buildNav(cur) {
  const active = cur.startsWith("guide") ? "guide" : cur;
  $("#drawerNav").innerHTML = NAV.map(([g, items]) => `<div class="grp">${g}</div>${items.map(([k, t, ic]) => `<a class="item ${k === active ? "active" : ""}" href="#${k || "overview"}">${icon(ic)}${t}</a>`).join("")}`).join("")
    + `<div class="grp">Verified Staff</div><a class="item" href="#" data-signout>${icon("logout")}Sign out</a>`;
  $("[data-signout]").addEventListener("click", e => { e.preventDefault(); signOut(); });
}
function route(keepScroll) {
  const key = location.hash.replace(/^#\/?/, "");
  const page = PAGES[key] ? key : "";
  $("#crumb").textContent = page ? TITLES[page] : "Overview";
  document.title = (page ? TITLES[page] + " · " : "") + "CSRP Staff Panel";
  const y = window.scrollY;
  $("#view").innerHTML = PAGES[page]();
  PAGES[page].after && PAGES[page].after();
  buildNav(page);
  if (!keepScroll) setDrawer(false);
  document.querySelectorAll("[data-refresh]").forEach(b => b.addEventListener("click", () => { route(true); toast("Refreshed"); }));
  document.querySelectorAll("[data-toggle-shift]").forEach(b => b.addEventListener("click", toggleShift));
  tick();
  window.scrollTo(0, keepScroll ? y : 0);
}
function setDrawer(open) { $("#drawer").classList.toggle("open", open); $("#backdrop").classList.toggle("open", open); }
$("#menuBtn").addEventListener("click", () => setDrawer(true));
$("#drawerClose").addEventListener("click", () => setDrawer(false));
$("#backdrop").addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") { setDrawer(false); closeModal(); $("#profileMenu").hidden = true; } });

/* Status chips */
function updateChips() {
  $("#inGame").textContent = `${DATA.server.players} of ${DATA.server.max} in-game`;
  $("#inQueue").textContent = `${DATA.server.queue} in queue`;
  $("#onDuty").textContent = `${DATA.server.onDuty + (shiftStart ? 1 : 0)} on duty`;
}

/* Shift timer (kept in the browser only) */
let shiftStart = +store.get("csrp_shift") || 0, shiftTimer;
function tick() {
  const s = shiftStart ? Math.floor((Date.now() - shiftStart) / 1000) : 0;
  const txt = [s / 3600, (s % 3600) / 60, s % 60].map(n => String(Math.floor(n)).padStart(2, "0")).join(":");
  document.querySelectorAll("[data-shift-time]").forEach(el => { el.textContent = txt; });
  $("#shiftLabel").textContent = shiftStart ? "On shift" : "Off shift";
  $("#shiftBtn").classList.toggle("on", !!shiftStart);
}
function startTicker() { clearInterval(shiftTimer); tick(); updateChips(); if (shiftStart) shiftTimer = setInterval(tick, 1000); }
function toggleShift() {
  if (shiftStart) {
    const end = Date.now(), mins = Math.floor((end - shiftStart) / 60000);
    const h = shiftHistory(); h.unshift({ start: shiftStart, end, mins }); writeJSON("csrp_shifts", h.slice(0, 100));
    logActivity("Ended a shift"); shiftStart = 0; store.del("csrp_shift");
    toast(`Shift ended · ${fmtMin(mins)} counted`);
  } else {
    shiftStart = Date.now(); store.set("csrp_shift", shiftStart); logActivity("Started a shift"); toast("Shift started");
  }
  startTicker(); route(true);
}
$("#shiftBtn").addEventListener("click", toggleShift);

/* Profile menu */
$("#profileBtn").addEventListener("click", e => { e.stopPropagation(); $("#profileMenu").hidden = !$("#profileMenu").hidden; });
document.addEventListener("click", e => { if (!e.target.closest("#profileMenu")) $("#profileMenu").hidden = true; });
$("#profileMenu").addEventListener("click", e => { if (e.target.closest("a")) $("#profileMenu").hidden = true; if (e.target.closest("[data-signout]")) { e.preventDefault(); signOut(); } });

/* Demo login */
function enter() { $("#login").hidden = true; $("#app").hidden = false; startTicker(); route(); }
function signOut() { store.del("csrp_demo_login"); location.hash = "overview"; $("#app").hidden = true; $("#login").hidden = false; setDrawer(false); }
$("#loginBtn").addEventListener("click", () => { store.set("csrp_demo_login", "1"); enter(); });
window.addEventListener("hashchange", () => { if (!$("#app").hidden) route(); });
if (store.get("csrp_demo_login")) enter(); else $("#login").hidden = false;

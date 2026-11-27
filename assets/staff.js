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
  ["Main", [["", "Overview", "home", "Your dashboard"], ["assistant", "Ask Goldie", "chat", "AI helper for rules and staff tools"], ["leaderboard", "Leaderboard", "trophy", "Shift time rankings"]]],
  ["Moderation", [["punishments", "Punishments", "gavel", "Search and log punishments"], ["commands", "Commands", "term", "Run in-game commands"], ["players", "Players", "users", "Find a player"], ["vision", "CSRP Vision", "eye", "Nearby players and kills"], ["map", "Map", "map", "Live player map"]]],
  ["Support", [["transcripts", "Transcripts", "ticket", "Ticket stats and history"], ["forms", "Forms", "form", "Applications and appeals"]]],
  ["Management", [["staff", "Staff management", "shield", "Activity and discipline"], ["training", "Staff training", "grad", "Trainee sessions"], ["leavers", "Staff leavers", "door", "Staff who left the Discord"], ["departments", "Departments", "building", "Department rosters"], ["ai", "AI Suggestions", "spark", "Advisory recommendations"]]],
];
const TITLES = Object.fromEntries(NAV.flatMap(g => g[1]).map(([k, t]) => [k, t]));

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
const head = (title, sub = "") => `<a class="back" href="#/">${icon("arrowL", 16)} Back to Overview</a>
<div class="page-head"><div><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ""}</div><button class="btn" data-refresh>Refresh</button></div>`;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200); }
function modal(html) { $("#modal").innerHTML = html; $("#modalBg").classList.add("open"); }
function closeModal() { $("#modalBg").classList.remove("open"); }
$("#modalBg").addEventListener("click", e => { if (e.target.id === "modalBg" || e.target.closest("[data-close]")) closeModal(); });

/* ---------------- Pages ---------------- */
const PAGES = {};

PAGES[""] = () => {
  const name = store.get("csrp_name") || "there";
  return `<div class="page-head" style="margin-top:4px"><div><h1>Welcome back, ${esc(name)}</h1><div class="sub">Here's everything in the California State Roleplay staff panel.</div></div></div>
  <div class="kpis" style="margin-bottom:24px">
    <div class="kpi"><div class="v">${DATA.server.players}/${DATA.server.max}</div><div class="l">Players in game</div></div>
    <div class="kpi"><div class="v">${DATA.tickets.open}</div><div class="l">Open tickets</div></div>
    <div class="kpi"><div class="v">${DATA.training.waiting.length}</div><div class="l">Trainings waiting</div></div>
    <div class="kpi"><div class="v">${DATA.punishments.length}</div><div class="l">Punishments this week</div></div>
  </div>
  ${NAV.map(([g, items]) => `<div class="section-title" style="font-size:18px;margin-top:22px">${g}</div>
    <div class="tiles">${items.filter(i => i[0]).map(([k, t, ic, d]) => `<a class="card tile" href="#/${k}"><span class="t-ico">${icon(ic)}</span><b>${t}</b><span>${d}</span></a>`).join("")}</div>`).join("")}`;
};

PAGES.punishments = () => `${head("Punishments")}
  <form id="pSearch">
    <label class="lbl" for="pq">Roblox username or ID</label><input class="input" id="pq">
    <label class="lbl" for="pt">Action type</label>
    <select class="input" id="pt"><option value="">All actions</option><option>Warning</option><option>Kick</option><option>Temp ban</option><option>Ban</option></select>
    <button class="btn primary block" style="margin-top:14px">Search</button>
  </form>
  <div class="split"><a class="btn" href="#/players">${icon("search", 16)} Search Players</a><button class="btn" id="logP">Log punishment</button></div>
  <div class="table-wrap"><table class="tbl"><thead><tr><th>Action</th><th>Player</th><th>Roblox ID</th><th>Reason</th><th>Duration</th><th>Moderator</th><th>Recorded</th></tr></thead><tbody id="pBody"></tbody></table></div>`;
function renderPunishRows(q = "", t = "") {
  const rows = DATA.punishments.filter(p => (!t || p.action === t) && (!q || p.player.toLowerCase().includes(q.toLowerCase()) || String(p.id).includes(q)));
  $("#pBody").innerHTML = rows.length ? rows.map(p => `<tr><td>${esc(p.action)}</td><td><a class="player-link" href="#/players">${esc(p.player)}</a></td><td>${p.id}</td><td style="min-width:180px">${esc(p.reason)}</td><td>${esc(p.duration)}</td><td>${esc(p.mod)}</td><td style="white-space:nowrap">${fmtDate(p.at)}</td></tr>`).join("") : `<tr><td colspan="7" class="muted">No punishments found.</td></tr>`;
}
PAGES.punishments.after = () => {
  renderPunishRows();
  $("#pSearch").addEventListener("submit", e => { e.preventDefault(); renderPunishRows($("#pq").value.trim(), $("#pt").value); });
  $("#logP").addEventListener("click", () => {
    modal(`<h3>Log punishment</h3><p class="muted" style="margin:0">Demo only: this is saved in your browser until you refresh.</p>
    <form id="lpForm"><label class="lbl">Roblox username</label><input class="input" id="lpU" required>
    <label class="lbl">Action</label><select class="input" id="lpA"><option>Warning</option><option>Kick</option><option>Temp ban</option><option>Ban</option></select>
    <label class="lbl">Reason</label><textarea class="input" id="lpR" rows="3" required></textarea>
    <label class="lbl">Duration (optional)</label><input class="input" id="lpD" placeholder="e.g. 3 days">
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Log punishment</button></div></form>`);
    $("#lpForm").addEventListener("submit", e => {
      e.preventDefault();
      DATA.punishments.unshift({ action: $("#lpA").value, player: $("#lpU").value.trim(), id: Math.floor(1e9 + Math.random() * 9e9), reason: $("#lpR").value.trim(), duration: $("#lpD").value.trim(), mod: store.get("csrp_name") || "You", at: Date.now() });
      closeModal(); renderPunishRows(); toast("Punishment logged");
    });
  });
};

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
  $("#runCmd").addEventListener("click", () => {
    modal(`<h3>Run command</h3><p class="muted" style="margin:0">The server isn't connected, so commands are recorded but not sent.</p>
    <form id="cmdForm"><label class="lbl">Command</label><input class="input mono" id="cmdIn" placeholder=":m Server restart in 5 minutes" required>
    <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Run</button></div></form>`);
    $("#cmdIn").focus();
    $("#cmdForm").addEventListener("submit", e => {
      e.preventDefault(); const v = $("#cmdIn").value.trim();
      if (!v.startsWith(":")) { toast("Commands start with a colon, like :m"); return; }
      DATA.recentCommands.unshift({ cmd: v, at: Date.now() }); closeModal(); renderRecentCmds(); toast("Command recorded");
    });
  });
};

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
    <div class="muted" style="margin-top:6px">${f.resp} · <a href="../forms.html?f=${f.slug}">csrp/forms/${f.slug}</a></div></div>
    <div class="actions"><button class="btn" data-copy="${f.slug}">Copy link</button><button class="btn" data-resp>Responses</button><button class="btn" data-edit>Edit</button></div></div>`).join("")}`;
PAGES.forms.after = () => {
  document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", async () => {
    const url = new URL(`../forms.html?f=${b.dataset.copy}`, location.href).href;
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
  $("#drawerNav").innerHTML = NAV.map(([g, items]) => `<div class="grp">${g}</div>${items.map(([k, t, ic]) => `<a class="item ${k === cur ? "active" : ""}" href="#/${k}">${icon(ic)}${t}</a>`).join("")}`).join("");
}
function route() {
  const key = location.hash.replace(/^#\/?/, "");
  const page = PAGES[key] ? key : "";
  $("#crumb").textContent = page ? TITLES[page] : "Overview";
  document.title = (page ? TITLES[page] + " · " : "") + "CSRP Staff Panel";
  $("#view").innerHTML = PAGES[page]();
  PAGES[page].after && PAGES[page].after();
  buildNav(page);
  setDrawer(false);
  $("[data-refresh]")?.addEventListener("click", () => { route(); toast("Refreshed"); });
  window.scrollTo(0, 0);
}
function setDrawer(open) { $("#drawer").classList.toggle("open", open); $("#backdrop").classList.toggle("open", open); }
$("#menuBtn").addEventListener("click", () => setDrawer(true));
$("#backdrop").addEventListener("click", () => setDrawer(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") { setDrawer(false); closeModal(); } });

/* Status chips */
$("#inGame").textContent = `${DATA.server.players} of ${DATA.server.max} in-game`;
$("#inQueue").textContent = `${DATA.server.queue} in queue`;
$("#onDuty").textContent = `${DATA.server.onDuty} on duty`;

/* Shift timer (kept in the browser only) */
let shiftStart = +store.get("csrp_shift") || 0, shiftTimer;
function tick() {
  const s = shiftStart ? Math.floor((Date.now() - shiftStart) / 1000) : 0;
  $("#shiftTime").textContent = [s / 3600, (s % 3600) / 60, s % 60].map(n => String(Math.floor(n)).padStart(2, "0")).join(":");
  $("#shiftLabel").textContent = shiftStart ? "On shift" : "Off shift";
  $("#shiftBtn").classList.toggle("on", !!shiftStart);
}
function startTicker() { clearInterval(shiftTimer); tick(); if (shiftStart) shiftTimer = setInterval(tick, 1000); }
$("#shiftBtn").addEventListener("click", () => {
  if (shiftStart) { shiftStart = 0; store.del("csrp_shift"); toast("Shift ended"); }
  else { shiftStart = Date.now(); store.set("csrp_shift", shiftStart); toast("Shift started"); }
  startTicker();
});
$("#profileBtn").addEventListener("click", () => {
  modal(`<h3>Your profile</h3><p class="muted" style="margin:0">Demo only. Your name is saved in this browser.</p>
  <form id="profF"><label class="lbl">Display name</label><input class="input" id="profN" value="${esc(store.get("csrp_name") || "")}" placeholder="Your staff name">
  <div class="actions"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary">Save</button></div></form>`);
  $("#profF").addEventListener("submit", e => { e.preventDefault(); store.set("csrp_name", $("#profN").value.trim()); closeModal(); route(); toast("Profile saved"); });
});

/* Demo login */
function enter() { $("#login").hidden = true; $("#app").hidden = false; startTicker(); route(); }
$("#loginBtn").addEventListener("click", () => { store.set("csrp_demo_login", "1"); enter(); });
$("#logoutBtn").addEventListener("click", () => { store.del("csrp_demo_login"); location.hash = ""; $("#app").hidden = true; $("#login").hidden = false; setDrawer(false); });
window.addEventListener("hashchange", () => { if (!$("#app").hidden) route(); });
if (store.get("csrp_demo_login")) enter(); else $("#login").hidden = false;

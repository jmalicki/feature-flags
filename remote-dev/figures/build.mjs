// Generates the figures for "Moving development off the laptop" as standalone SVGs.
// Usage: node remote-dev/figures/build.mjs          (writes remote-dev/figures/*.svg)
//        node remote-dev/figures/build.mjs --check  (fails if a committed SVG is stale)
// The drawing helpers mirror ../../figures/build.mjs so both sets of figures look alike.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const W = 1000;
const C = {
  surface: "#fcfcfb",
  panel: "#f3f2ee",
  line: "#d9d8d2",
  ink: "#0b0b0b",
  ink2: "#52514e",
  muted: "#8a8983",
  blue: "#2a78d6", // the recommended path
  blueTint: "#e6f0fb",
  orange: "#eb6834", // what is closed off, and hazards
  orangeTint: "#fdece5",
};

const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const box = (x, y, w, h, { fill = C.panel, stroke = "none", r = 8, sw = 1.5, dash = "" } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const t = (x, y, s, { size = 18, fill = C.ink, weight = 400, anchor = "start" } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`;
const wrap = (s, width, size) => {
  const max = Math.max(8, Math.floor(width / (size * 0.53)));
  const out = [];
  let cur = "";
  for (const word of String(s).split(" ")) {
    if ((cur + " " + word).trim().length > max && cur) {
      out.push(cur);
      cur = word;
    } else cur = (cur + " " + word).trim();
  }
  if (cur) out.push(cur);
  return out;
};
const para = (x, y, s, width, { size = 16, fill = C.ink2, weight = 400, anchor = "start", gap = 1.3 } = {}) =>
  wrap(s, width, size).map((l, i) => t(x, y + i * size * gap, l, { size, fill, weight, anchor })).join("\n");
const paraHeight = (s, width, size = 16, gap = 1.3) => wrap(s, width, size).length * size * gap;
const ln = (x1, y1, x2, y2, { stroke = C.muted, sw = 2, dash = "" } = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const arrow = (x1, y1, x2, y2, { stroke = C.muted, sw = 2, dash = "" } = {}) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 8;
  const p = (da) => `${(x2 - h * Math.cos(a + da)).toFixed(1)} ${(y2 - h * Math.sin(a + da)).toFixed(1)}`;
  return `${ln(x1, y1, x2, y2, { stroke, sw, dash })}<path d="M ${p(0.45)} L ${x2} ${y2} L ${p(-0.45)}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
};
const dot = (x, y, r = 6, fill = C.blue) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${C.surface}" stroke-width="2"/>`;

const frame = (id, h, title, desc, heading, sub, body, note) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">${esc(title)}</title>
  <desc id="${id}-desc">${esc(desc)}</desc>
  <g font-family="-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif">
    ${box(0, 0, W, h, { fill: C.surface, r: 0 })}
    ${t(32, 46, heading, { size: 26, weight: 700 })}
    ${t(32, 76, sub, { size: 17, fill: C.ink2 })}
    ${body}
    ${note ? t(32, h - 22, note, { size: 14, fill: C.muted }) : ""}
  </g>
</svg>
`;

// A titled box with a bulleted list of short lines.
const card = (x, y, w, h, title, lines, { fill = C.surface, stroke = C.line, dash = "", titleFill = C.ink } = {}) => {
  let yy = y + 30;
  const out = [box(x, y, w, h, { fill, stroke, dash }), para(x + 14, yy, title, w - 28, { size: 17, fill: titleFill, weight: 700 })];
  yy += paraHeight(title, w - 28, 17) + 4;
  for (const l of lines) {
    out.push(para(x + 14, yy, l, w - 28, { size: 14 }));
    yy += paraHeight(l, w - 28, 14) + 5;
  }
  return out.join("\n");
};

function laptopAndServer() {
  const top = 112;
  const rowH = 214;
  const exits = [
    ["Package proxy", "Fetches packages and public source itself"],
    ["Hosted search and fetch tool", "Public pages for agents; queries logged"],
    ["Gateway", "Wiki, tracker, chat, code search; holds the credentials"],
    ["Broker", "Read-only, sanitized replica; a login each; grants expire"],
    ["Model endpoint", "Through a proxy that holds the key"],
    ["Editor downloads", "Server component and approved extensions"],
    ["Own code host", "Pushes only to the organization's own host"],
    ["Build and deployment pipeline", "The only route to production"],
  ];
  const ew = 225;
  const eh = 118;
  const eg = 12;
  const exTop = top + rowH + 92;
  const exitBoxes = exits
    .map(([a, b], i) => {
      const x = 32 + (i % 4) * (ew + eg);
      const y = exTop + Math.floor(i / 4) * (eh + eg);
      return card(x, y, ew, eh, a, [b], { fill: C.blueTint, stroke: C.blue });
    })
    .join("\n");
  const exBottom = exTop + 2 * eh + eg;
  const botY = exBottom + 64;
  const pipeX = 32 + 3 * (ew + eg) + ew / 2;
  return frame(
    "laptop-server",
    botY + 120,
    "The laptop, the development server and its exits",
    "The laptop holds an editor window, a browser and an ssh client, with no checkout and no long-lived credentials. It connects through single sign-on with a hardware key, a short-lived ssh certificate and one logged bastion to the development server, and the ssh session and the editor's connection run in both directions. The server holds the only checkout, the toolchain, running services and attended agents, and the engineer has root. The server has eight exits: a package proxy, a hosted search and fetch tool, a gateway, a broker, the model endpoint, the editor's downloads, the organization's own code host, and the build and deployment pipeline. Production is reached only by a reviewed change through the pipeline. The open internet is not reachable from the server. Logs are kept off the server.",
    "The laptop, the development server and its exits",
    "The engineer has root on the server; the boundary around it does the restricting.",
    [
      card(32, top, 250, rowH, "Laptop", ["Editor window", "Browser, open to the web", "ssh client", "No checkout", "No long-lived credentials"]),
      card(316, top, 236, rowH, "Getting in", ["Single sign-on", "Hardware key, touched", "Short-lived ssh certificate", "One logged bastion"], { fill: C.panel, stroke: C.ink2 }),
      arrow(286, top + 90, 312, top + 90, { stroke: C.ink2 }),
      arrow(312, top + 124, 286, top + 124, { stroke: C.ink2 }),
      arrow(556, top + 90, 582, top + 90, { stroke: C.ink2 }),
      arrow(582, top + 124, 556, top + 124, { stroke: C.ink2 }),
      card(586, top, 382, rowH, "Development server", ["The only checkout, and the toolchain", "Builds, tests, running services", "Attended agents", "Engineer has root", "Disk on a volume that outlives the machine", "Outbound traffic denied by default, enforced outside the machine"], { fill: C.blueTint, stroke: C.blue }),
      t(32, top + rowH + 26, "The ssh session and the editor's connection carry data in both directions.", { size: 14, fill: C.ink2 }),
      t(32, exTop - 14, "THE SERVER'S EIGHT EXITS, EACH THROUGH A SERVICE THE ENGINEER DOES NOT ADMINISTER", { size: 13, fill: C.ink2, weight: 700 }),
      exitBoxes,
      arrow(pipeX, exBottom + 4, pipeX, botY - 34, { stroke: C.orange }),
      t(32, botY - 14, "KEPT OFF THE SERVER", { size: 13, fill: C.ink2, weight: 700 }),
      card(32, botY, 304, 96, "Logs", ["From the bastion, the proxy, the gateway and the broker"], { fill: C.panel, stroke: C.ink2 }),
      t(348, botY - 14, "NOT REACHABLE", { size: 13, fill: C.ink2, weight: 700 }),
      card(348, botY, 304, 96, "The open internet", ["Arbitrary destinations, in either direction"], { fill: C.orangeTint, stroke: C.orange, dash: "5 4" }),
      t(664, botY - 14, "REACHED ONLY THROUGH THE PIPELINE", { size: 13, fill: C.ink2, weight: 700 }),
      card(664, botY, 304, 96, "Production", ["By a reviewed change; no production credentials on the server"], { fill: C.orangeTint, stroke: C.orange, dash: "5 4" }),
    ].join("\n"),
    "",
  );
}

function timeline() {
  const rows = [
    ["2008", "Google builds with remote caching and remote execution", 0],
    ["about 2013", "Google's web editor, Cider, begins", 0],
    ["2016", "Most Google developers work through a cloud-backed checkout; its virtual desktops begin moving to Google Cloud", 0],
    ["2017", "Cloudtop is available to Google employees (press report)", 0],
    ["May 2019", "Microsoft announces remote development over ssh for VS Code", 1],
    ["Nov 2019", "Facebook makes VS Code its default editor, on reserved development servers", 0],
    ["2020", "Slack edits on the laptop and syncs to a server", 2],
    ["Aug 2021", "GitHub moves development of github.com to Codespaces", 0],
    ["Oct 2021 to Jan 2022", "Slack's remote development: general availability, then over 90% of its engineers", 0],
    ["2022", "Stripe still syncs from the laptop; remote editing is in early beta", 2],
    ["2022", "Uber reports over 60% adoption; Meta describes on-demand development servers", 0],
    ["2023", "Google plans to make Cloudtop the default desktop (press report); a majority of Meta developers use on-demand containers", 0],
    ["Feb 2024", "Discord completes the move of its backend development", 0],
    ["Aug 2024", "A Stripe engineer writes that code is off laptops in many cases", 0],
    ["2026", "Stripe: most human-written code is produced over ssh on a devbox, and its coding agents run on devboxes", 1],
  ];
  const x = 236;
  let y = 126;
  const out = [];
  const ys = [];
  for (const [when, what, kind] of rows) {
    const h = Math.max(paraHeight(what, 700, 16), 20);
    ys.push(y);
    out.push(t(x - 22, y + 5, when, { size: 15, fill: C.ink, weight: 700, anchor: "end" }));
    out.push(dot(x, y, 7, kind === 2 ? C.orange : kind === 1 ? C.blue : C.ink2));
    out.push(para(x + 22, y + 5, what, 700, { size: 16, fill: C.ink }));
    y += h + 20;
  }
  const lineEl = ln(x, ys[0], x, ys[ys.length - 1], { stroke: C.line, sw: 3 });
  const ly = y + 6;
  return frame(
    "timeline",
    ly + 56,
    "From Google's remote builds to agents on development servers",
    "A timeline of 15 dated events from 2008 to 2026 in the move of development from laptops to remote machines, at Google, Meta, Microsoft, Stripe, Slack, GitHub, Uber and Discord, from company publications, press reports and one former engineer's history.",
    "From remote builds to agents on development servers",
    "Dated events from company publications, press reports and one former engineer's history.",
    [
      lineEl,
      out.join("\n"),
      dot(40, ly, 7, C.blue),
      t(56, ly + 5, "Turning points", { size: 14, fill: C.ink2 }),
      dot(196, ly, 7, C.orange),
      t(212, ly + 5, "Code synced from the laptop, a design Slack and Stripe later gave up", { size: 14, fill: C.ink2 }),
    ].join("\n"),
    "",
  );
}

function accessLevels() {
  const steps = [
    ["1", "Sign-on with a hardware key", "Single sign-on and a key that must be touched", "Phished passwords and approved phone prompts", "Google; New York's financial regulator"],
    ["2", "Short-lived ssh certificates", "Issued after sign-on, short-lived", "Long-lived keys on laptops", "Meta (production, 2016); Netflix"],
    ["3", "One logged bastion", "The only way in to every server", "Unlogged connections and side entrances", "Meta (production, 2016); US guidance"],
    ["4", "Device certificate", "The laptop proves it is a managed one", "Sign-in from an unknown machine", "Google"],
    ["5", "Full BeyondCorp", "Inventory, computed trust tiers, every request authorized", "Trust based on network location; unpatched devices", "Google alone"],
  ];
  const w = 178;
  const gap = 12;
  const base = 620;
  const body = steps
    .map(([n, name, adds, stops, who], i) => {
      const x = 32 + i * (w + gap);
      const h = 392 + i * 22;
      const y = base - h;
      const rec = i < 3;
      const out = [box(x, y, w, h, { fill: rec ? C.blueTint : C.panel, stroke: rec ? C.blue : C.ink2, dash: i === 4 ? "5 4" : "" }), t(x + 14, y + 30, `Level ${n}`, { size: 13, fill: C.muted, weight: 700 })];
      let yy = y + 54;
      out.push(para(x + 14, yy, name, w - 28, { size: 17, fill: C.ink, weight: 700 }));
      yy += paraHeight(name, w - 28, 17) + 14;
      for (const [label, text] of [["ADDS", adds], ["ANSWERS", stops], ["PUBLISHED BY", who]]) {
        out.push(t(x + 14, yy, label, { size: 12, fill: C.muted, weight: 700 }));
        out.push(para(x + 14, yy + 20, text, w - 28, { size: 14 }));
        yy += 20 + paraHeight(text, w - 28, 14) + 14;
      }
      return out.join("\n");
    })
    .join("\n");
  const x3 = 32 + 3 * (w + gap);
  const x4 = 32 + 4 * (w + gap);
  return frame(
    "access",
    730,
    "Five levels of access control",
    "Five levels of access control, each adding to the one before. Level 1: single sign-on with a hardware security key that must be touched. Level 2: short-lived ssh certificates issued after sign-on. Level 3: one logged bastion as the only way in. Level 4: a device certificate checked along with the user. Level 5: full BeyondCorp, with a device inventory, computed trust tiers and authorization on every request. Levels 1 to 3 are the recommended start, level 4 is added where laptops are already managed, and level 5 is the far end of the range. No level answers code already running on the laptop.",
    "Five levels of access control",
    "Each level adds to the one before. None answers code already running on the laptop.",
    [
      body,
      ln(32, 646, 32 + 3 * w + 2 * gap, 646, { stroke: C.blue, sw: 3 }),
      t(32, 670, "Recommended start", { size: 15, fill: C.ink2 }),
      ln(x3, 646, x3 + w, 646, { stroke: C.ink2, sw: 3 }),
      para(x3, 670, "Where laptops are already managed", w, { size: 15 }),
      ln(x4, 646, x4 + w, 646, { stroke: C.ink2, sw: 3, dash: "5 4" }),
      t(x4, 670, "The far end of the range", { size: 15, fill: C.ink2 }),
    ].join("\n"),
    "",
  );
}

function stagedPath() {
  const phases = [
    [
      "PHASE ONE",
      "One engineer can run it",
      [
        ["One application that runs on one machine", "Slack; Instacart (its builder)"],
        ["A hosted product or plain virtual machines, with a maintained image", "Slack and Instacart built; Discord bought"],
        ["ssh behind single sign-on with a hardware key", "Google"],
        ["Outbound traffic denied; a package proxy; no production credentials or real personal data", "DZ BANK (co-written with its vendor); DekaBank (vendor case study); Stripe"],
        ["Volunteers first, then the default for that application", "Slack, Discord, GitHub"],
        ["A stop outside working hours", "Instacart (its builder)"],
        ["A date for the end of local development on that application", "Discord (backend work)"],
      ],
    ],
    [
      "PHASE TWO",
      "Needs more than one engineer",
      [
        ["Short-lived ssh certificates and one logged bastion", "Meta (production, 2016); Netflix; US guidance"],
        ["A gateway for internal tools", "Uber, Stripe, Cloudflare"],
        ["Attended agents on the engineer's own server", "Five engineers; Jane Street (location unstated)"],
        ["A hosted search and fetch tool", "Vendor documentation only"],
      ],
    ],
    [
      "PHASE THREE",
      "Data, and unattended agents",
      [
        ["A broker for data", "GitLab; Envoy"],
        ["Unattended agents on their own servers, with their own identities", "Stripe's devboxes; LinkedIn's identities; Ramp's sandboxes"],
        ["Pools of pre-warmed machines", "Slack, Stripe, GitHub, LinkedIn"],
      ],
    ],
  ];
  const w = 300;
  const gx = 18;
  const top = 112;
  const out = [];
  let maxY = 0;
  phases.forEach(([name, sub, steps], c) => {
    const x = 32 + c * (w + gx);
    out.push(t(x, top + 4, name, { size: 13, fill: c === 0 ? C.blue : C.ink2, weight: 700 }));
    out.push(t(x, top + 26, sub, { size: 15, fill: C.ink2 }));
    let y = top + 44;
    steps.forEach(([what, who], i) => {
      const hw = paraHeight(what, w - 28, 15);
      const hh = paraHeight(who, w - 28, 13);
      const h = 18 + hw + 6 + hh + 8;
      out.push(box(x, y, w, h, { fill: c === 0 ? C.blueTint : C.surface, stroke: c === 0 ? C.blue : C.line }));
      out.push(para(x + 14, y + 26, what, w - 28, { size: 15, fill: C.ink, weight: 700 }));
      out.push(para(x + 14, y + 26 + hw + 4, who, w - 28, { size: 13 }));
      y += h + 10;
    });
    maxY = Math.max(maxY, y);
  });
  const by = maxY + 14;
  return frame(
    "staged-path",
    by + 78,
    "A staged path to development servers, in three phases",
    "A staged path in three columns, one for each phase, with the public account behind each step. Phase one, which one engineer can run: one application that runs on one machine (Slack; Instacart, by its builder); a hosted product or plain virtual machines with a maintained image (Slack and Instacart built; Discord bought); ssh behind single sign-on with a hardware key (Google); outbound traffic denied, a package proxy, and no production credentials or real personal data (DZ BANK, co-written with its vendor; DekaBank, a vendor case study; Stripe); volunteers first, then the default for that application (Slack, Discord, GitHub); a stop outside working hours (Instacart, by its builder); a date for the end of local development on that application (Discord, for backend work). Phase two: short-lived ssh certificates and one logged bastion (Meta for production in 2016; Netflix; US guidance); a gateway for internal tools (Uber, Stripe, Cloudflare); attended agents on the engineer's own server (five engineers; Jane Street, location unstated); a hosted search and fetch tool (vendor documentation only). Phase three: a broker for data (GitLab; Envoy); unattended agents on their own servers with their own identities (Stripe's devboxes; LinkedIn's identities; Ramp's sandboxes); pools of pre-warmed machines (Slack, Stripe, GitHub, LinkedIn). Slack formed a team of two in early 2021, released a prototype in August 2021 and had over 90% of its engineers switched by the end of January 2022.",
    "A staged path to development servers",
    "Three phases; each step names a public account of an organization taking it.",
    [
      out.join("\n"),
      ln(32, by, 968, by, { stroke: C.muted, sw: 1.5 }),
      t(32, by + 24, "Slack: a team of two formed in early 2021, a prototype in August 2021, over 90% of its engineers by the end of January 2022.", { size: 14, fill: C.ink2 }),
      t(32, by + 46, "No single company describes all of these steps in this order.", { size: 14, fill: C.ink2 }),
    ].join("\n"),
    "",
  );
}

const figures = {
  "01-laptop-and-server.svg": laptopAndServer(),
  "02-timeline.svg": timeline(),
  "03-access-levels.svg": accessLevels(),
  "04-staged-path.svg": stagedPath(),
};

const check = process.argv.includes("--check");
let stale = false;
for (const [name, svg] of Object.entries(figures)) {
  const dest = resolve(here, name);
  if (check) {
    let actual = null;
    try {
      actual = readFileSync(dest, "utf8");
    } catch {}
    if (actual !== svg) {
      console.error(`Stale: remote-dev/figures/${name}`);
      stale = true;
    }
  } else {
    writeFileSync(dest, svg);
    console.log(`Wrote remote-dev/figures/${name}`);
  }
}
if (stale) process.exitCode = 1;

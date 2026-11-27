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
    ["Hosted search and fetch tool", "Retrieves public pages and logs queries"],
    ["Gateway", "Holds credentials for the wiki, tracker, chat and code search"],
    ["Broker", "Grants each identity time-limited access to sanitized data"],
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
    "The laptop holds an editor window, a browser and an ssh client, with no checkout and no long-lived credentials. It connects through single sign-on with a hardware key, a short-lived ssh certificate and one logged bastion to the development server, and the ssh session and the editor's connection run in both directions. The server holds the working checkout, the toolchain, running services and attended agents, and the engineer has root. The server has eight exits: a package proxy, a hosted search and fetch tool, a gateway, a broker, the model endpoint, the editor's downloads, the organization's own code host, and the build and deployment pipeline. Production is reached only by a reviewed change through the pipeline. The open internet is not reachable from the server. Logs are kept off the server.",
    "The laptop, the development server and its exits",
    "An engineer can administer the server. Separate services control what it can reach.",
    [
      card(32, top, 250, rowH, "Laptop", ["Editor window", "Browser, open to the web", "ssh client", "No checkout", "No long-lived credentials"]),
      card(316, top, 236, rowH, "Getting in", ["Single sign-on", "Hardware key, touched", "Short-lived ssh certificate", "One logged bastion"], { fill: C.panel, stroke: C.ink2 }),
      arrow(286, top + 90, 312, top + 90, { stroke: C.ink2 }),
      arrow(312, top + 124, 286, top + 124, { stroke: C.ink2 }),
      arrow(556, top + 90, 582, top + 90, { stroke: C.ink2 }),
      arrow(582, top + 124, 556, top + 124, { stroke: C.ink2 }),
      card(586, top, 382, rowH, "Development server", ["Working checkout and toolchain", "Builds, tests, running services", "Attended agents", "Engineer has root", "Disk on a volume that outlives the machine", "Outbound traffic denied by default, enforced outside the machine"], { fill: C.blueTint, stroke: C.blue }),
      t(32, top + rowH + 26, "The ssh session and the editor's connection carry data in both directions.", { size: 14, fill: C.ink2 }),
      t(32, exTop - 14, "THE SERVER'S EIGHT EXITS, EACH THROUGH A SERVICE THE ENGINEER DOES NOT ADMINISTER", { size: 13, fill: C.ink2, weight: 700 }),
      exitBoxes,
      arrow(pipeX, exBottom + 4, pipeX, botY - 34, { stroke: C.orange }),
      t(32, botY - 14, "KEPT OFF THE SERVER", { size: 13, fill: C.ink2, weight: 700 }),
      card(32, botY, 304, 96, "Logs", ["From the bastion, the proxy, the gateway and the broker"], { fill: C.panel, stroke: C.ink2 }),
      t(348, botY - 14, "NOT REACHABLE", { size: 13, fill: C.ink2, weight: 700 }),
      card(348, botY, 304, 96, "The open internet", ["Arbitrary destinations, in either direction"], { fill: C.orangeTint, stroke: C.orange, dash: "5 4" }),
      t(664, botY - 14, "REACHED ONLY THROUGH THE PIPELINE", { size: 13, fill: C.ink2, weight: 700 }),
      card(664, botY, 304, 96, "Production", ["The pipeline deploys reviewed changes with its own credentials"], { fill: C.orangeTint, stroke: C.orange, dash: "5 4" }),
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
    ["5", "Full BeyondCorp", "Inventory, computed trust tiers, every request authorized", "Trust based on network location; unpatched devices", "Google"],
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
      for (const [label, text] of [["ADDS", adds], ["ANSWERS", stops], ["SOURCE", who]]) {
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
    "Five levels of access control, each adding to the one before. Level 1: single sign-on with a hardware security key that must be touched. Level 2: short-lived ssh certificates issued after sign-on. Level 3: one logged bastion as the only way in. Level 4: a device certificate checked along with the user. Level 5: full BeyondCorp, with a device inventory, computed trust tiers and authorization on every request. Levels 1 to 3 are the recommended start, level 4 is added where laptops are already managed, and level 5 is the far end of the range. Code running on the laptop can still use an open session.",
    "Five levels of access control",
    "Each level adds a check. Code running on the laptop can still use an open session.",
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
  const y = 114;
  const w = 284;
  const h = 205;
  return frame(
    "staged-path",
    350,
    "From one application to unattended agents",
    "Record sign-ins and SSH connections from the first day of the pilot. Compare edit-to-test times and support hours with local development, and have a second engineer recover a checkout. Record agent tool calls. Give unattended agents their own machines and identities, and review their changes.",
    "From one application to unattended agents",
    "A proposed rollout for a team moving its first application to a development server.",
    [
      card(32, y, w, h, "Pilot one application", [
        "Volunteers ship an ordinary change from a restricted Linux machine.",
        "Record sign-ins and SSH connections from the first day.",
      ], { fill: C.blueTint, stroke: C.blue }),
      arrow(322, y + h / 2, 351, y + h / 2, { stroke: C.ink2 }),
      card(358, y, w, h, "Retire the local setup", [
        "Compare edit-to-test times and support hours with the local setup.",
        "Retire it when the pilot delivers the expected speed, support is sustainable and a second engineer has recovered a checkout.",
      ]),
      arrow(648, y + h / 2, 677, y + h / 2, { stroke: C.ink2 }),
      card(684, y, w, h, "Add agents if needed", [
        "Start with an engineer present. Record which tools each agent job calls.",
        "Give an unattended agent its own machine and identity. Have a person review its changes.",
      ]),
    ].join("\n"),
    "",
  );
}

const figures = {
  "01-laptop-and-server.svg": laptopAndServer(),
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

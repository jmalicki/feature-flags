// Generates the essay's figures as standalone SVGs: no remote fonts, renderer, or image host.
// Usage: node figures/build.mjs          (writes figures/*.svg)
//        node figures/build.mjs --check  (fails if a committed SVG is stale)
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
  blue: "#2a78d6", // the new way
  blueTint: "#e6f0fb",
  orange: "#eb6834", // the testing-period way, and hazards
  orangeTint: "#fdece5",
};

const esc = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const box = (x, y, w, h, { fill = C.panel, stroke = "none", r = 8, sw = 1.5, dash = "" } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const t = (x, y, s, { size = 18, fill = C.ink, weight = 400, anchor = "start" } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`;
// Greedy wrap on an approximate glyph width; good enough for sans-serif labels.
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
// Bars: thin, rounded at the data end, square at the baseline.
const hbar = (x, y, w, h, fill) => `<path d="M ${x} ${y} H ${x + w - 4} Q ${x + w} ${y} ${x + w} ${y + 4} V ${y + h - 4} Q ${x + w} ${y + h} ${x + w - 4} ${y + h} H ${x} Z" fill="${fill}"/>`;

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

// A labelled stage box used by the pipeline-style figures.
const stage = (x, y, w, h, label, sub, { accent = null, tint = C.surface } = {}) =>
  [
    box(x, y, w, h, { fill: tint, stroke: accent ?? C.line }),
    para(x + 12, y + 26, label, w - 24, { size: 16, fill: C.ink, weight: 700 }),
    sub ? para(x + 12, y + 26 + paraHeight(label, w - 24, 16) + 2, sub, w - 24, { size: 14 }) : "",
  ].join("\n");

function releaseTrain() {
  const x0 = 32;
  const d = 168; // px per day
  const cut = x0 + 1.75 * d;
  const y = 196;
  const h = 86;
  const seg = (i, label, sub) => stage(cut + i * d + (i ? 6 : 0), y, d - (i ? 6 : 0), h, label, sub);
  const changes = [0.1, 0.45, 0.8, 1.15, 1.5].map((p) => `<rect x="${(x0 + p * d).toFixed(0)}" y="${y + 26}" width="26" height="26" rx="5" fill="${C.blueTint}" stroke="${C.blue}" stroke-width="1.5"/>`).join("");
  const ex = 430; // exposure baseline
  const rel = cut + 3 * d + 6;
  return frame(
    "train",
    560,
    "A release train",
    "A timeline of one release train. Finished changes wait about 1.75 days on average for the next cut. The train then spends one day in integration and regression testing, one day in a performance run and overnight batch, and one day in approval and waiting for a release window. It is then released to every user at once. User exposure is zero throughout and steps to one hundred percent at release. A typical change takes about five days from finished to live.",
    "A release train",
    "The running example: two trains a week, three days of promotion each.",
    [
      t(x0, y - 22, "WAITING FOR THE NEXT CUT", { size: 13, fill: C.ink2, weight: 700 }),
      box(x0, y, 1.75 * d - 8, h, { fill: C.panel, stroke: C.ink2, dash: "5 4" }),
      changes,
      t(x0 + 12, y + 74, "about 1.75 days on average", { size: 14, fill: C.ink2 }),
      t(cut, y - 22, "PROMOTION: THREE DAYS", { size: 13, fill: C.ink2, weight: 700 }),
      seg(0, "Day 1", "Integration and regression pack"),
      seg(1, "Day 2", "Performance run, overnight batch"),
      seg(2, "Day 3", "Approval, wait for release window"),
      ln(cut - 4, y - 8, cut - 4, y + h + 8, { stroke: C.ink, sw: 2 }),
      t(cut - 10, y + h + 26, "cut", { size: 14, fill: C.ink2, anchor: "end" }),
      box(rel, y, W - 32 - rel, h, { fill: C.orangeTint, stroke: C.orange }),
      para(rel + 10, y + 26, "Release", W - 52 - rel, { size: 16, fill: C.ink, weight: 700 }),
      para(rel + 10, y + 48, "every user at once", W - 52 - rel, { size: 14 }),
      t(x0, ex - 86, "SHARE OF USERS EXPOSED TO THE NEW BEHAVIOR", { size: 13, fill: C.ink2, weight: 700 }),
      ln(x0, ex, W - 32, ex, { stroke: C.line, sw: 1.5 }),
      `<path d="M ${x0} ${ex} H ${rel} V ${ex - 60} H ${W - 32}" fill="none" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`,
      t(x0, ex + 22, "0%", { size: 14, fill: C.ink2 }),
      t(W - 32, ex - 68, "100%", { size: 14, fill: C.ink2, anchor: "end" }),
      ln(x0, ex + 52, rel, ex + 52, { stroke: C.muted, sw: 1.5 }),
      ln(x0, ex + 46, x0, ex + 58, { stroke: C.muted, sw: 1.5 }),
      ln(rel, ex + 46, rel, ex + 58, { stroke: C.muted, sw: 1.5 }),
      t((x0 + rel) / 2, ex + 76, "about 5 days from finished to live for a typical change", { size: 15, fill: C.ink, anchor: "middle" }),
    ].join("\n"),
    "",
  );
}

function whereTheWait() {
  const y1 = 150;
  const y2 = 380;
  const old = [
    ["Build", "several days of changes"],
    ["DEV", ""],
    ["UAT", ""],
    ["Pre-production", "soak: the wait happens here"],
    ["Production", "every client at once"],
  ];
  const oldX = [32, 200, 330, 460, 720];
  const oldW = [150, 112, 112, 242, 248];
  const now = [
    ["Build + tests + peer review", "one small change"],
    ["Dark", "deployed, 0% exposed"],
    ["Staff", ""],
    ["One client", ""],
    ["10%", ""],
    ["Everyone", ""],
  ];
  const nowX = [32, 262, 444, 566, 688, 810];
  const nowW = [212, 164, 104, 104, 104, 158];
  const row = (items, xs, ws, y, accent, tintFrom) =>
    items
      .map(([a, b], i) =>
        [
          stage(xs[i], y, ws[i], 92, a, b, { accent: i >= tintFrom ? accent : C.line, tint: i >= tintFrom ? (accent === C.blue ? C.blueTint : C.orangeTint) : C.surface }),
          i < items.length - 1 ? arrow(xs[i] + ws[i] + 3, y + 46, xs[i + 1] - 4, y + 46) : "",
        ].join("\n"),
      )
      .join("\n");
  return frame(
    "wait",
    580,
    "Where the wait happens",
    "Two pipelines. In the testing-period model, several days of changes are built together, promoted through DEV, UAT and pre-production where they soak, then released to every client at once. In the production-ramp model, one small change is built, tested and peer reviewed, deployed dark with nobody exposed, then exposed to staff, one client, ten percent and everyone, with the wait spent in production at limited exposure.",
    "The wait did not disappear. It moved.",
    "Both models wait. They differ in where the time is spent and who is exposed meanwhile.",
    [
      t(32, y1 - 16, "TESTING PERIOD: PROVE IT SAFE, THEN RELEASE IT", { size: 14, fill: C.ink2, weight: 700 }),
      row(old, oldX, oldW, y1, C.orange, 3),
      ln(460, y1 + 112, 702, y1 + 112, { stroke: C.orange, sw: 4 }),
      t(460, y1 + 136, "Days of waiting, on synthetic traffic", { size: 15, fill: C.ink2 }),
      ln(720, y1 + 112, 968, y1 + 112, { stroke: C.orange, sw: 4 }),
      t(720, y1 + 136, "Exposure jumps from 0% to 100%", { size: 15, fill: C.ink2 }),
      t(32, y2 - 16, "PRODUCTION RAMP: RELEASE IT A LITTLE, AND PROVE IT AS YOU GO", { size: 14, fill: C.ink2, weight: 700 }),
      row(now, nowX, nowW, y2, C.blue, 1),
      ln(262, y2 + 112, 968, y2 + 112, { stroke: C.blue, sw: 4 }),
      t(262, y2 + 136, "The wait is spent here: on real traffic and real data, widening only as evidence arrives", { size: 15, fill: C.ink2 }),
    ].join("\n"),
    "Conceptual schematic. Automated tests and review still come first in both models.",
  );
}

function ladder() {
  const steps = [
    ["Dormant", "Nobody", "Deployed behind a flag or experiment set to 0%.", "It builds, deploys and disturbs nothing that is live."],
    ["Shadow", "Nobody", "Real traffic runs through it; results are compared, then discarded.", "Load, latency, and whether it gives the same answers."],
    ["Staff", "Employees", "People who can report what they see.", "Whether it works in real use."],
    ["Small cohort", "1%, one merchant, one country", "A named, stable group.", "Whether it is safe to widen."],
    ["Everyone", "All clients", "The old path is removed afterwards.", "Nothing new, if the earlier rungs did their job."],
  ];
  const w = 178;
  const gap = 12;
  const base = 546;
  const body = steps
    .map(([name, who, what, learn], i) => {
      const x = 32 + i * (w + gap);
      const h = 326 + i * 26;
      const y = base - h;
      const dark = i < 2;
      return [
        box(x, y, w, h, { fill: dark ? C.panel : C.blueTint, stroke: dark ? C.ink2 : C.blue, dash: dark ? "5 4" : "" }),
        t(x + 14, y + 30, name, { size: 19, weight: 700 }),
        t(x + 14, y + 56, "WHO SEES IT", { size: 12, fill: C.muted, weight: 700 }),
        para(x + 14, y + 76, who, w - 28, { size: 15, fill: C.ink }),
        t(x + 14, y + 128, "WHAT HAPPENS", { size: 12, fill: C.muted, weight: 700 }),
        para(x + 14, y + 148, what, w - 28, { size: 14 }),
        t(x + 14, y + 246, "WHAT YOU LEARN", { size: 12, fill: C.muted, weight: 700 }),
        para(x + 14, y + 266, learn, w - 28, { size: 14 }),
      ].join("\n");
    })
    .join("\n");
  return frame(
    "ladder",
    640,
    "The exposure ladder",
    "Five rungs of increasing exposure. Dormant: code is deployed behind a flag at zero percent and nobody sees it. Shadow: real traffic runs through the new code and results are compared and discarded; nobody sees it. Staff: employees use it. Small cohort: one percent, one merchant or one country. Everyone: all clients. The first two rungs are the dark launch.",
    "Every risky change starts dark",
    "The first two rungs replace the testing period: time to observe on real traffic, with no client exposed.",
    [
      body,
      ln(32, 574, 32 + 2 * w + gap, 574, { stroke: C.ink2, sw: 3, dash: "5 4" }),
      t(32, 598, "Dark launch: in production, seen by nobody", { size: 15, fill: C.ink2 }),
      ln(32 + 2 * (w + gap), 574, 32 + 5 * w + 4 * gap, 574, { stroke: C.blue, sw: 3 }),
      t(32 + 2 * (w + gap), 598, "Ramp: exposure widens on evidence", { size: 15, fill: C.ink2 }),
    ].join("\n"),
    "",
  );
}

function timeline() {
  const bands = [
    ["Foundations", [
      ["2000", "Fowler and Foemmel describe continuous integration: merge and test daily."],
      ["2007", "Kohavi and colleagues: start experiments small, ramp up, abort automatically. Google's search experiment system first deployed."],
    ]],
    ["The vocabulary appears", [
      ["2008", "Facebook Chat runs dark on live traffic from February; users see it in April."],
      ["2009", "IMVU describes fifty deploys a day. Flickr describes flags and ten-plus deploys a day."],
      ["2010", "Wealthfront, an SEC-regulated firm: one instance first, automatic rollback in seconds."],
      ["2011", "Etsy says its flags were taken almost exactly from Flickr."],
    ]],
    ["Scale, failures and the first studies", [
      ["2012", "Knight Capital: a reused flag and one stale server lose $460 million in 45 minutes."],
      ["2013", "Netflix scores canaries automatically. Azure DevOps flips flags on launch day and goes down."],
      ["2014", "Azure DevOps adds “ring 0”: its own staff take every release first."],
      ["2015", "Facebook paper: ship code disabled, ramp it with Gatekeeper, canary the configuration too."],
      ["2016", "Facebook and OANDA study continuous deployment, including at an FX trading platform."],
    ]],
    ["Codified, and regulators take notice", [
      ["2017", "Facebook's website moves to pushing continuously from the main branch."],
      ["2019", "Uber shadows payment authorisation without charging anyone twice."],
      ["2020", "Amazon documents its pipeline: one box, then waves, with bake times and automatic rollback."],
      ["2021", "UK regulator's review of 23 firms: smaller, more frequent releases succeed more often."],
      ["2022", "Monzo, a bank, rolls automated rollback out across 2,100 services."],
      ["2024", "The US bank examiners' handbook describes canary and blue/green releases."],
    ]],
  ];
  let y = 118;
  const parts = [];
  const spine = 150;
  const top = y;
  for (const [band, items] of bands) {
    parts.push(t(spine + 22, y + 4, band.toUpperCase(), { size: 13, fill: C.ink2, weight: 700 }));
    y += 26;
    for (const [year, text] of items) {
      const lines = wrap(text, 790, 16);
      parts.push(t(spine - 22, y + 5, year, { size: 17, weight: 700, anchor: "end" }));
      parts.push(dot(spine, y, 6, year === "2012" ? C.orange : C.blue));
      parts.push(lines.map((l, i) => t(spine + 22, y + 5 + i * 21, l, { size: 16, fill: C.ink })).join("\n"));
      y += Math.max(1, lines.length) * 21 + 13;
    }
    y += 10;
  }
  const h = y + 34;
  return frame(
    "timeline",
    h,
    "Twenty-four years of published practice",
    "A timeline from 2000 to 2024 in four bands: foundations in continuous integration and experimentation; the vocabulary of dark launches, flags and frequent deployment appearing from 2008 to 2011; scale reports, failures and the first studies from 2012 to 2016; and codification with regulatory attention from 2017 to 2024.",
    "What a fast follower inherits",
    "Dates are when a practice was documented, not when it was invented.",
    [ln(spine, top + 22, spine, y - 30, { stroke: C.line, sw: 2 }), ...parts].join("\n"),
    "",
  );
}

function oneMechanism() {
  const loop = [
    ["Expose a subset", "machines, accounts or users"],
    ["Compare with the rest", "errors, latency, money, behaviour"],
    ["Expand, or revert", "automatically where possible"],
  ];
  const lx = [70, 372, 674];
  const loopSvg = loop
    .map(([a, b], i) => [stage(lx[i], 118, 256, 84, a, b, { accent: C.blue, tint: C.blueTint }), i < 2 ? arrow(lx[i] + 259, 160, lx[i + 1] - 4, 160, { stroke: C.blue }) : ""].join("\n"))
    .join("\n");
  const back = `<path d="M 802 202 V 232 H 198 V 208" fill="none" stroke="${C.blue}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` + arrow(198, 214, 198, 205, { stroke: C.blue });
  const cols = [
    ["Canary", "The binary", "Machines", "Is it broken?"],
    ["Flag ramp", "One behaviour inside the binary", "Accounts, merchants, users", "Is it broken?"],
    ["Experiment", "One behaviour inside the binary", "Randomised accounts or users", "Is it better?"],
  ];
  const rows = ["WHAT VARIES", "WHO IS EXPOSED", "THE QUESTION"];
  const cx = [200, 468, 736];
  const ty = 296;
  const table = [
    ...cols.map(([name], i) => t(cx[i], ty, name, { size: 19, weight: 700 })),
    ...rows.map((r, j) =>
      [
        ln(32, ty + 18 + j * 62, 968, ty + 18 + j * 62, { stroke: C.line, sw: 1.5 }),
        t(32, ty + 54 + j * 62, r, { size: 12, fill: C.muted, weight: 700 }),
        ...cols.map((c, i) => para(cx[i], ty + 48 + j * 62, c[j + 1], 250, { size: 15, fill: C.ink })),
      ].join("\n"),
    ),
  ].join("\n");
  return frame(
    "mechanism",
    540,
    "One mechanism, three settings",
    "A loop of three steps: expose a subset, compare with the rest, then expand or revert. Below it, three settings of the same loop. A canary varies the binary across machines and asks whether it is broken. A flag ramp varies one behaviour across accounts, merchants or users and asks whether it is broken. An experiment varies one behaviour across randomised accounts or users and asks whether it is better.",
    "One mechanism, three settings",
    "Canaries, flag ramps and experiments run the same loop with different settings.",
    [loopSvg, back, table].join("\n"),
    "",
  );
}

function queue() {
  const x0 = 250;
  const day = 64;
  const days = 11;
  const axis = (y) =>
    [
      ln(x0, y, x0 + days * day, y, { stroke: C.line, sw: 1.5 }),
      ...Array.from({ length: days + 1 }, (_, d) => [ln(x0 + d * day, y, x0 + d * day, y + 5, { stroke: C.line, sw: 1.5 }), d % 2 === 0 ? t(x0 + d * day, y + 22, `day ${d}`, { size: 13, fill: C.muted, anchor: "middle" }) : ""].join("")),
    ].join("\n");
  const bar = (d0, d1, y, fill, h = 16) => hbar(x0 + d0 * day, y, (d1 - d0) * day - 2, h, fill);
  const tick = (d, y, fill) => `<rect x="${x0 + d * day}" y="${y}" width="6" height="16" rx="2" fill="${fill}"/>`;
  // Panel A: three-day soak, changes batch behind it.
  const ay = 150;
  const a = [
    t(32, ay - 22, "A LONG SOAK OR CANARY HOLDS THE WHOLE BINARY", { size: 14, fill: C.ink2, weight: 700 }),
    t(32, ay + 14, "Release 1", { size: 16, weight: 700 }),
    t(32, ay + 33, "3 changes", { size: 14, fill: C.ink2 }),
    bar(0, 3, ay, C.orange),
    t(x0 + 3 * day + 8, ay + 14, "live on day 3", { size: 14, fill: C.ink2 }),
    t(32, ay + 70, "Release 2", { size: 16, weight: 700 }),
    t(32, ay + 89, "3 changes, written days 0–3", { size: 14, fill: C.ink2 }),
    ln(x0, ay + 64, x0 + 3 * day - 4, ay + 64, { stroke: C.muted, sw: 2, dash: "3 5" }),
    bar(3, 6, ay + 56, C.orange),
    t(x0 + 6 * day + 8, ay + 70, "live on day 6", { size: 14, fill: C.ink2 }),
    t(32, ay + 126, "Release 3", { size: 16, weight: 700 }),
    t(32, ay + 145, "3 changes, written days 3–6", { size: 14, fill: C.ink2 }),
    ln(x0 + 3 * day, ay + 120, x0 + 6 * day - 4, ay + 120, { stroke: C.muted, sw: 2, dash: "3 5" }),
    bar(6, 9, ay + 112, C.orange),
    t(x0 + 9 * day + 8, ay + 126, "live on day 9", { size: 14, fill: C.ink2 }),
    axis(ay + 166),
  ].join("\n");
  // Panel B: daily deploys; one risky behaviour ramps on its own clock.
  const by = 432;
  const names = ["Change 1", "Change 2", "Change 3 (risky)", "Change 4", "Change 5", "Change 6"];
  const b = [
    t(32, by - 22, "A FLAG PUTS THE WAIT ON THE ONE BEHAVIOUR THAT NEEDS IT", { size: 14, fill: C.ink2, weight: 700 }),
    ...names.map((n, i) => {
      const y = by + i * 34;
      const risky = i === 2;
      return [
        t(32, y + 14, n, { size: 16, weight: risky ? 700 : 400 }),
        tick(i, y, C.blue),
        risky
          ? [bar(2.15, 9, y, C.blueTint), `<rect x="${x0 + 2.15 * day}" y="${y}" width="${6.85 * day - 2}" height="16" rx="4" fill="none" stroke="${C.blue}" stroke-width="1.5"/>`, ...[["dark", 2.3], ["staff", 3.6], ["1 client", 4.9], ["10%", 6.4], ["100%", 7.9]].map(([l, d]) => t(x0 + d * day, y + 13, l, { size: 13, fill: C.ink }))].join("")
          : t(x0 + i * day + 14, y + 14, "deployed the day it is written", { size: 14, fill: C.ink2 }),
      ].join("\n");
    }),
    axis(by + 6 * 34 + 8),
  ].join("\n");
  const legend = [
    hbar(32, 706, 28, 12, C.orange),
    t(68, 717, "binary held in soak", { size: 14, fill: C.ink2 }),
    ln(240, 712, 268, 712, { stroke: C.muted, sw: 2, dash: "3 5" }),
    t(276, 717, "finished work waiting for the next release", { size: 14, fill: C.ink2 }),
    `<rect x="590" y="704" width="6" height="16" rx="2" fill="${C.blue}"/>`,
    t(604, 717, "short binary canary", { size: 14, fill: C.ink2 }),
    box(770, 705, 28, 14, { fill: C.blueTint, stroke: C.blue, r: 4 }),
    t(806, 717, "one behaviour's ramp", { size: 14, fill: C.ink2 }),
  ].join("\n");
  return frame(
    "queue",
    770,
    "A long canary makes every change wait; a flag ramp makes one behaviour wait",
    "Two schematic schedules over eleven days. In the first, each release holds the binary in a three-day soak; work finished meanwhile waits and is batched into the next release, so releases carry three changes each and go live on days three, six and nine. In the second, each change is deployed the day it is written after a short binary canary, and only one risky change ramps slowly behind a flag from dark to staff to one client, ten percent and one hundred percent without delaying the others.",
    "Who waits for the slow change?",
    "With a soak, every change waits and batches grow. With a flag, one risky behaviour waits alone.",
    [a, b, legend].join("\n"),
    "Illustrative schedule, not measured data.",
  );
}

function ramps() {
  const rows = [
    ["Facebook website", "2017", ["employees", "2%", "100%"], "a few hours in total"],
    ["Facebook Android app", "2016", ["20%", "50%", "100%"], "three days in total"],
    ["Amazon services", "2020", ["one box", "first Region", "more Regions", "all Regions"], "bake ≥1 h, then ≥12 h, then 2–4 h a wave; 4–5 business days"],
    ["Azure DevOps", "as documented in 2022", ["tier 0", "tier 1", "tier 2", "tier 3", "tier 4"], "about 24 hours in each tier"],
    ["Slack", "2020", ["dogfood", "2% canary", "10%", "25%", "50%", "75%", "100%"], "stage lengths not published"],
    ["Uber payment authorisation", "2019", ["shadow", "employees", "0.25%", "1%", "5%", "100%"], "per payment method; lengths not published"],
    ["Uber ledger", "2020", ["1%", "5%", "10%", "20%", "50%", "100%"], "a percentage in each country, starting with a country with few users"],
  ];
  const x0 = 250;
  const chipW = 88;
  const rowH = 62;
  const y0 = 112;
  const body = rows
    .map(([who, year, stages, note], r) => {
      const y = y0 + r * rowH;
      return [
        r > 0 ? ln(32, y - 10, 968, y - 10, { stroke: C.line, sw: 1 }) : "",
        t(32, y + 16, who, { size: 16, weight: 700 }),
        t(32, y + 36, year, { size: 14, fill: C.muted }),
        ...stages.map((s, i) => {
          const x = x0 + i * (chipW + 16);
          const last = i === stages.length - 1;
          const dark = s === "shadow";
          return [
            box(x, y, chipW, 26, { fill: dark ? C.panel : last ? C.blue : C.blueTint, stroke: dark ? C.ink2 : C.blue, r: 13, dash: dark ? "4 3" : "" }),
            t(x + chipW / 2, y + 17, s, { size: 12, fill: last ? "#ffffff" : C.ink, anchor: "middle", weight: last ? 700 : 400 }),
            !last ? arrow(x + chipW + 2, y + 13, x + chipW + 14, y + 13, { stroke: C.muted, sw: 1.5 }) : "",
          ].join("");
        }),
        t(x0, y + 44, note, { size: 13, fill: C.ink2 }),
      ].join("\n");
    })
    .join("\n");
  return frame(
    "ramps",
    y0 + rows.length * rowH + 40,
    "Ramp stages that firms have published",
    "Seven published ramp schedules. Facebook's website in 2017: employees, two percent, one hundred percent in a few hours. Facebook's Android app in 2016: twenty, fifty, one hundred percent over three days. Amazon in 2020: one box, first Region, more Regions, all Regions over four to five business days with bake times. Azure DevOps: five tiers of about twenty-four hours. Slack in 2020: its own staff, a two percent canary, then ten, twenty-five, fifty, seventy-five and one hundred percent. Uber payment authorisation in 2019: shadow, employees, a quarter of a percent, one percent, five percent, one hundred percent per payment method. Uber's ledger in 2020: one to one hundred percent within each country, starting with a country with few users.",
    "Published rollout stages",
    "Stages as each company described them. Examples, not a ranking.",
    body,
    "Sources are cited beside the figure in the essay.",
  );
}

function fca() {
  const px = [32, 372, 692];
  const panel = (i, w, head) => [box(px[i], 108, w, 300, { fill: C.panel }), para(px[i] + 18, 138, head, w - 36, { size: 16, fill: C.ink, weight: 700 })].join("\n");
  const scale = 46; // px per percentage point
  const p1 = [
    panel(0, 320, "Changes that failed"),
    t(50, 196, "All changes", { size: 15, fill: C.ink2 }),
    hbar(50, 206, 1.6 * scale, 20, C.blue),
    t(50 + 1.6 * scale + 10, 222, "1.6%", { size: 18, weight: 700 }),
    t(50, 272, "“Major” changes, with extra oversight", { size: 15, fill: C.ink2 }),
    hbar(50, 282, 3.8 * scale, 20, C.orange),
    t(50 + 3.8 * scale + 10, 298, "3.8%", { size: 18, weight: 700 }),
    para(50, 348, "Nearly 68,000 major changes. More scrutiny, more than twice the failure rate.", 284, { size: 14 }),
  ].join("\n");
  const p2 = [
    panel(1, 300, "Major changes approved by the change board"),
    box(390, 206, 264, 20, { fill: C.surface, stroke: C.line, r: 4 }),
    hbar(390, 206, 264 * 0.9, 20, C.orange),
    t(390, 262, "over 90%", { size: 30, weight: 700 }),
    para(390, 300, "At some firms the board did not reject a single change in 2019.", 264, { size: 14 }),
  ].join("\n");
  const p3 = [
    panel(2, 276, "Incidents caused by a change"),
    t(710, 196, "Material incidents reported to the FCA", { size: 14, fill: C.ink2 }),
    hbar(710, 206, 17 * 6, 20, C.blue),
    t(710 + 17 * 6 + 10, 222, "17%", { size: 18, weight: 700 }),
    t(710, 272, "Firms' own high-severity incidents", { size: 14, fill: C.ink2 }),
    hbar(710, 282, 24 * 6, 20, C.blue),
    t(710 + 24 * 6 + 10, 298, "24%", { size: 18, weight: 700 }),
    para(710, 348, "Different denominators; shown side by side, not for comparison.", 240, { size: 14 }),
  ].join("\n");
  return frame(
    "fca",
    470,
    "What the UK regulator found in its own firms' change data",
    "Three panels of statistics from the Financial Conduct Authority's review of technology change. First: 1.6 percent of all changes failed, against 3.8 percent of major changes that had extra oversight. Second: change advisory boards approved over 90 percent of the major changes they reviewed. Third: change caused 17 percent of material incidents reported to the regulator and 24 percent of firms' own high-severity incidents.",
    "FCA review of technology change",
    "UK Financial Conduct Authority review of 23 firms and over a million changes made in 2019.",
    [p1, p2, p3].join("\n"),
    "It also found smaller, more frequent releases had higher success rates. These are associations, not causes.",
  );
}

function sixteenDays() {
  const x0 = 32;
  const unit = 58;
  const y = 176;
  return frame(
    "sixteen",
    320,
    "Amazon measured sixteen days from check-in to production, almost fourteen of them waiting",
    "A single bar sixteen days long. The remaining two days or so are building, deploying and testing. Almost fourteen days are waiting for a person to start the next step.",
    "Amazon's pipeline before automation",
    "16 days on average from check-in to production, almost 14 of them waiting.",
    [
      hbar(x0, y, 2 * unit - 3, 24, C.blue),
      hbar(x0 + 2 * unit, y, 14 * unit, 24, C.orange),
      ...Array.from({ length: 17 }, (_, d) => ln(x0 + d * unit, y + 30, x0 + d * unit, y + 36, { stroke: C.line, sw: 1.5 })),
      t(x0, y - 36, "About 2 days of work", { size: 17, weight: 700 }),
      t(x0, y - 14, "writing the code, then under an hour to build and deploy", { size: 15, fill: C.ink2 }),
      t(x0 + 2 * unit, y + 62, "Almost 14 days of waiting", { size: 17, weight: 700 }),
      t(x0 + 2 * unit, y + 84, "for someone to start the build, run the deployment, or run the tests", { size: 15, fill: C.ink2 }),
    ].join("\n"),
    "Reported in 2019 as a measurement taken more than ten years earlier.",
  );
}

function rollbacks() {
  const cards = [
    ["Switch traffic back", "The old version is still running. Point traffic at it.", "Seconds to minutes", "Costs capacity: two versions run at once.", C.blue],
    ["Redeploy the kept image", "Deploy the previous build again, byte for byte, by its hash.", "One deployment", "Only if the image was kept and the tag cannot be overwritten.", C.blue],
    ["Rebuild the old source", "Check out the earlier revision and build it again.", "A full build and deployment", "The result is only the same if the build is repeatable. Under pressure, it often is not.", C.orange],
  ];
  const w = 300;
  const body = cards
    .map(([name, how, speed, catchIt, col], i) => {
      const x = 32 + i * (w + 18);
      return [
        box(x, 108, w, 268, { fill: col === C.blue ? C.blueTint : C.orangeTint, stroke: col }),
        t(x + 18, 142, name, { size: 20, weight: 700 }),
        para(x + 18, 172, how, w - 36, { size: 15, fill: C.ink }),
        t(x + 18, 246, "HOW FAST", { size: 12, fill: C.muted, weight: 700 }),
        t(x + 18, 268, speed, { size: 16, weight: 700 }),
        t(x + 18, 300, "THE CATCH", { size: 12, fill: C.muted, weight: 700 }),
        para(x + 18, 320, catchIt, w - 36, { size: 14 }),
      ].join("\n");
    })
    .join("\n");
  const none = [
    box(32, 398, 936, 92, { fill: C.panel }),
    t(50, 428, "What none of them undo", { size: 17, weight: 700 }),
    para(50, 454, "Data the new version wrote. A schema it migrated. Messages it sent. Money it moved. These need their own design: compatible formats, compare-before-switch, and correcting entries.", 900, { size: 15 }),
  ].join("\n");
  return frame(
    "rollbacks",
    530,
    "Three things called rollback",
    "Three kinds of rollback. Switching traffic back to a still-running old version takes seconds to minutes but costs capacity. Redeploying the kept image takes one deployment and requires that the image was retained under an immutable hash. Rebuilding the old source takes a full build and is only trustworthy if the build is repeatable. None of them undo data written, schemas migrated, messages sent or money moved.",
    "Three kinds of rollback",
    "The first two return production to a build that has already run there.",
    [body, none].join("\n"),
    "",
  );
}

function knight() {
  const sx = 32;
  const servers = Array.from({ length: 8 }, (_, i) => {
    const x = sx + i * 80;
    const bad = i === 7;
    return [
      box(x, 150, 66, 78, { fill: bad ? C.orangeTint : C.blueTint, stroke: bad ? C.orange : C.blue }),
      t(x + 33, 182, bad ? "old" : "new", { size: 16, weight: 700, anchor: "middle" }),
      t(x + 33, 204, "code", { size: 14, fill: C.ink2, anchor: "middle" }),
    ].join("\n");
  }).join("\n");
  const tx = 32;
  const tw = 610;
  const ty = 330;
  const stats = [
    ["About 45 minutes", "before the orders stopped"],
    ["4 million", "executions in 154 stocks"],
    ["Over $460 million", "lost"],
  ];
  return frame(
    "knight",
    470,
    "Knight Capital deployed over five days and activated in one moment",
    "Eight servers: seven received the new code and one kept old code. A timeline shows the new code deployed in stages from 27 July 2012 while its path stayed dormant, then activated on every server at the market open on 1 August, when a reused flag triggered the old code on the eighth server. The result was four million executions in 154 stocks in about 45 minutes and a loss of more than 460 million dollars.",
    "Knight Capital, August 1, 2012",
    "Staged deployment, single activation. Source: the SEC's order.",
    [
      t(sx, 132, "EIGHT ORDER-ROUTING SERVERS", { size: 13, fill: C.ink2, weight: 700 }),
      servers,
      para(sx, 254, "One server was missed. On it, the reused flag switched on code that had not been used since 2003.", 620, { size: 15 }),
      ln(tx, ty, tx + tw, ty, { stroke: C.line, sw: 3 }),
      ln(tx, ty, tx + tw - 60, ty, { stroke: C.blue, sw: 5 }),
      dot(tx, ty, 6, C.blue),
      t(tx, ty + 30, "27 July", { size: 15, weight: 700 }),
      para(tx, ty + 50, "Deployment begins, a few servers a day. Nothing uses the new path yet.", 250, { size: 14 }),
      dot(tx + tw - 60, ty, 8, C.orange),
      t(tx + tw - 60, ty + 30, "1 August, market open", { size: 15, weight: 700, anchor: "middle" }),
      para(tx + tw - 190, ty + 50, "The path goes live on every server at once.", 260, { size: 14 }),
      box(690, 132, 278, 290, { fill: C.panel }),
      ...stats.map(([big, small], i) => [t(710, 182 + i * 86, big, { size: 26, weight: 700 }), t(710, 206 + i * 86, small, { size: 15, fill: C.ink2 })].join("\n")),
    ].join("\n"),
    "The new code was on production servers for five days before its first use.",
  );
}

function shadow() {
  const b = (x, y, w, h, label, sub, opt) => stage(x, y, w, h, label, sub, opt);
  return frame(
    "shadow",
    520,
    "Shadowing a payment without charging anyone twice",
    "A flow diagram of Uber's payment shadowing. A live request goes to the legacy system, which calls the payment provider for real and answers the customer. The request it sent and the response it received are recorded. A delayed copy of the same request goes to the new service, whose would-be request to the provider is compared with the recorded one; the recorded response is replayed to it, so the provider is never called a second time. Mismatches are fixed before any user is moved to the new service.",
    "How to shadow a payment",
    "Uber's method, 2019: the new service sees real requests, but the provider is only called once.",
    [
      t(32, 128, "LIVE PATH: UNCHANGED", { size: 13, fill: C.ink2, weight: 700 }),
      b(32, 142, 170, 76, "Customer request", "", {}),
      arrow(205, 180, 258, 180),
      b(262, 142, 200, 76, "Legacy system", "still decides", {}),
      arrow(465, 180, 518, 180),
      b(522, 142, 210, 76, "Payment provider", "called once, for real", {}),
      arrow(735, 180, 788, 180),
      b(792, 142, 176, 76, "Customer answered", "", {}),
      // record
      arrow(492, 184, 492, 268, { stroke: C.muted, dash: "4 4" }),
      b(392, 272, 200, 76, "Record", "the request sent and the response received", { tint: C.panel }),
      t(32, 392, "SHADOW PATH: NOBODY EXPOSED", { size: 13, fill: C.ink2, weight: 700 }),
      b(32, 406, 170, 76, "Delayed copy", "of the same request", { accent: C.ink2 }),
      arrow(205, 444, 258, 444, { stroke: C.blue }),
      b(262, 406, 200, 76, "New service", "builds its own request", { accent: C.blue, tint: C.blueTint }),
      arrow(465, 444, 518, 444, { stroke: C.blue }),
      b(522, 406, 210, 76, "Compare", "would-be request against the recorded one", { accent: C.blue, tint: C.blueTint }),
      arrow(735, 444, 788, 444, { stroke: C.blue }),
      b(792, 406, 176, 76, "Mismatches", "fixed before any user moves", { accent: C.blue, tint: C.blueTint }),
      arrow(560, 352, 600, 402, { stroke: C.muted, dash: "4 4" }),
      arrow(430, 352, 380, 402, { stroke: C.muted, dash: "4 4" }),
      t(608, 372, "recorded request, for comparison", { size: 13, fill: C.ink2 }),
      t(372, 372, "recorded response, replayed", { size: 13, fill: C.ink2, anchor: "end" }),
    ].join("\n"),
    "",
  );
}

function controls() {
  const rows = [
    ["A record of every change", "The commit and the pipeline run, written automatically"],
    ["Testing in proportion to the risk", "Test results attached to that run"],
    ["Approval by an authorised party", "Peer review the pipeline enforces; extra approvers where the rule asks"],
    ["Production kept separate from development", "Deployment only through the pipeline, with no standing human access"],
    ["A way back", "The previous image, kept by hash, and a rollback that is rehearsed"],
    ["An audit trail", "An unalterable log tying commit, review, tests and deployment together"],
  ];
  const y0 = 150;
  const rh = 58;
  const body = rows
    .map(([ask, give], i) => {
      const y = y0 + i * rh;
      return [
        box(32, y, 400, 46, { fill: C.panel }),
        para(48, y + 28, ask, 372, { size: 15, fill: C.ink, weight: 700 }),
        arrow(438, y + 23, 484, y + 23, { stroke: C.blue }),
        box(490, y, 478, 46, { fill: C.blueTint, stroke: C.blue }),
        para(506, y + (wrap(give, 450, 14).length > 1 ? 20 : 28), give, 450, { size: 14, fill: C.ink }),
      ].join("\n");
    })
    .join("\n");
  const yb = y0 + rows.length * rh + 12;
  return frame(
    "controls",
    yb + 118,
    "What the rules ask for, and what a pipeline produces",
    "Six requirements drawn from the rule texts, each matched to pipeline evidence: a record of every change is the commit and pipeline run; proportionate testing is the attached test results; approval by an authorised person is enforced peer review; separation of production is the absence of standing human access; a way back is the retained image and a rehearsed rollback; an audit trail is an unalterable log. No text read asks for a soak period, a release train or multi-day promotion.",
    "What the rules ask for",
    "Drawn from PCI DSS v4.0, the US FFIEC handbook, the EBA guidelines, the EU's DORA regulation and Singapore's MAS.",
    [
      t(32, 132, "THE RULE TEXTS ASK FOR", { size: 13, fill: C.ink2, weight: 700 }),
      t(490, 132, "A PIPELINE CAN PRODUCE, ON EVERY CHANGE", { size: 13, fill: C.ink2, weight: 700 }),
      body,
      box(32, yb, 936, 62, { fill: C.surface, stroke: C.ink2, dash: "5 4" }),
      t(50, yb + 26, "Not asked for in any text read", { size: 16, weight: 700 }),
      t(50, yb + 48, "A soak period. A release train. Promotion through environments over several days.", { size: 15, fill: C.ink2 }),
    ].join("\n"),
    "Approval stays. At every regulated firm that has published its design, named people still approve.",
  );
}

function start() {
  const steps = [
    ["Measure the three days", "How much is testing, and how much is waiting for a person?"],
    ["Put today's process in a pipeline", "Manual steps and all. Change nothing yet."],
    ["Give one team the whole job", "Build it, deploy it, carry the pager for it."],
    ["Ship the next risky change dark", "Behind a flag at 0%, then shadow, staff, one client."],
    ["Rehearse the way back", "Roll back on purpose. Let whoever is paged do it without asking."],
    ["Automate what has become boring", "One stage at a time, as the evidence builds."],
  ];
  const w = 300;
  const h = 172;
  const body = steps
    .map(([a, b], i) => {
      const x = 32 + (i % 3) * (w + 18);
      const y = 108 + Math.floor(i / 3) * (h + 18);
      return [
        box(x, y, w, h, { fill: C.blueTint, stroke: C.blue }),
        `<circle cx="${x + 30}" cy="${y + 32}" r="16" fill="${C.blue}"/>`,
        t(x + 30, y + 38, String(i + 1), { size: 17, fill: "#ffffff", weight: 700, anchor: "middle" }),
        para(x + 18, y + 78, a, w - 36, { size: 17, fill: C.ink, weight: 700 }),
        para(x + 18, y + 78 + paraHeight(a, w - 36, 17) + 4, b, w - 36, { size: 14 }),
      ].join("\n");
    })
    .join("\n");
  return frame(
    "start",
    510,
    "Six steps to begin",
    "Six steps in order. One: measure where the three days go. Two: put today's process in a pipeline, manual steps included. Three: give one team the whole job including the pager. Four: ship the next risky change dark behind a flag at zero percent. Five: rehearse the way back and let whoever is paged roll back without asking. Six: automate a stage once it has become boring.",
    "Where a fast follower starts",
    "Nothing here removes a control on day one.",
    body,
    "",
  );
}

const figures = {
  "00-release-train.svg": releaseTrain(),
  "01-where-the-wait-happens.svg": whereTheWait(),
  "02-exposure-ladder.svg": ladder(),
  "03-timeline.svg": timeline(),
  "04-one-mechanism.svg": oneMechanism(),
  "05-who-waits.svg": queue(),
  "06-published-ramps.svg": ramps(),
  "07-fca-findings.svg": fca(),
  "08-sixteen-days.svg": sixteenDays(),
  "09-three-rollbacks.svg": rollbacks(),
  "10-knight-capital.svg": knight(),
  "11-payment-shadowing.svg": shadow(),
  "12-what-the-rules-ask.svg": controls(),
  "13-where-to-start.svg": start(),
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
      console.error(`Stale: figures/${name}`);
      stale = true;
    }
  } else {
    writeFileSync(dest, svg);
    console.log(`Wrote figures/${name}`);
  }
}
if (stale) process.exitCode = 1;

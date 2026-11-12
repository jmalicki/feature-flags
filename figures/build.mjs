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
      ["2012", "Knight Capital: a reused flag and one stale server lose more than $460 million in about 45 minutes."],
      ["2013", "Netflix scores canaries automatically. Visual Studio Online goes down on a launch morning because of flags."],
      ["2014", "Visual Studio Online builds a first ring of volunteer accounts that takes every deployment first."],
      ["2015", "Facebook paper: ship code disabled, ramp it with Gatekeeper, canary the configuration too."],
      ["2016", "Facebook and OANDA study continuous deployment, including at an FX trading platform."],
    ]],
    ["Wider adoption and regulated industries", [
      ["2017", "Facebook's website moves to deploying continuously from the main branch."],
      ["2018", "Starling Bank releases to production up to five times a day. France's ACPR describes batched releases outside service hours."],
      ["2020", "Amazon documents its pipeline: one box, then waves, with bake times and automatic rollback."],
      ["2021", "The ACPR accepts automated change processes. The UK FCA's review of 23 firms: smaller, more frequent releases succeed more often."],
      ["2022", "Monzo, a bank, deploys more than 100 times a day and rolls automated rollback out across more than 2,100 services."],
      ["2024", "The US bank examiners' handbook mentions canary releases."],
      ["2025", "DORA's change rules apply in the EU; its standards permit testing in production as an approved exception."],
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
    "Twenty-five years of published practice",
    "A timeline from 2000 to 2025 in four bands: foundations in continuous integration and experimentation; the vocabulary of dark launches, flags and frequent deployment appearing from 2008 to 2011; scale reports, failures and the first studies from 2012 to 2016; and wider adoption, including regulated industries, from 2017 to 2025.",
    "Published accounts, 2000 to 2025",
    "Dates are when an event happened or a practice was first documented.",
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
    ["Slack", "2020", ["own staff", "2% canary", "10%", "25%", "50%", "75%", "100%"], "stage lengths not published"],
    ["Uber payment authorization", "2019", ["shadow", "employees", "0.25%", "1%", "5%", "100%"], "per payment method; lengths not published"],
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
    "Ramp stages that companies have published",
    "Seven published ramp schedules. Facebook's website in 2017: employees, two percent, one hundred percent in a few hours. Facebook's Android app in 2016: twenty, fifty, one hundred percent over three days. Amazon in 2020: one box, first Region, more Regions, all Regions over four to five business days with bake times. Azure DevOps: five tiers of about twenty-four hours. Slack in 2020: its own staff, a two percent canary, then ten, twenty-five, fifty, seventy-five and one hundred percent. Uber payment authorization in 2019: shadow, employees, a quarter of a percent, one percent, five percent, one hundred percent per payment method. Uber's ledger in 2020: one to one hundred percent within each country, starting with a country with few users.",
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
    para(50, 348, "Nearly 68,000 major changes, which generally received more oversight.", 284, { size: 14 }),
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
    para(710, 348, "The two figures have different denominators.", 240, { size: 14 }),
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
    "Source: Mark Mansour, Going faster with continuous delivery, Amazon Builders' Library, 2019. Measured more than ten years earlier.",
  );
}

function rollbacks() {
  const cards = [
    ["Traffic shift", "The previous version is still running, and traffic is routed back to it.", "Seconds to minutes", "Requires capacity to run two versions concurrently.", C.blue],
    ["Redeploy retained build", "The previous build is deployed again, identified by its hash.", "One deployment cycle", "Requires the build to be retained under an immutable identifier.", C.blue],
    ["Rebuild from source", "An earlier revision is checked out and built again.", "One build and one deployment cycle", "Produces the same binary only if the build is reproducible.", C.orange],
  ];
  const w = 300;
  const body = cards
    .map(([name, how, speed, catchIt, col], i) => {
      const x = 32 + i * (w + 18);
      return [
        box(x, 108, w, 268, { fill: col === C.blue ? C.blueTint : C.orangeTint, stroke: col }),
        t(x + 18, 142, name, { size: 20, weight: 700 }),
        para(x + 18, 172, how, w - 36, { size: 15, fill: C.ink }),
        t(x + 18, 246, "TIME TO RESTORE", { size: 12, fill: C.muted, weight: 700 }),
        t(x + 18, 268, speed, { size: 16, weight: 700 }),
        t(x + 18, 300, "CONSTRAINT", { size: 12, fill: C.muted, weight: 700 }),
        para(x + 18, 320, catchIt, w - 36, { size: 14 }),
      ].join("\n");
    })
    .join("\n");
  const none = [
    box(32, 398, 936, 92, { fill: C.panel }),
    t(50, 428, "Not reversed by rollback", { size: 17, weight: 700 }),
    para(50, 454, "Data written by the newer build, schema migrations, messages already sent, and payments already made. These require compatible data formats, comparison before cutover, and correcting ledger entries.", 900, { size: 15 }),
  ].join("\n");
  return frame(
    "rollbacks",
    530,
    "Rollback methods",
    "Three rollback methods. A traffic shift routes requests back to a previous version that is still running; it takes seconds to minutes and requires capacity for two versions. Redeploying the retained build takes one deployment cycle and requires the build to be kept under an immutable identifier. Rebuilding from source takes a build and a deployment and produces the same binary only if the build is reproducible. Rollback does not reverse data written, schema migrations, messages sent or payments made.",
    "Rollback methods",
    "The first two restore a build that has already run in production.",
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
    "Eight servers: seven received the new code and one kept old code. A timeline shows the new code deployed in stages from July 27, 2012 while its path stayed dormant, then activated on every server at the market open on 1 August, when a reused flag triggered the old code on the eighth server. The result was four million executions in 154 stocks in about 45 minutes and a loss of more than 460 million dollars.",
    "Knight Capital, August 1, 2012",
    "Staged deployment, single activation. Source: the SEC's order.",
    [
      t(sx, 132, "EIGHT ORDER-ROUTING SERVERS", { size: 13, fill: C.ink2, weight: 700 }),
      servers,
      para(sx, 254, "One server was missed. On it, the reused flag switched on code that had not been used since 2003.", 620, { size: 15 }),
      ln(tx, ty, tx + tw, ty, { stroke: C.line, sw: 3 }),
      ln(tx, ty, tx + tw - 60, ty, { stroke: C.blue, sw: 5 }),
      dot(tx, ty, 6, C.blue),
      t(tx, ty + 30, "July 27", { size: 15, weight: 700 }),
      para(tx, ty + 50, "Deployment begins, in stages over several days. Nothing uses the new path yet.", 250, { size: 14 }),
      dot(tx + tw - 60, ty, 8, C.orange),
      t(tx + tw - 60, ty + 30, "August 1, market open", { size: 15, weight: 700, anchor: "middle" }),
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

// Small caps-style section label used above rows and panels.
const label = (x, y, s, opt = {}) => t(x, y, s, { size: 13, fill: C.ink2, weight: 700, ...opt });
// A rounded chip with centred text.
const chip = (x, y, w, s, { fill = C.blueTint, stroke = C.blue, ink = C.ink, dash = "", h = 24, size = 12 } = {}) =>
  [box(x, y, w, h, { fill, stroke, r: h / 2, dash, sw: 1.2 }), t(x + w / 2, y + h / 2 + size * 0.36, s, { size, fill: ink, anchor: "middle" })].join("");

function deployAndRelease() {
  const y1 = 146;
  const y2 = 340;
  const days = [0, 1, 2, 3, 4].map((i) => 172 + i * 160);
  const rx = days[1];
  const rw = (968 - rx - 2 * 32) / 3;
  return frame(
    "deploy-release",
    620,
    "Separating deployment from release",
    "Two arrangements. On a release train, half a week of changes is batched, held for three days of promotion and soak, and then deployed and released to every user at once, so every change waits for the most cautious one. With deployment and release separated, code is deployed every day with its new behavior off. One behavior is then released on its own, first to no one, then to a small group, then to everyone, while the other changes proceed without waiting for it.",
    "Separating deployment from release",
    "On a train one act deploys and releases. Separated, each behavior is released on its own schedule.",
    [
      label(32, y1 - 16, "RELEASE TRAIN: DEPLOY AND RELEASE IN ONE ACT"),
      stage(32, y1, 220, 84, "Changes batched", "half a week of changes"),
      arrow(256, y1 + 42, 284, y1 + 42),
      stage(288, y1, 300, 84, "Promotion and soak", "three days, for every change on the train", { accent: C.orange, tint: C.orangeTint }),
      arrow(592, y1 + 42, 620, y1 + 42),
      stage(624, y1, 344, 84, "Deploy and release", "every user at once", { accent: C.orange, tint: C.orangeTint }),
      para(32, y1 + 116, "The caution a risky change deserves is applied to the whole train, and everything on the train waits for it.", 936, { size: 15 }),
      label(32, y2 - 16, "DEPLOYED DAILY, RELEASED SEPARATELY"),
      t(32, y2 + 34, "Deploy", { size: 16, weight: 700 }),
      t(32, y2 + 54, "every day", { size: 14, fill: C.ink2 }),
      ...days.map((x, i) => stage(x, y2, 148, 76, `Day ${i + 1}`, "deployed, new behavior off", { accent: C.blue, tint: C.surface })),
      t(32, y2 + 166, "Release", { size: 16, weight: 700 }),
      t(32, y2 + 186, "one behavior", { size: 14, fill: C.ink2 }),
      arrow(rx + 74, y2 + 80, rx + 74, y2 + 128, { stroke: C.blue, dash: "4 4" }),
      ...["No one", "Small group", "Everyone"].map((s, i) => {
        const x = rx + i * (rw + 32);
        return [
          stage(x, y2 + 132, rw, 60, s, "", { accent: C.blue, tint: C.blueTint }),
          i < 2 ? arrow(x + rw + 4, y2 + 162, x + rw + 28, y2 + 162, { stroke: C.blue }) : "",
        ].join("\n");
      }),
      para(rx, y2 + 226, "The wait applies to the one behavior that needs watching. The changes deployed on the other days proceed without waiting for it.", 968 - rx, { size: 15 }),
    ].join("\n"),
    "",
  );
}

function flagEvaluation() {
  const steps = ["Acceptance", "Submission", "Confirmation", "Returns", "Recalls", "Status inquiries", "Postings"];
  const w = 128;
  const gap = 6;
  const xs = steps.map((_, i) => 32 + i * (w + gap));
  const sw = xs[3] - gap / 2;
  const row = (y, subFor, styleFor) =>
    steps.map((s, i) => stage(xs[i], y, w, 100, s, subFor(i), styleFor(i))).join("\n");
  const ya = 146;
  const yb = 360;
  const switchLine = (y) =>
    [ln(sw, y - 22, sw, y + 112, { stroke: C.orange, sw: 2, dash: "5 4" }), t(sw + 6, y - 10, "flag switched", { size: 13, fill: C.orange, weight: 700 })].join("\n");
  return frame(
    "flag-eval",
    640,
    "Reading the flag once at acceptance",
    "A payment's life runs through acceptance, submission, confirmation, returns, recalls, status inquiries and postings. In the first row each step reads the flag again, so when the flag is switched after confirmation the later steps follow the other behavior and the payment is stranded between two behaviors. In the second row the flag is read once, at acceptance, and the decision is stored with the payment as payment.rail; every later step follows the stored decision, so switching the flag does not change this payment.",
    "Reading the flag once at acceptance",
    "One payment's life, with the flag switched partway through.",
    [
      label(32, ya - 30, "THE FLAG IS READ AT EVERY STEP"),
      switchLine(ya),
      row(ya, (i) => (i < 3 ? "reads the flag" : "now gets the other behavior"), (i) => (i < 3 ? { accent: C.line } : { accent: C.orange, tint: C.orangeTint })),
      para(32, ya + 136, "The payment is stranded between two behaviors.", 900, { size: 15, fill: C.ink }),
      label(32, yb - 30, "THE DECISION IS MADE ONCE, AT ACCEPTANCE, AND STORED"),
      switchLine(yb),
      row(yb, (i) => (i === 0 ? "reads the flag, stores the rail" : "follows the stored rail"), (i) => ({ accent: C.blue, tint: i === 0 ? C.blueTint : C.surface })),
      box(32, yb + 136, 936, 34, { fill: C.blueTint, stroke: C.blue }),
      t(48, yb + 158, "Payment record: payment.rail, written at acceptance", { size: 14, fill: C.ink }),
      ...xs.slice(1).map((x) => arrow(x + w / 2, yb + 134, x + w / 2, yb + 106, { stroke: C.blue, sw: 1.5 })),
      arrow(xs[0] + w / 2, yb + 104, xs[0] + w / 2, yb + 132, { stroke: C.blue, sw: 1.5 }),
      para(32, yb + 206, "Switching the flag changes which rail later payments get. This payment follows its stored rail for the rest of its life.", 936, { size: 15, fill: C.ink }),
    ].join("\n"),
    "",
  );
}

function dormantAndShadow() {
  const c = [
    [32, 190],
    [262, 200],
    [502, 210],
    [752, 216],
  ];
  const bx = (i, y, h, l, s, o) => stage(c[i][0], y, c[i][1], h, l, s, o);
  const ra = (i, y, o) => arrow(c[i][0] + c[i][1] + 4, y, c[i + 1][0] - 4, y, o);
  const ya = 140;
  const yb = 400;
  return frame(
    "dark",
    680,
    "Dormant code and a shadow run",
    "Two kinds of dark launch. Dormant: a live request goes to the current code and the user sees the current result; the new code is deployed behind a flag that is off, and nothing calls it. Shadow: a live request goes to the current code and the user sees the current result; a copy of the traffic also goes to the new code, its result is compared with the current code's result, and its output is then discarded without any user seeing it.",
    "Dormant code and a shadow run",
    "Both are dark launches: deployed to production, with no user seeing the new behavior.",
    [
      label(32, ya - 14, "DORMANT: DEPLOYED BEHIND A FLAG THAT IS OFF"),
      bx(0, ya, 70, "Live request", ""),
      ra(0, ya + 35),
      bx(1, ya, 70, "Current code", ""),
      ra(1, ya + 35),
      bx(2, ya, 70, "User", "sees the current result"),
      bx(1, ya + 110, 70, "New code", "merged, built, deployed", { accent: C.ink2, tint: C.panel }),
      chip(c[2][0], ya + 133, 150, "flag off", { fill: C.panel, stroke: C.ink2, dash: "4 3" }),
      t(c[2][0] + 164, ya + 150, "nothing calls it", { size: 14, fill: C.ink2 }),
      label(32, yb - 14, "SHADOW: REAL TRAFFIC THROUGH THE NEW CODE, OUTPUT DISCARDED"),
      bx(0, yb, 70, "Live request", ""),
      ra(0, yb + 35),
      bx(1, yb, 70, "Current code", ""),
      ra(1, yb + 35),
      bx(2, yb, 70, "User", "sees the current result"),
      `<path d="M ${c[0][0] + 95} ${yb + 74} V ${yb + 165} H ${c[1][0] - 4}" fill="none" stroke="${C.blue}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"/>`,
      arrow(c[1][0] - 12, yb + 165, c[1][0] - 4, yb + 165, { stroke: C.blue }),
      t(c[0][0] + 104, yb + 154, "copy of the traffic", { size: 13, fill: C.ink2 }),
      bx(1, yb + 130, 70, "New code", "runs on the copy", { accent: C.blue, tint: C.blueTint }),
      ra(1, yb + 165, { stroke: C.blue }),
      bx(2, yb + 130, 70, "Compare", "with the current result", { accent: C.blue, tint: C.blueTint }),
      ra(2, yb + 165, { stroke: C.blue }),
      bx(3, yb + 130, 70, "Discard", "no user sees the output", { accent: C.ink2, tint: C.panel }),
      arrow(c[1][0] + 170, yb + 74, c[2][0] + 30, yb + 126, { stroke: C.muted, dash: "4 4" }),
      t(c[1][0] + 196, yb + 96, "current result", { size: 13, fill: C.ink2 }),
    ].join("\n"),
    "",
  );
}

function flagLifecycle() {
  const xs = [32, 272, 512, 752];
  const w = 216;
  const y = 140;
  const names = [
    ["Created", "with an owner and an expiry date"],
    ["Ramped", "on for some users, off for others"],
    ["At 100%", "on for every user"],
    ["Removed", "flag and old path deleted"],
  ];
  const by = 300;
  const oy = 420;
  return frame(
    "lifecycle",
    560,
    "The life of a release flag",
    "A release flag is created with an owner and an expiry date, ramped so that it is on for some users and off for others, reaches 100 percent, and is removed together with the old path. The build passes until the expiry date approaches, warns as it approaches, and fails once it has passed. While the flag is ramped, production runs both paths. From the day the flag reaches everyone, the off path is no longer exercised, and switching it off is an untested change.",
    "The life of a release flag",
    "Rules the build can enforce, and what happens to the off path after 100%.",
    [
      ...names.map(([a, b], i) =>
        [stage(xs[i], y, w, 84, a, b, { accent: i === 3 ? C.ink2 : C.blue, tint: i === 3 ? C.panel : C.blueTint }), i < 3 ? arrow(xs[i] + w + 4, y + 42, xs[i + 1] - 4, y + 42, { stroke: C.blue }) : ""].join("\n"),
      ),
      label(32, by - 18, "THE BUILD, AGAINST THE FLAG'S EXPIRY DATE"),
      hbar(32, by, 468, 18, C.blueTint),
      t(40, by + 40, "passes", { size: 14, fill: C.ink2 }),
      hbar(504, by, 256, 18, C.orangeTint),
      t(510, by + 40, "warns as the date approaches", { size: 14, fill: C.ink2 }),
      hbar(768, by, 200, 18, C.orange),
      ln(764, by - 8, 764, by + 26, { stroke: C.ink, sw: 2 }),
      t(774, by + 40, "fails once it has passed", { size: 14, fill: C.ink2 }),
      t(764, by - 14, "expiry date", { size: 13, fill: C.ink, anchor: "middle" }),
      label(32, oy - 18, "THE OFF PATH"),
      ln(xs[1], oy + 9, xs[2] - 8, oy + 9, { stroke: C.blue, sw: 5 }),
      para(xs[1], oy + 40, "Production runs both paths; every nearby change must work in both states.", 228, { size: 14 }),
      ln(xs[2], oy + 9, 968, oy + 9, { stroke: C.orange, sw: 5, dash: "8 6" }),
      para(xs[2], oy + 40, "No longer exercised. Switching the flag off is now an untested change.", 450, { size: 14 }),
    ].join("\n"),
    "Kill switches intended to be permanent are registered as permanent and are exempt from expiry.",
  );
}

function paymentStages() {
  const stages = [
    ["1. Dark", "None. The code ships disabled; the build bakes on one node per site, and end-of-day runs it on its smallest partition first.", "Through a daily peak", "Checks that the disabled path behaves identically to yesterday's build."],
    ["2. Shadow", "None. For all traffic, the rule records the rail it would choose and the message it would build, and sends nothing.", "At least seven days, including a weekend and a payroll peak", "Stops on any mismatch nobody can explain."],
    ["3. Synthetic client", "Test accounts in production send small real payments over B to the firm's accounts at other banks.", "Two business days and a weekend", "Exercises acceptance, rejection, a timeout, a recall and reconciliation; the flag is switched off mid-stream."],
    ["4. One consenting client", "One client, one payment type, a low cap per payment and per day.", "Five business days and the weekend they span", "Stops on any duplicate, any reconciliation break, or any outcome still unknown after an hour."],
    ["5. Widen", "More clients first, then a higher cap. No single step does both.", "A full reconciliation cycle for each step, one of them across a month-end", ""],
  ];
  const w = 180;
  const gap = 9;
  const iw = w - 24;
  const rows = [
    ["EXPOSURE", 1],
    ["HOLD", 2],
    ["STOPS ON OR CHECKS", 3],
  ];
  const y0 = 108;
  const headH = 58;
  const rowH = rows.map(([, k]) => Math.max(...stages.map((s) => paraHeight(s[k] || "-", iw, 14))) + 40);
  const colH = headH + rowH.reduce((a, b) => a + b, 0) + 8;
  const body = stages
    .map((s, i) => {
      const x = 32 + i * (w + gap);
      const dark = i < 2;
      let y = y0 + headH;
      const cells = rows.map(([name, k], r) => {
        const out = [
          r > 0 ? ln(x + 12, y - 6, x + w - 12, y - 6, { stroke: C.line, sw: 1 }) : "",
          t(x + 12, y + 14, name, { size: 11, fill: C.muted, weight: 700 }),
          s[k] ? para(x + 12, y + 34, s[k], iw, { size: 14, fill: C.ink }) : t(x + 12, y + 34, "None stated", { size: 14, fill: C.muted }),
        ].join("\n");
        y += rowH[r];
        return out;
      });
      return [
        box(x, y0, w, colH, { fill: dark ? C.panel : C.blueTint, stroke: dark ? C.ink2 : C.blue, dash: dark ? "5 4" : "" }),
        para(x + 12, y0 + 28, s[0], iw, { size: 16, fill: C.ink, weight: 700 }),
        ...cells,
      ].join("\n");
    })
    .join("\n");
  const by = y0 + colH + 30;
  return frame(
    "pay-stages",
    by + 70,
    "Stages of the instant-rail rollout",
    "Five stages. Dark: no exposure; the code ships disabled, the build bakes on one node per site through a daily peak, and end-of-day runs the new code on its smallest partition first; the check is that the disabled path behaves identically to yesterday's build. Shadow: no exposure; for all traffic the rule records the rail it would choose and sends nothing; held at least seven days including a weekend and a payroll peak; stops on any mismatch nobody can explain. Synthetic client: test accounts send small real payments over B, with a timeout, a recall and reconciliation exercised and the flag switched off mid-stream; two business days and a weekend. One consenting client: one payment type with low caps; five business days and the weekend they span; stops on any duplicate, reconciliation break or outcome unknown after an hour. Widen: more clients first, then a higher cap, never both in one step; each step held for a full reconciliation cycle, one across a month-end. Four to eight weeks in total.",
    "Stages of the instant-rail rollout",
    "Moving payments below a threshold from rail A to rail B. Durations are the author's judgment.",
    [
      body,
      ln(32, by, 968, by, { stroke: C.line, sw: 1.5 }),
      ln(32, by - 6, 32, by + 6, { stroke: C.muted, sw: 1.5 }),
      ln(968, by - 6, 968, by + 6, { stroke: C.muted, sw: 1.5 }),
      t(500, by + 26, "Four to eight weeks from first deployment to full release", { size: 15, fill: C.ink, anchor: "middle" }),
    ].join("\n"),
    "",
  );
}

function flagOff() {
  const sx = 520;
  const yb = 180;
  const ya = 320;
  const x0 = 210;
  const sent = [236, 276, 316, 356, 396, 436, 476];
  const windows = [370, 660, 900];
  return frame(
    "flag-off",
    600,
    "Switching the instant-rail flag off",
    "Two rails over time, with the flag switched off partway. Payments already sent on rail B before the switch are final and none is recalled. After the switch, new payments go to rail A from its next submission window. The exposure is bounded by the caps: the daily cap, multiplied by the number of clients enabled, multiplied by the number of days a fault goes unnoticed. A switch after A's last cut-off of the day leaves those payments waiting until the next business day.",
    "Switching the instant-rail flag off",
    "What changes for payments sent before the switch and for new payments after it.",
    [
      ln(sx, 118, sx, ya + 70, { stroke: C.orange, sw: 2, dash: "5 4" }),
      t(sx, 112, "flag switched off", { size: 14, fill: C.orange, weight: 700, anchor: "middle" }),
      t(32, yb + 6, "Rail B", { size: 17, weight: 700 }),
      t(32, yb + 28, "instant, final within seconds", { size: 13, fill: C.ink2 }),
      ln(x0, yb, 968, yb, { stroke: C.line, sw: 2 }),
      ...sent.map((x) => dot(x, yb, 8, C.blue)),
      para(x0 + 20, yb + 36, "Sent on B before the switch: final, and none is recalled", 290, { size: 14, fill: C.ink }),
      t(sx + 24, yb + 6, "no new payments on B", { size: 14, fill: C.ink2 }),
      t(32, ya + 6, "Rail A", { size: 17, weight: 700 }),
      t(32, ya + 28, "batch clearing", { size: 13, fill: C.ink2 }),
      ln(x0, ya, 968, ya, { stroke: C.line, sw: 2 }),
      ...windows.map((x) => box(x - 5, ya - 18, 10, 36, { fill: C.ink2, r: 2 })),
      t(windows[0], ya - 26, "submission window", { size: 12, fill: C.muted, anchor: "middle" }),
      t(windows[1], ya - 26, "next submission window", { size: 12, fill: C.muted, anchor: "middle" }),
      ...[548, 580, 612].map((x) => `<circle cx="${x}" cy="${ya}" r="7" fill="${C.surface}" stroke="${C.ink2}" stroke-width="2"/>`),
      arrow(624, ya, windows[1] - 10, ya, { stroke: C.ink2 }),
      para(sx + 24, ya + 40, "New payments go to A from its next submission window. After A's last cut-off of the day, they wait until the next business day.", 420, { size: 14, fill: C.ink }),
      box(32, 448, 936, 100, { fill: C.panel }),
      t(52, 478, "Exposure while a fault goes unnoticed is bounded by the caps", { size: 16, weight: 700 }),
      t(52, 516, "daily cap  ×  number of clients enabled  ×  days the fault goes unnoticed", { size: 17, fill: C.ink }),
    ].join("\n"),
    "",
  );
}

function flagChangeClasses() {
  const y = 150;
  const h = 118;
  const steps = [432, 560, 688];
  const sw = 116;
  return frame(
    "flag-changes",
    560,
    "Change classes for a flag",
    "How flag changes are classified. The code that introduces a flag goes through normal review and deployment. The ramp plan, with its stages, holds, population, caps and stop conditions, is approved once. Each step within the plan is a standard change, executed under dual control and logged; a step outside the plan is a normal change. Switching the flag off and rolling back to the previous build are pre-authorized at any point: the on-call engineer acts without asking and the action is reviewed afterwards. The state of every flag on any given date can be produced as evidence.",
    "Change classes for a flag",
    "Each kind of flag change, and the change class it is handled under.",
    [
      stage(32, y, 180, h, "Code that introduces the flag", "normal review and deployment"),
      arrow(216, y + h / 2, 228, y + h / 2),
      stage(232, y, 180, h, "Ramp plan", "stages, holds, population, caps and stop conditions: approved once", { accent: C.blue, tint: C.blueTint }),
      arrow(416, y + h / 2, 428, y + h / 2),
      ...steps.map((x, i) => [stage(x, y, sw, h, `Step ${i + 1}`, "standard change, dual control, logged", { accent: C.blue, tint: C.surface }), arrow(x + sw + 2, y + h / 2, x + 128 - 4, y + h / 2, { stroke: C.blue })].join("\n")),
      stage(816, y, 152, h, "Step outside the plan", "normal change", { accent: C.orange, tint: C.orangeTint }),
      `<path d="M ${steps[0]} ${y - 12} V ${y - 20} H ${steps[2] + sw} V ${y - 12}" fill="none" stroke="${C.blue}" stroke-width="1.5"/>`,
      t((steps[0] + steps[2] + sw) / 2, y - 28, "within the approved plan", { size: 13, fill: C.ink2, anchor: "middle" }),
      box(232, 310, 736, 80, { fill: C.blueTint, stroke: C.blue }),
      t(250, 340, "Switching the flag off, or rolling back to the previous build", { size: 16, weight: 700 }),
      t(250, 366, "Pre-authorized at any point. The on-call engineer acts without asking, and the action is reviewed afterwards.", { size: 14, fill: C.ink2 }),
      box(32, 414, 936, 64, { fill: C.panel }),
      t(50, 442, "Evidence", { size: 16, weight: 700 }),
      t(50, 464, "The state of every flag on any given date can be produced.", { size: 14, fill: C.ink2 }),
    ].join("\n"),
    "Raising every step as a normal change with three days' notice makes the ramp slower than the train.",
  );
}

function dataRollbackReach() {
  const y = 190;
  const h = 80;
  const tx = (i) => 186 + i * 52;
  const fx = 720;
  const mx = 862;
  return frame(
    "data-rollback",
    470,
    "What a table rollback restores",
    "A source table feeds a chain of ten derived tables, a feature computed from the last of them, and two models trained on that feature. Rolling back the source table, by moving an Iceberg snapshot pointer back or by a Delta Lake restore, returns only that table to its earlier version. The ten derived tables, the feature and the two models still hold data built from the bad version until each is recomputed.",
    "What a table rollback restores",
    "Restoring the source table leaves everything built from the bad version unchanged.",
    [
      t(186, y - 18, "TEN DERIVED TABLES", { size: 13, fill: C.ink2, weight: 700 }),
      stage(32, y, 128, h, "Source table", "rolled back", { accent: C.blue, tint: C.blueTint }),
      arrow(162, y + h / 2, 182, y + h / 2),
      ...Array.from({ length: 10 }, (_, i) =>
        [
          box(tx(i), y, 44, h, { fill: C.orangeTint, stroke: C.orange }),
          t(tx(i) + 22, y + h / 2 + 6, String(i + 1), { size: 16, weight: 700, anchor: "middle" }),
          i < 9 ? arrow(tx(i) + 45, y + h / 2, tx(i) + 51, y + h / 2, { sw: 1.5 }) : "",
        ].join(""),
      ),
      arrow(tx(9) + 46, y + h / 2, fx - 4, y + h / 2),
      t(fx, y - 18, "FEATURE", { size: 13, fill: C.ink2, weight: 700 }),
      stage(fx, y, 116, h, "Feature", "", { accent: C.orange, tint: C.orangeTint }),
      t(mx, y - 18, "MODELS", { size: 13, fill: C.ink2, weight: 700 }),
      arrow(fx + 118, y + 20, mx - 4, y + 20),
      arrow(fx + 118, y + 60, mx - 4, y + 60),
      box(mx, y, 106, 36, { fill: C.orangeTint, stroke: C.orange }),
      t(mx + 53, y + 24, "Model", { size: 15, weight: 700, anchor: "middle" }),
      box(mx, y + 44, 106, 36, { fill: C.orangeTint, stroke: C.orange }),
      t(mx + 53, y + 68, "Model", { size: 15, weight: 700, anchor: "middle" }),
      `<path d="M ${tx(0)} ${y + h + 14} V ${y + h + 22} H ${mx + 106} V ${y + h + 14}" fill="none" stroke="${C.orange}" stroke-width="2"/>`,
      t(tx(0), y + h + 46, "Each still holds data built from the bad version until it is recomputed", { size: 15, fill: C.ink }),
      box(32, 360, 330, 76, { fill: C.panel }),
      para(48, 386, "Rollback: Iceberg moves a snapshot pointer back, or Delta Lake restores an earlier version", 300, { size: 14, fill: C.ink }),
      arrow(96, 356, 96, y + h + 4, { stroke: C.blue, sw: 2.5 }),
    ].join("\n"),
    "",
  );
}

function twoCopies() {
  const steps = [
    ["1. Expand", "add the new column or table", [["written", "read", "authoritative"], "added, unused"], ""],
    ["2. Keep both populated", "trigger, dual writes or log replay", [["written", "read", "authoritative"], ["written"]], "may gate writes to the new copy"],
    ["3. Backfill", "copy historical rows, throttled", [["written", "read", "authoritative"], ["written"]], ""],
    ["4. Compare reads", "the old result is still returned", [["written", "read", "authoritative"], ["written", "compared"]], ""],
    ["5. Switch reads", "by flag or percentage", [["written", "", "authoritative"], ["written", "read"]], "moves reads to the new copy"],
    ["6. Make new copy authoritative", "a reverse sync keeps rollback possible", [["copied back"], ["written", "read", "authoritative"]], "chooses the authoritative store"],
    ["7. Contract", "delete the old copy after enough releases", ["writes stop, then deleted", ["written", "read", "authoritative"]], ""],
  ];
  const cols = { step: 32, old: 286, new: 552, flag: 818 };
  const slots = [
    [0, 80],
    [86, 76],
    [168, 92],
  ];
  const y0 = 140;
  const rh = 64;
  const cell = (x, y, v, isNew) =>
    typeof v === "string"
      ? t(x, y + 30, v, { size: 14, fill: C.muted })
      : v
          .map((s, k) => {
            if (!s) return "";
            const [dx, w] = slots[k];
            const auth = s === "authoritative";
            const cmp = s === "compared" || s === "copied back";
            const col = isNew ? C.blue : C.ink2;
            return chip(x + dx, y + 14, w, s, { fill: auth ? col : isNew ? C.blueTint : C.panel, stroke: col, ink: auth ? "#ffffff" : C.ink, dash: cmp ? "4 3" : "" });
          })
          .join("");
  return frame(
    "two-copies",
    y0 + steps.length * rh + 60,
    "Two copies of a column or table",
    "Seven steps for running two copies of a column or table, showing for each step which copy is written, read and authoritative. Expand: the old copy is written, read and authoritative; the new copy is added and unused. Keep both populated: both copies are written, and a flag may gate writes to the new copy. Backfill: historical rows are written to the new copy. Compare reads: the new copy is read for comparison while the old result is still returned. Switch reads: a flag or percentage moves reads to the new copy, while the old copy remains authoritative. Make the new copy authoritative: the new copy is written, read and authoritative, a flag chooses the authoritative store, and changes are copied back to the old copy so rollback remains possible. Contract: writes to the old copy stop, and it is deleted after enough releases.",
    "Two copies of a column or table",
    "At each step, which copy is written, read and authoritative, and what the flag controls.",
    [
      label(cols.step, y0 - 14, "STEP"),
      label(cols.old, y0 - 14, "OLD COPY"),
      label(cols.new, y0 - 14, "NEW COPY"),
      label(cols.flag, y0 - 14, "WHAT THE FLAG DOES"),
      ...steps.map(([name, sub, [o, n], flag], i) => {
        const y = y0 + i * rh;
        return [
          ln(32, y, 968, y, { stroke: C.line, sw: 1 }),
          t(cols.step, y + 26, name, { size: 16, weight: 700 }),
          t(cols.step, y + 46, sub, { size: 13, fill: C.ink2 }),
          cell(cols.old, y, o, false),
          cell(cols.new, y, n, true),
          flag ? para(cols.flag, y + 24, flag, 150, { size: 13, fill: C.ink }) : "",
        ].join("\n");
      }),
      ln(32, y0 + steps.length * rh, 968, y0 + steps.length * rh, { stroke: C.line, sw: 1 }),
    ].join("\n"),
    "A dashed outline marks a copy read only for comparison (step 4) or kept in sync from the new copy (step 6).",
  );
}

function writeAuditPublish() {
  const tx = [56, 238, 420];
  return frame(
    "wap",
    530,
    "Write, audit, publish for a chain of tables",
    "Write, audit, publish for a chain of three tables. The v2 tables are written in a staging area that consumers cannot see, and each is checked there. One commit then publishes all the v2 tables together, and aborts if a final check fails. The v1 tables stay readable throughout, and consumers cut over from v1 to v2 one at a time, before the v1 deprecation date. Publishing several tables in one commit follows Databricks documentation.",
    "Write, audit, publish for a chain of tables",
    "Each v2 table is written and checked in staging, then all are published in one commit.",
    [
      label(32, 128, "STAGING: NOT VISIBLE TO CONSUMERS"),
      box(32, 140, 570, 180, { fill: C.panel, stroke: C.ink2, dash: "5 4" }),
      ...tx.map((x, i) =>
        [
          stage(x, 160, 160, 60, `Table ${i + 1} v2`, "", { accent: C.blue, tint: C.blueTint }),
          i < 2 ? arrow(x + 163, 190, tx[i + 1] - 4, 190, { stroke: C.blue }) : "",
          ln(x + 80, 222, x + 80, 252, { stroke: C.muted, sw: 1.5 }),
          chip(x + 10, 254, 140, "checks on table " + (i + 1), { fill: C.surface, stroke: C.blue }),
        ].join("\n"),
      ),
      t(52, 306, "Audit: each v2 table is checked before anything is published", { size: 13, fill: C.ink2 }),
      arrow(606, 230, 630, 230, { stroke: C.blue }),
      stage(634, 140, 150, 180, "Publish together", "one commit for all v2 tables; aborts if a final check fails", { accent: C.blue, tint: C.blueTint }),
      arrow(788, 230, 812, 230, { stroke: C.blue }),
      stage(816, 140, 152, 180, "Consumers", "cut over to v2 one at a time, before the v1 deprecation date", {}),
      label(32, 378, "V1 TABLES: READABLE THROUGHOUT"),
      ...tx.map((x, i) => stage(x - 24, 392, 160, 52, `Table ${i + 1} v1`, "", { accent: C.ink2, tint: C.panel })),
      `<path d="M 548 418 H 892 V 324" fill="none" stroke="${C.muted}" stroke-width="2" stroke-dasharray="4 4" stroke-linecap="round"/>`,
      arrow(892, 334, 892, 324, { stroke: C.muted }),
      t(560, 410, "consumers read v1 until they cut over", { size: 13, fill: C.ink2 }),
    ].join("\n"),
    "Publishing several tables in one commit follows Databricks documentation for multi-table transactions.",
  );
}

function streamRebuild() {
  return frame(
    "kreps",
    500,
    "Rebuilding a stream job's output",
    "Jay Kreps's 2014 procedure for changing the logic of a stream job. The log holds the retained data. Job v1, with the current logic, writes table v1. A second instance, job v2, runs the new logic from the beginning of the retained data and writes table v2. The application reads table v1 until job v2 has caught up, then switches to reading table v2. While both tables exist, pointing the application back at table v1 reverts the change. The old job is then stopped and the old table deleted.",
    "Rebuilding a stream job's output",
    "In Jay Kreps's 2014 procedure, a second job rebuilds the output from the log into a new table.",
    [
      stage(32, 130, 160, 286, "Log", "retained data; a job can rebuild only from what the log still holds", { accent: C.ink2, tint: C.panel }),
      arrow(196, 180, 246, 180),
      stage(250, 140, 190, 80, "Job v1", "current logic"),
      arrow(444, 180, 490, 180),
      stage(494, 140, 170, 80, "Table v1", "", { accent: C.ink2, tint: C.panel }),
      arrow(196, 360, 246, 360, { stroke: C.blue }),
      stage(250, 320, 190, 96, "Job v2", "new logic, run from the beginning of the retained data", { accent: C.blue, tint: C.blueTint }),
      arrow(444, 360, 490, 360, { stroke: C.blue }),
      stage(494, 320, 170, 80, "Table v2", "", { accent: C.blue, tint: C.blueTint }),
      stage(798, 230, 170, 80, "Application", "reads one table at a time"),
      arrow(668, 186, 794, 250, { stroke: C.muted, dash: "5 4" }),
      t(690, 172, "read until the switch;", { size: 13, fill: C.ink2 }),
      t(690, 188, "pointing back here reverts the change", { size: 13, fill: C.ink2 }),
      arrow(668, 354, 794, 292, { stroke: C.blue, sw: 2.5 }),
      t(690, 370, "read once job v2", { size: 13, fill: C.ink2 }),
      t(690, 386, "has caught up", { size: 13, fill: C.ink2 }),
    ].join("\n"),
    "After the switch, the old job is stopped and the old table deleted.",
  );
}

function featureHistory() {
  const xs = [32, 274, 516, 758];
  const w = 210;
  const row = (y, items, accent, tint) =>
    items.map(([a, b], i) => [stage(xs[i], y, w, 104, a, b, i === 3 ? {} : { accent, tint }), i < 3 ? arrow(xs[i] + w + 4, y + 52, xs[i + 1] - 4, y + 52, { stroke: accent }) : ""].join("\n")).join("\n");
  return frame(
    "feature-history",
    540,
    "Two routes to history for a v2 feature",
    "Two routes to the history a v2 feature needs before a model can be trained on it. Backfill: history from an archive is recomputed in a batch backfill under the v2 logic with point-in-time joins, and an online-offline consistency check then measures the mismatch rate against values served online; the backfill is a second code path. Logging: the v2 feature is computed at serving time, its values are logged, and history accumulates; training data then matches what was served, but no model can be trained until the history exists, and a 90-day aggregate needs 90 days of it.",
    "Two routes to history for a v2 feature",
    "A model cannot be trained on a v2 feature until the feature has history.",
    [
      label(32, 128, "BACKFILL"),
      row(140, [["Archive", "history the stream no longer holds"], ["Batch backfill", "under the v2 logic, with point-in-time joins"], ["Consistency check", "offline values compared with those served online; mismatch rate reported"], ["Training data", "for a model on v2"]], C.blue, C.blueTint),
      para(32, 272, "The backfill is a second code path, so its values can differ from those served online, and the gap is measured.", 936, { size: 14, fill: C.ink }),
      label(32, 332, "LOGGING AT SERVING TIME"),
      row(344, [["Online serving", "v2 computed at serving time"], ["Feature logging", "values logged at serving time"], ["Accumulated history", "a 90-day aggregate needs 90 days of logs"], ["Training data", "for a model on v2"]], C.blue, C.blueTint),
      para(32, 476, "Training uses the values that were served, so there is no skew, but no model can be trained until the history has accumulated.", 936, { size: 14, fill: C.ink }),
    ].join("\n"),
    "",
  );
}

function threeArm() {
  const arms = [
    ["Control", "model 1 only; baseline and safety net", [true, false], "Uses model 1"],
    ["Treatment 1", "computes both models", [true, true], "Uses model 1"],
    ["Treatment 2", "computes both models", [true, true], "Uses model 2"],
  ];
  const y0 = 140;
  const rh = 100;
  return frame(
    "three-arm",
    y0 + 3 * rh + 140,
    "Booking.com's three-arm test of two models",
    "Booking.com's design for comparing two models. The control arm computes only model 1, the current baseline, and uses its output; it is also the safety net. Treatment 1 and treatment 2 both compute model 1 and model 2, so they carry the same computational load and latency drops out as a confounder; treatment 1 uses the output of model 1 and treatment 2 the output of model 2. The analysis covers only the subjects for whom the two models disagree. Computing both models doubles inference and feature-fetching cost in the treatment arms.",
    "Booking.com's three-arm test of two models",
    "The control arm runs the current model; each treatment arm computes both models and uses one.",
    [
      ...arms.map(([name, sub, [m1, m2], act], i) => {
        const y = y0 + i * rh;
        const acts2 = act.endsWith("2");
        return [
          stage(32, y, 210, 76, name, sub, { accent: i ? C.blue : C.ink2, tint: i ? C.blueTint : C.panel }),
          arrow(246, y + 38, 272, y + 38),
          m1 ? stage(276, y, 150, 76, "Model 1", "computed", { accent: acts2 ? C.line : C.ink2 }) : "",
          m2 ? stage(440, y, 150, 76, "Model 2", "computed", { accent: acts2 ? C.blue : C.line }) : "",
          arrow(m2 ? 594 : 430, y + 38, 646, y + 38, { stroke: acts2 ? C.blue : C.ink2 }),
          stage(650, y, 180, 76, act, "", { accent: acts2 ? C.blue : C.ink2, tint: acts2 ? C.blueTint : C.surface }),
        ].join("\n");
      }),
      `<path d="M 848 ${y0 + rh} H 860 V ${y0 + 3 * rh - 24} H 848" fill="none" stroke="${C.blue}" stroke-width="2"/>`,
      para(872, y0 + rh + 24, "Same computational load in both arms", 96, { size: 13, fill: C.ink }),
      box(32, y0 + 3 * rh + 4, 936, 76, { fill: C.blueTint, stroke: C.blue }),
      t(52, y0 + 3 * rh + 34, "Analysis", { size: 16, weight: 700 }),
      t(52, y0 + 3 * rh + 58, "Only the subjects for whom model 1 and model 2 disagree are compared.", { size: 15, fill: C.ink }),
    ].join("\n"),
    "Computing both models doubles inference and feature-fetching cost in the treatment arms.",
  );
}

function workedLanes() {
  const lanes = ["transactions table", "Ten derived tables", "Feature store", "Model A", "Model B"];
  // [name, detail, first lane, last lane, basis]; basis: "doc", "vendor" or "judgment".
  const steps = [
    ["Add the new columns", "merchant_id and merchant_category_v2, beside the old column", 0, 0, "doc"],
    ["Find who reads the ten tables", "lineage and usage logs; the owners review the change", 1, 1, "doc"],
    ["Build a v2 of each derived table", "alongside v1, under a versioned name", 1, 1, "doc"],
    ["Backfill the v2 tables", "month by month, in dependency order", 1, 1, "doc"],
    ["Check each v2 table, then publish", "compared with v1 on the columns that should not change", 1, 1, "vendor"],
    ["Add merchant_risk_30d_v2", "served online, unread until online and offline values agree", 2, 2, "judgment"],
    ["Train B, and retrain A on the same dates", "each model pinned to its own features", 3, 4, "doc"],
    ["Shadow model B", "scores live payments and acts on none, for about two weeks", 4, 4, "judgment"],
    ["Run the three-arm experiment", "model A alone in control; size capped", 3, 4, "judgment"],
    ["Ramp up model B", "model A as the fallback; promote once fraud labels mature", 3, 4, "judgment"],
    ["Remove the old chain", "v1 feature, v1 tables, then the old column", 0, 2, "doc"],
  ];
  const lx = 488;
  const lw = 96;
  const y0 = 150;
  const rh = 50;
  const style = {
    doc: { fill: C.blueTint, stroke: C.blue, dash: "" },
    vendor: { fill: C.panel, stroke: C.ink2, dash: "3 3" },
    judgment: { fill: C.orangeTint, stroke: C.orange, dash: "6 3" },
  };
  const ly = y0 + steps.length * rh + 26;
  const legend = [
    ["doc", "Published practice"],
    ["vendor", "Rests partly on vendor documentation"],
    ["judgment", "Includes a hold or limit set by the author"],
  ];
  return frame(
    "worked-lanes",
    ly + 116,
    "Worked example from a source table to two models",
    "A swimlane of the worked example's eleven steps, with lanes for the transactions table, the ten derived tables, the feature store, model A and model B. The new columns are added to the transactions table. In the derived tables lane, the team finds who reads the ten tables, builds and backfills a v2 of each, and checks each before publishing; publishing all ten together rests partly on vendor documentation. The v2 feature is added to the feature store with no model reading it. Model B is trained and model A retrained on the same dates, model B is shadowed, the three-arm experiment runs, and model B is ramped up with model A as the fallback. Finally the old chain is removed from the feature store, the derived tables and the transactions table. The feature, shadow, experiment and ramp steps include a hold or limit set by the author.",
    "Worked example: from a source table to two models",
    "Each step sits under the part of the system it changes.",
    [
      ...lanes.map((l, i) => [box(lx + i * lw + 2, y0 - 46, lw - 4, steps.length * rh + 52, { fill: i % 2 ? C.surface : C.panel, r: 6 }), para(lx + i * lw + lw / 2, y0 - 26, l, lw - 12, { size: 12, fill: C.ink2, weight: 700, anchor: "middle", gap: 1.2 })].join("\n")),
      ...steps.map(([name, detail, a, b, basis], i) => {
        const y = y0 + i * rh;
        const s = style[basis];
        return [
          i ? ln(32, y, lx - 8, y, { stroke: C.line, sw: 1 }) : "",
          t(32, y + 22, `${i + 1}.`, { size: 15, weight: 700 }),
          t(58, y + 22, name, { size: 15, weight: 700 }),
          t(58, y + 40, detail, { size: 13, fill: C.ink2 }),
          box(lx + a * lw + 8, y + 10, (b - a + 1) * lw - 16, 30, { fill: s.fill, stroke: s.stroke, r: 6, dash: s.dash }),
          t(lx + ((a + b + 1) * lw) / 2, y + 30, String(i + 1), { size: 14, weight: 700, anchor: "middle" }),
        ].join("\n");
      }),
      ...legend.map(([k, s], i) => {
        const y = ly + i * 28;
        const st = style[k];
        return [box(32, y, 40, 20, { fill: st.fill, stroke: st.stroke, r: 5, dash: st.dash }), t(84, y + 15, s, { size: 14, fill: C.ink2 })].join("\n");
      }),
    ].join("\n"),
    "",
  );
}

const figures = {
  "03-timeline.svg": timeline(),
  "00-release-train.svg": releaseTrain(),
  "06-published-ramps.svg": ramps(),
  "07-fca-findings.svg": fca(),
  "08-sixteen-days.svg": sixteenDays(),
  "09-three-rollbacks.svg": rollbacks(),
  "10-knight-capital.svg": knight(),
  "14-deploy-and-release.svg": deployAndRelease(),
  "15-flag-evaluation.svg": flagEvaluation(),
  "16-dormant-and-shadow.svg": dormantAndShadow(),
  "17-flag-lifecycle.svg": flagLifecycle(),
  "20-flag-change-classes.svg": flagChangeClasses(),
  "21-data-rollback.svg": dataRollbackReach(),
  "22-two-copies.svg": twoCopies(),
  "23-write-audit-publish.svg": writeAuditPublish(),
  "24-stream-rebuild.svg": streamRebuild(),
  "25-feature-history.svg": featureHistory(),
  "26-three-arm-test.svg": threeArm(),
  "27-worked-example.svg": workedLanes(),
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

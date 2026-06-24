// ════════════════════════════════════════════════════════
//  ▼▼▼  YOUR DATA — EDIT ONLY THIS SECTION  ▼▼▼
// ════════════════════════════════════════════════════════

// Hero: AD date of the main wedding day (for auto BS calculation)
// Format: Date.UTC(YEAR, MONTH-1, DAY)
const HERO_AD_DATE = new Date(Date.UTC(2025, 11, 20)); // ← CHANGE

// Events: each has start/end in UTC and adDate for BS conversion
// NPT → UTC formula: subtract 5 hours 45 minutes
//   e.g. 5:00 PM NPT (17:00) → 17:00 - 5:45 = 11:15 UTC
//   e.g. 10:00 AM NPT        → 10:00 - 5:45 = 04:15 UTC
//   e.g. 7:00 PM NPT (19:00) → 19:00 - 5:45 = 13:15 UTC
// Format: Date.UTC(YEAR, MONTH-1, DAY, UTC_HOUR, UTC_MIN)

const EVENTS = [
  {
    cdId: "cd-1",
    badgeId: "badge-1",
    npId: "np-1",
    start: new Date(Date.UTC(2026, 5, 24, 5, 15)), // 24 Jun 2026, 3:00 PM NPT
    adDate: new Date(Date.UTC(2026, 5, 24)),
  },
  {
    cdId: "cd-2",
    badgeId: "badge-2",
    npId: "np-2",
    start: new Date(Date.UTC(2026, 6, 1, 4, 15)), // 1 Jul 2026, 10:00 AM NPT
    adDate: new Date(Date.UTC(2026, 6, 1)),
  },
  {
    cdId: "cd-3",
    badgeId: "badge-3",
    npId: "np-3",
    start: new Date(Date.UTC(2026, 6, 2, 7, 15)), // 2 Jul 2026, 1:00 PM NPT
    adDate: new Date(Date.UTC(2026, 6, 2)),
  },
];

// ════════════════════════════════════════════════════════
//  ▲▲▲  END OF YOUR DATA SECTION  ▲▲▲
// ════════════════════════════════════════════════════════

// ── Nepal Time ──
const NPT = (5 * 60 + 45) * 60 * 1000;
function nptNow() {
  return new Date(Date.now() + NPT);
}
function fmtTime(d) {
  const h = d.getUTCHours(),
    m = String(d.getUTCMinutes()).padStart(2, "0"),
    s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${h % 12 || 12}:${m}:${s} ${h >= 12 ? "PM" : "AM"}`;
}
function fmtDate(d) {
  const D = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const M = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${D[d.getUTCDay()]}, ${d.getUTCDate()} ${M[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

// ── BS Converter ──
const BSD = [
  { y: 2079, m: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30] },
  { y: 2080, m: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 30] },
  { y: 2081, m: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 30] },
  { y: 2082, m: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30] },
  { y: 2083, m: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30] },
  { y: 2084, m: [31, 31, 32, 31, 32, 30, 30, 30, 29, 30, 29, 30] },
  { y: 2085, m: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31] },
  { y: 2086, m: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30] },
];
const NPM = [
  "बैशाख",
  "जेठ",
  "असार",
  "श्रावण",
  "भाद्र",
  "आश्विन",
  "कार्तिक",
  "मंसिर",
  "पुस",
  "माघ",
  "फाल्गुन",
  "चैत्र",
];
const NPD = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function toNp(n) {
  return String(n)
    .split("")
    .map((c) => NPD[+c] || c)
    .join("");
}
function adToBs(ad) {
  const anchor = new Date(Date.UTC(2025, 3, 14));
  let diff = Math.floor((ad - anchor) / 86400000),
    y = 2082,
    m = 0;
  if (diff >= 0) {
    while (true) {
      const d = BSD.find((x) => x.y === y);
      if (!d) break;
      if (diff < d.m[m]) break;
      diff -= d.m[m];
      m++;
      if (m >= 12) {
        m = 0;
        y++;
      }
    }
    return { y, m, d: diff + 1 };
  } else {
    diff = -diff - 1;
    while (diff >= 0) {
      m--;
      if (m < 0) {
        m = 11;
        y--;
      }
      const d = BSD.find((x) => x.y === y);
      if (!d) break;
      if (diff < d.m[m]) return { y, m, d: d.m[m] - diff };
      diff -= d.m[m];
    }
  }
  return { y, m, d: 1 };
}
function bsStr(ad) {
  try {
    const b = adToBs(ad);
    return `${toNp(b.y)} ${NPM[b.m]} ${toNp(b.d)}`; // removed the ( ) brackets
  } catch (e) {
    return "";
  }
}
// ── Load ──
window.addEventListener("load", () => {
  document.getElementById("heroBg").style.backgroundImage =
    "url('./images/1.png')";
  setTimeout(
    () => document.getElementById("heroBg").classList.add("loaded"),
    80,
  );
  setTimeout(
    () => document.getElementById("heroContent").classList.add("loaded"),
    380,
  );
  setTimeout(
    () => document.getElementById("heroEyebrow").classList.add("loaded"),
    620,
  );
  setTimeout(
    () => document.getElementById("heroDivider").classList.add("loaded"),
    840,
  );
  setTimeout(
    () => document.getElementById("heroDateBlock").classList.add("loaded"),
    1060,
  );
  setTimeout(
    () => document.getElementById("scrollHint").classList.add("loaded"),
    1900,
  );
});

// ── Scroll reveal ──
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        setTimeout(
          () => e.target.classList.add("visible"),
          +e.target.dataset.delay || 0,
        );
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".event-card").forEach((c) => obs.observe(c));

// ── Clock ──
function tickClock() {
  const n = nptNow();
  document.getElementById("nptClock").textContent =
    `${fmtDate(n)} · ${fmtTime(n)}`;
}
tickClock();
setInterval(tickClock, 1000);

// ── Badge ──
function isSameDay(a, b) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

function updateBadge(ev) {
  const now = new Date(),
    npt = nptNow();
  const evDay = new Date(ev.start.getTime() + (5 * 60 + 45) * 60 * 1000); // shift event to NPT day
  const el = document.getElementById(ev.badgeId);
  const txt = document.getElementById(ev.badgeId + "-text");

  if (isSameDay(npt, evDay)) {
    el.className = "badge happening";
    txt.textContent = "Happening Today";
  } else if (now < ev.start) {
    el.className = "badge upcoming";
    txt.textContent = "Upcoming";
  } else {
    el.className = "badge ended";
    txt.textContent = "Celebration Ended";
  }
}

function updateCd(ev) {
  const el = document.getElementById(ev.cdId),
    now = Date.now();
  const npt = nptNow();
  const evDay = new Date(ev.start.getTime() + (5 * 60 + 45) * 60 * 1000);

  if (isSameDay(npt, evDay)) {
    el.innerHTML = `<div class="cdown-msg">✦ Happening Today! ✦</div>`;
    return;
  }
  if (now > ev.start) {
    el.innerHTML = `<div class="cdown-end">This celebration has concluded</div>`;
    return;
  }
  const diff = ev.start - now;
  const d = Math.floor(diff / 86400000),
    h = Math.floor((diff % 86400000) / 3600000),
    m = Math.floor((diff % 3600000) / 60000),
    s = Math.floor((diff % 60000) / 1000);
  el.innerHTML = `
    <div class="cu"><div class="cn">${String(d).padStart(2, "0")}</div><div class="cl">Days</div></div>
    <div class="cu"><div class="cn">${String(h).padStart(2, "0")}</div><div class="cl">Hrs</div></div>
    <div class="cu"><div class="cn">${String(m).padStart(2, "0")}</div><div class="cl">Min</div></div>
    <div class="cu"><div class="cn">${String(s).padStart(2, "0")}</div><div class="cl">Sec</div></div>
  `;
}

function tick() {
  EVENTS.forEach((ev) => {
    updateBadge(ev);
    updateCd(ev);
  });
}
tick();
setInterval(tick, 1000);

// Uçtan uca duman testi (v2): derlenmiş sayfayı gerçek Chromium’da baştan sona kullanır.
// cdnjs istekleri node_modules’taki aynı sürümlerle karşılanır (ağ gerekmez).
// Kullanım: node scripts/smoke.mjs [ekran-görüntüsü-klasörü]
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = process.argv[2] || join(root, "dist/shots");
mkdirSync(out, { recursive: true });
const LOCAL = {
  "react.production.min.js": "node_modules/react/umd/react.production.min.js",
  "react-dom.production.min.js": "node_modules/react-dom/umd/react-dom.production.min.js",
  "katex.min.js": "node_modules/katex/dist/katex.min.js",
};
const exe = process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({ executablePath: exe });
const errors = [];
const W = Number(process.env.W || 390);

async function newPage(dark = true) {
  const ctx = await browser.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, colorScheme: dark ? "dark" : "light", hasTouch: true, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g|Failed to load resource/.test(m.text())) errors.push("console: " + m.text()); });
  await page.route("**/*", (route) => {
    const u = route.request().url();
    const hit = Object.keys(LOCAL).find((k) => u.endsWith(k));
    if (hit) return route.fulfill({ body: readFileSync(join(root, LOCAL[hit])), contentType: "application/javascript" });
    if (u.startsWith("file:")) return route.continue();
    return route.abort();
  });
  await page.goto("file://" + join(root, "dist/index.html"));
  return page;
}
const shots = [];
const shot = async (page, name, full = false) => { await page.waitForTimeout(150); await page.screenshot({ path: join(out, name + ".png"), fullPage: full }); shots.push(name); };
const btn = (page, name) => page.getByRole("button", { name }).first();
const click = async (page, name) => { await btn(page, name).click(); await page.waitForTimeout(220); };
const visible = async (loc) => (await loc.count()) > 0 && (await loc.first().isVisible());
async function closeCelebrations(page, name) {
  for (let i = 0; i < 6; i++) {
    await page.waitForTimeout(250);
    if (!(await visible(page.locator(".celebrate")))) return i;
    await shot(page, `${name}-${i}`);
    await click(page, /Harika/);
  }
  errors.push("kutlamalar kapanmadı");
}
async function overflow(page, where) {
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  if (w > W + 1) errors.push(`yatay taşma (${where}): ${w}px`);
}

/** Bir dersi/oturumu sonuna kadar oynar; her yeni adım türünün ekran görüntüsünü alır */
async function playSession(page, prefix, { correctness = "any" } = {}) {
  const seen = new Set();
  for (let guard = 0; guard < 160; guard++) {
    await page.waitForTimeout(120);
    if (!(await visible(page.locator(".overlay")))) return "closed";
    const take = async (k) => { if (!seen.has(k)) { seen.add(k); await shot(page, `${prefix}-${k}`); await overflow(page, `${prefix}-${k}`); } };
    const devam = page.locator(".overlay .btn", { hasText: /^Devam/ });
    if (await visible(devam)) {
      if (await visible(page.locator(".overlay .stat-grid"))) { await take("summary"); await devam.first().click(); await page.waitForTimeout(400); return "done"; }
      if (await visible(page.locator(".overlay .feedback"))) await take("feedback");
      await devam.first().click(); continue;
    }
    if (await visible(btn(page, /Anladım/))) { await take("meet"); await click(page, /Anladım/); continue; }
    if (await visible(btn(page, /Hazırım/))) { await take("show"); await click(page, /Hazırım/); continue; }
    if (await visible(page.locator(".overlay .tf .btn:not([disabled])"))) { await take("tf"); await page.locator(".overlay .tf .btn").nth(1).click(); continue; }
    if (await visible(page.locator(".overlay .opt:not([disabled])"))) { await take("choice"); await page.locator(".overlay .opt:not([disabled])").first().click(); continue; }
    if (await visible(page.locator(".overlay .bank .token:not(.used):not([disabled])"))) { await take("cloze"); await page.locator(".overlay .bank .token:not(.used):not([disabled])").first().click(); continue; }
    if (await visible(btn(page, /Cevabı göster/))) { await take("flip"); await click(page, /Cevabı göster/); await page.waitForTimeout(350); await take("flip-open"); await page.locator(".overlay .grade.g3").click(); continue; }
    if (await visible(page.locator(".overlay .keypad"))) { await take("apply"); await page.locator('.overlay .keypad button[aria-label="1"]').click(); await page.locator('.overlay .keypad button[aria-label="Kontrol et"]').click(); continue; }
    await page.waitForTimeout(300);
  }
  errors.push(`${prefix}: oturum 160 adımda bitmedi`);
  return "stuck";
}

/* ---------------- 1) Karşılama → ilk ders ---------------- */
const page = await newPage(true);
await page.waitForSelector(".onb");
await shot(page, "01-welcome"); await overflow(page, "welcome");
await click(page, /Başlayalım/);
await shot(page, "02-level");
await click(page, /^Devam/);
await shot(page, "03-goal");
await click(page, /^Devam/);
await page.locator(".demo-star").click(); await page.locator(".demo-star").click();
await shot(page, "04-how");
await click(page, /İlk dersime başla/);
await page.waitForSelector(".overlay");
console.log("ilk ders:", await playSession(page, "10-lesson"));

/* ---------------- 2) Yol, kutlama, düğüm sayfası ---------------- */
await page.waitForTimeout(500);
console.log("kutlama:", await closeCelebrations(page, "20-celebrate"));
await page.evaluate(() => window.scrollTo(0, 0));
await shot(page, "21-path-top"); await overflow(page, "path");
if ((await page.locator(".toast").count()) > 1) errors.push("birden fazla bildirim üst üste");
await shot(page, "22-path-full", true);
const openNode = page.locator(".node.open").first();
if (await visible(openNode)) {
  await openNode.scrollIntoViewIfNeeded(); await openNode.click(); await page.waitForTimeout(300);
  await shot(page, "23-node-sheet");
  await click(page, /Başla/);
  console.log("ikinci ders:", await playSession(page, "24-lesson2"));
  await closeCelebrations(page, "25-celebrate");
}

/* ---------------- 3) Gökyüzü + formül ayrıntısı ---------------- */
await page.locator(".nav button", { hasText: "Gökyüzü" }).click(); await page.waitForTimeout(300);
await shot(page, "30-sky"); await overflow(page, "sky");
const star = page.locator(".sky-svg .star").first();
await star.click(); await page.waitForTimeout(400);
await shot(page, "31-detail");
await page.locator(".sheet").evaluate((el) => el.scrollTo(0, el.scrollHeight)); await page.waitForTimeout(200);
await shot(page, "32-detail-bottom");
const labBtn = page.locator(".sheet .btn", { hasText: /Laboratuvarı aç/ });
if (await visible(labBtn)) { await labBtn.click(); await page.waitForTimeout(400); await shot(page, "33-detail-lab"); }
await page.keyboard.press("Escape"); await page.waitForTimeout(250);

/* ---------------- 4) Kitapçık ---------------- */
await page.locator(".nav button", { hasText: "Kitapçık" }).click(); await page.waitForTimeout(300);
await shot(page, "40-booklet"); await overflow(page, "booklet");
await page.getByRole("tab", { name: /Temel/ }).click(); await page.waitForTimeout(200);
await shot(page, "41-booklet-temel");
await page.getByRole("tab", { name: /Sözlük/ }).click(); await page.waitForTimeout(200);
await shot(page, "42-glossary");
await page.locator(".search input").fill("asal"); await page.waitForTimeout(200);
await page.getByRole("tab", { name: /Temel/ }).click(); await page.waitForTimeout(200);
await shot(page, "43-search");

/* ---------------- 5) Oyunlar ---------------- */
await page.locator(".nav button", { hasText: "Oyun" }).click(); await page.waitForTimeout(300);
await shot(page, "50-arcade"); await overflow(page, "arcade");
for (const [name, label] of [["which", /Hangi Formül/], ["terms", /Terim Avı/], ["trap", /Tuzak Avı/]]) {
  await page.locator(".game", { hasText: label }).click(); await page.waitForTimeout(300);
  await shot(page, `51-${name}`);
  for (let i = 0; i < 14; i++) {
    if (await visible(page.locator(".overlay .opt:not([disabled])"))) { await page.locator(".overlay .opt:not([disabled])").first().click(); await page.waitForTimeout(120); }
    const nx = page.locator(".overlay .btn", { hasText: /Sonraki|Sonuç/ });
    if (await visible(nx)) { await nx.first().click(); await page.waitForTimeout(150); }
    if (await visible(page.locator(".overlay .btn", { hasText: "Salon" }))) break;
  }
  await shot(page, `52-${name}-result`);
  await click(page, /^Salon/);
}
await page.locator(".game", { hasText: /Eşleştir/ }).click(); await page.waitForTimeout(300);
await shot(page, "53-match");
await page.keyboard.press("Escape"); await page.waitForTimeout(200);
await page.locator(".game", { hasText: /Sayı Atölyesi/ }).click(); await page.waitForTimeout(300);
await shot(page, "54-numberlab");
await page.keyboard.press("Escape"); await page.waitForTimeout(200);
await page.locator(".game", { hasText: /Hız Turu/ }).click(); await page.waitForTimeout(300);
for (let i = 0; i < 4; i++) { await page.locator(".overlay .tf .btn").nth(i % 2).click(); await page.waitForTimeout(150); }
await shot(page, "55-speed");
await page.keyboard.press("Escape"); await page.waitForTimeout(200);

/* ---------------- 6) Profil ---------------- */
await page.locator(".nav button", { hasText: "Profil" }).click(); await page.waitForTimeout(300);
await shot(page, "60-profile"); await overflow(page, "profile");
await shot(page, "61-profile-full", true);

/* ---------------- 7) Tekrar oturumu (zamanı ileri sar) ---------------- */
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("formup-state-v2"));
  for (const p of Object.values(s.cards)) if (p.reps) { p.due -= 3 * 86400000; p.last -= 3 * 86400000; }
  localStorage.setItem("formup-state-v2", JSON.stringify(s));
});
await page.reload(); await page.waitForTimeout(600);
await page.locator(".nav button", { hasText: "Yol" }).click(); await page.waitForTimeout(300);
await shot(page, "70-path-due");
const polish = page.locator(".btn", { hasText: /Yıldızları parlat/ });
if (await visible(polish)) { await polish.click(); await page.waitForSelector(".overlay"); console.log("tekrar:", await playSession(page, "71-review")); }
else errors.push("tekrar düğmesi görünmedi");

/* ---------------- 8) Açık tema ---------------- */
await page.locator(".nav button", { hasText: "Profil" }).click(); await page.waitForTimeout(300);
await page.getByRole("button", { name: "Açık tema" }).click(); await page.waitForTimeout(300);
await page.evaluate(() => window.scrollTo(0, 0));
await shot(page, "80-light-profile");
await page.locator(".nav button", { hasText: "Yol" }).click(); await page.waitForTimeout(300);
await shot(page, "81-light-path");
await page.locator(".nav button", { hasText: "Gökyüzü" }).click(); await page.waitForTimeout(300);
await shot(page, "82-light-sky");
const n2 = page.locator(".node.open, .node.done").first();
await page.locator(".nav button", { hasText: "Yol" }).click(); await page.waitForTimeout(300);
if (await visible(n2)) { await n2.scrollIntoViewIfNeeded(); await n2.click(); await page.waitForTimeout(250); await click(page, /Başla|Tekrar oyna/); await page.waitForTimeout(300); await shot(page, "83-light-lesson"); await page.keyboard.press("Escape"); }

await browser.close();
console.log(`${shots.length} ekran görüntüsü → ${out}`);
if (errors.length) { console.log("HATALAR:\n" + [...new Set(errors)].join("\n")); process.exit(1); }
console.log("Duman testi temiz ✓");

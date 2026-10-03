// Uçtan uca duman testi: derlenmiş sayfayı gerçek Chromium’da çalıştırır.
// cdnjs istekleri node_modules’taki aynı sürümlerle karşılanır (ağ gerekmez).
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
async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: opts.dark ? "dark" : "light", hasTouch: true });
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
const shot = (page, name) => page.screenshot({ path: join(out, name + ".png"), fullPage: false });
const click = async (page, text) => { await page.getByRole("button", { name: text }).first().click(); await page.waitForTimeout(250); };

const page = await newPage();
await page.waitForSelector(".onb-logo");
await shot(page, "01-onboarding");
await click(page, /Başlayalım/);
await shot(page, "02-levels");
await click(page, /Devam/);
await click(page, /Formülleri keşfet/);
await page.waitForSelector(".deck");
await page.waitForTimeout(300);
await shot(page, "03-discover");

// 5 formülü öğrenme listesine ekle, 1 tanesi için "Biliyorum"
for (let i = 0; i < 5; i++) { await page.locator(".card-foot .btn.primary").click(); await page.waitForTimeout(380); }
await page.locator(".card-foot .btn.outline").click();
await page.waitForTimeout(200);
await shot(page, "04-know-check");
await page.locator(".card-foot .opt").first().click();
await page.waitForTimeout(2000);

// Ders
await page.locator(".qbtn").click();
await page.waitForSelector(".overlay");
let guard = 0, shotIntro = false, shotMc = false, shotFlip = false, shotApply = false;
while (guard++ < 80) {
  await page.waitForTimeout(220);
  if (await page.locator("text=tamamlandı").count()) break;
  const btn = async (re) => (await page.getByRole("button", { name: re }).count()) > 0;
  if (await btn(/^Anladım/)) { if (!shotIntro) { await shot(page, "05-intro"); shotIntro = true; } await click(page, /^Anladım/); continue; }
  if (await btn(/^Hazırım/)) { await click(page, /^Hazırım/); continue; }
  if (await btn(/^Devam/)) { await click(page, /^Devam/); continue; }
  if (await page.locator(".opt:not([disabled])").count()) { if (!shotMc) { await shot(page, "06-mc"); shotMc = true; } await page.locator(".opt").first().click(); await page.waitForTimeout(300); if (!(await page.locator(".feedback").count())) continue; await shot(page, "07-feedback"); continue; }
  if (await btn(/Cevabı göster/)) { await click(page, /Cevabı göster/); await page.waitForTimeout(500); if (!shotFlip) { await shot(page, "08-flip"); shotFlip = true; } await page.locator(".grade.g3").click(); continue; }
  if (await page.locator(".tf .btn.good:not([disabled])").count()) { await page.locator(".tf .btn.good").click(); continue; }
  if (await page.locator(".keypad").count()) { if (!shotApply) { await shot(page, "09-apply"); shotApply = true; } await page.locator(".keypad button", { hasText: "1" }).first().click(); await page.locator(".keypad .go").click(); continue; }
}
await shot(page, "10-summary");
await click(page, /^Bitir/);
await page.waitForTimeout(400);
await shot(page, "11-home");

// Harita + detay
await page.locator(".nav button", { hasText: "Harita" }).click();
await page.waitForTimeout(200);
await page.locator(".topic-head").first().click();
await page.waitForTimeout(200);
await shot(page, "12-map");
await page.locator(".tile").first().click();
await page.waitForTimeout(400);
await shot(page, "13-detail");
await page.keyboard.press("Escape");

// Arena: eşleştir ekranı ve hız turu
await page.locator(".nav button", { hasText: "Arena" }).click();
await page.waitForTimeout(200);
await shot(page, "14-arena");
await page.locator(".game").nth(1).click();
await page.waitForTimeout(400);
await shot(page, "15-match");
await page.getByRole("button", { name: "Oyundan çık" }).click();
await page.locator(".game").nth(0).click();
await page.waitForTimeout(400);
for (let i = 0; i < 6; i++) { await page.locator(".tf .btn.good").click(); await page.waitForTimeout(150); }
await shot(page, "16-speed");
await page.getByRole("button", { name: "Oyundan çık" }).click();
await page.locator(".game").nth(3).click();
await page.waitForTimeout(400);
await shot(page, "17-lab");
await page.getByRole("button", { name: "Oyundan çık" }).click();

// Profil
await page.locator(".nav button", { hasText: "Profil" }).click();
await page.waitForTimeout(300);
await shot(page, "18-profile");
const state = await page.evaluate(() => JSON.parse(localStorage.getItem("formup-state-v1")));
console.log("öğrenilen kart:", Object.values(state.cards).filter((c) => c.reps).length, "kuyruk:", state.queue.length, "xp:", state.xp, "seri:", state.streak.cur);

// Karanlık tema: yeniden yükle, aynı durum
await page.locator(".seg button", { hasText: "Tahta" }).click();
await page.locator(".nav button", { hasText: "Bugün" }).click();
await page.waitForTimeout(300);
await shot(page, "19-home-dark");
await page.locator(".nav button", { hasText: "Keşfet" }).click();
await page.waitForTimeout(300);
await shot(page, "20-discover-dark");

// Ertesi gün: tüm kartları vadesi gelmiş yap, tekrar oturumunu çalıştır
await page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem("formup-state-v1"));
  for (const c of Object.values(s.cards)) if (c.reps) { c.due = Date.now() - 1000; c.last = Date.now() - 3 * 86400000; c.s = 12; }
  s.updatedAt = Date.now();
  localStorage.setItem("formup-state-v1", JSON.stringify(s));
});
await page.reload();
await page.waitForSelector(".topbar");
await page.locator(".nav button", { hasText: "Bugün" }).click();
await page.waitForTimeout(300);
await shot(page, "21-home-due");
await page.getByRole("button", { name: /Tekrara başla/ }).click();
await page.waitForSelector(".overlay");
guard = 0;
const seen = new Set();
while (guard++ < 60) {
  await page.waitForTimeout(250);
  if (await page.locator("text=tamamlandı").count()) break;
  const label = await page.locator(".mode-label").first().textContent().catch(() => "");
  if (label && !seen.has(label)) { seen.add(label); await shot(page, "22-review-" + seen.size); }
  const btn = async (re) => (await page.getByRole("button", { name: re }).count()) > 0;
  if (await btn(/^Hazırım/)) { await click(page, /^Hazırım/); continue; }
  if (await btn(/^Devam/)) { await click(page, /^Devam/); continue; }
  if (await page.locator(".opt:not([disabled])").count()) { await page.locator(".opt").first().click(); continue; }
  if (await btn(/Cevabı göster/)) { await click(page, /Cevabı göster/); await page.waitForTimeout(450); await page.locator(".grade.g3").click(); continue; }
  if (await page.locator(".tf .btn.good:not([disabled])").count()) { await page.locator(".tf .btn.good").click(); continue; }
  if (await page.locator(".keypad").count()) { await page.keyboard.type("12"); await page.keyboard.press("Enter"); continue; }
}
console.log("tekrar modları:", [...seen].join(" | "));
await shot(page, "23-review-summary");
await click(page, /^Bitir/);
const after = await page.evaluate(() => JSON.parse(localStorage.getItem("formup-state-v1")));
const futureDue = Object.values(after.cards).filter((c) => c.reps && c.due > Date.now()).length;
console.log("tekrardan sonra ileri tarihli kart:", futureDue);

// Yatay taşma kontrolü
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
console.log("yatay taşma:", overflow);
console.log(errors.length ? "HATALAR:\n" + errors.join("\n") : "Konsol hatası yok ✓");
await browser.close();

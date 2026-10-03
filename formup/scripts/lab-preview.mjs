// Laboratuvar önizleme: node scripts/lab-preview.mjs <labId> [çıktı klasörü]
// src/labs/<labId>.jsx dosyasını derler, Chromium’da 390px genişlikte gece ve gündüz temasında çizer,
// ekran görüntülerini kaydeder ve konsol hatalarını yazdırır (hata varsa çıkış kodu 1).
import { build } from "esbuild";
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const id = process.argv[2];
const out = process.argv[3] || "/tmp/labshots";
if (!id || !existsSync(join(root, "src/labs", id + ".jsx"))) { console.error("lab dosyası yok: src/labs/" + id + ".jsx"); process.exit(1); }
mkdirSync(out, { recursive: true });

const entry = `
import React from "react";
import { createRoot } from "react-dom/client";
import Lab from "./${id}.jsx";
function Frame({ mode }) {
  return (
    <div className="fu" data-mode={mode} style={{ padding: 16, background: "var(--bg)", minHeight: "50vh" }}>
      <div className="panel" style={{ maxWidth: 520, margin: "0 auto" }}><Lab /></div>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<><Frame mode="dark" /><Frame mode="light" /></>);
`;
const globals = { name: "globals", setup(b) {
  b.onResolve({ filter: /^react(-dom)?(\/client)?$/ }, (a) => ({ path: a.path, namespace: "g" }));
  b.onLoad({ filter: /.*/, namespace: "g" }, (a) => ({ contents: a.path.startsWith("react-dom") ? "module.exports = window.ReactDOM" : "module.exports = window.React", loader: "js" }));
} };
const res = await build({
  stdin: { contents: entry, resolveDir: join(root, "src/labs"), loader: "jsx" },
  bundle: true, write: false, format: "iife", jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
  plugins: [globals], logLevel: "silent",
}).catch((e) => { console.error("DERLEME HATASI:\n" + e.message); process.exit(1); });
const js = res.outputFiles[0].text;
const css = readFileSync(join(root, "src/styles.css"), "utf8") + readFileSync(join(root, "node_modules/katex/dist/katex.min.css"), "utf8").replace(/url\(fonts\//g, "url(file://" + join(root, "node_modules/katex/dist/fonts/"));
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body><div id="root"></div>
<script src="file://${join(root, "node_modules/react/umd/react.production.min.js")}"></script>
<script src="file://${join(root, "node_modules/react-dom/umd/react-dom.production.min.js")}"></script>
<script src="file://${join(root, "node_modules/katex/dist/katex.min.js")}"></script>
<script>${js.replace(/<\/script/gi, "<\\/script")}</script></body></html>`;
const file = join(out, `${id}.html`);
writeFileSync(file, html);
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 2 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto("file://" + file);
await page.waitForTimeout(500);
const frames = await page.$$(".fu");
await frames[0].screenshot({ path: join(out, `${id}-dark.png`) });
await frames[1].screenshot({ path: join(out, `${id}-light.png`) });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await browser.close();
console.log(`ekran görüntüleri: ${join(out, id + "-dark.png")} , ${join(out, id + "-light.png")}`);
console.log(`yatay taşma: ${overflow}px`);
if (errors.length) { console.log("HATALAR:\n" + errors.join("\n")); process.exit(1); }
console.log("Konsol hatası yok ✓");

// Derleme: tek dosyalık HTML üretir.
//  dist/formup.artifact.html  → claude.ai Artifact olarak yayımlanan sayfa içeriği (iskeletsiz)
//  dist/index.html            → doğrudan açılabilen / GitHub Pages’e konabilen tam sayfa
// React ve KaTeX betikleri cdnjs’ten yüklenir; KaTeX stilleri ve fontları sayfaya gömülür.
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const KATEX_VER = "0.16.9";
const CDN = {
  react: "https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js",
  reactDom: "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js",
  katex: `https://cdnjs.cloudflare.com/ajax/libs/KaTeX/${KATEX_VER}/katex.min.js`,
};

const globals = {
  name: "globals",
  setup(b) {
    b.onResolve({ filter: /^react(-dom)?(\/client)?$/ }, (a) => ({ path: a.path, namespace: "g" }));
    b.onLoad({ filter: /.*/, namespace: "g" }, (a) => ({
      contents: a.path.startsWith("react-dom") ? "module.exports = window.ReactDOM" : "module.exports = window.React",
      loader: "js",
    }));
  },
};

// Laboratuvar kaydı: src/labs/*.jsx (kit ve _önizleme dosyaları hariç) → src/labs/index.js
export function writeLabIndex() {
  const dir = join(root, "src/labs");
  const ids = readdirSync(dir).filter((f) => f.endsWith(".jsx") && f !== "kit.jsx" && !f.startsWith("_")).map((f) => f.slice(0, -4)).sort();
  const src = "/* Otomatik üretildi (scripts/build.mjs) — elle düzenleme */\n"
    + ids.map((id, i) => `import L${i} from "./${id}.jsx";`).join("\n")
    + `\nexport const LAB_MAP = {\n${ids.map((id, i) => `  ${JSON.stringify(id)}: L${i},`).join("\n")}\n};\n`;
  const out = join(dir, "index.js");
  if (!existsSync(out) || readFileSync(out, "utf8") !== src) writeFileSync(out, src);
  return ids;
}
const labs = writeLabIndex();

// İçerik parçaları: src/data/v2/c-*.js → src/data/v2/chunks.js (temel önce, sonra kitapçık sırası)
export function writeChunks() {
  const dir = join(root, "src/data/v2");
  const order = ["c-fnum", "c-ffrac", "c-fpow", "c-falg", "c-fgeo", "c-fgraph", "c-b1", "c-b2", "c-b3", "c-b4", "c-b5"];
  const files = readdirSync(dir).filter((f) => /^c-.*\.js$/.test(f)).map((f) => f.slice(0, -3))
    .sort((a, b) => ((order.indexOf(a) + 1) || 99) - ((order.indexOf(b) + 1) || 99) || a.localeCompare(b));
  const src = "/* Otomatik üretildi (scripts/build.mjs) — elle düzenleme */\n"
    + files.map((f, i) => `import * as C${i} from "./${f}.js";`).join("\n")
    + `\nexport const CHUNKS = [${files.map((_, i) => `C${i}`).join(", ")}];\n`;
  const out = join(dir, "chunks.js");
  if (!existsSync(out) || readFileSync(out, "utf8") !== src) writeFileSync(out, src);
  return files;
}
const chunks = writeChunks();

const res = await build({
  entryPoints: [join(root, "src/main.jsx")],
  bundle: true, minify: true, format: "iife", target: ["es2020"], write: false,
  jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [globals], legalComments: "none", charset: "utf8",
});
const js = res.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

// KaTeX CSS: fontları woff2 data URI olarak göm
const kdir = join(root, "node_modules/katex/dist");
let kcss = readFileSync(join(kdir, "katex.min.css"), "utf8");
kcss = kcss.replace(/src:url\(fonts\/([^)]+)\.woff2\) format\("woff2"\)(,url\([^)]+\) format\("[a-z]+"\))*/g, (_, name) => {
  const b64 = readFileSync(join(kdir, "fonts", name + ".woff2")).toString("base64");
  return `src:url(data:font/woff2;base64,${b64}) format("woff2")`;
});
if (/url\(fonts\//.test(kcss)) throw new Error("KaTeX font yolları gömülemedi");

const css = readFileSync(join(root, "src/styles.css"), "utf8");
const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500..800&family=Lexend:wght@300..700&family=Caveat:wght@500..700&display=swap">`;
const title = "<title>FormUp Matematik</title>";
const body = `<div id="root"><div style="min-height:100vh;display:grid;place-items:center;font-family:system-ui;color:#8C97C6;background:#090E22">FormUp yükleniyor…</div></div>
<script src="${CDN.react}" crossorigin="anonymous"></script>
<script src="${CDN.reactDom}" crossorigin="anonymous"></script>
<script src="${CDN.katex}" crossorigin="anonymous"></script>
<script>${js}</script>`;

const artifact = `${title}\n${fonts}\n<style>${css}\n${kcss}</style>\n${body}\n`;
const full = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#090E22">${title}${fonts}<style>${css}\n${kcss}</style></head><body>${body}</body></html>\n`;

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/formup.artifact.html"), artifact);
writeFileSync(join(root, "dist/index.html"), full);
const kb = (p) => (statSync(join(root, p)).size / 1024).toFixed(0) + " KB";
console.log(`${chunks.length} içerik parçası · ${labs.length} lab · js ${(js.length / 1024).toFixed(0)} KB · artifact ${kb("dist/formup.artifact.html")} · index ${kb("dist/index.html")}`);

// Dev-only visual QA: captures viewport screenshots at scroll positions with
// headless Chrome over CDP. Usage:
//   node scripts/shoot.mjs <outDir> <width> <height> <y1,y2,...|#id,#id+300,...>
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const [outDir = ".shots", W = "1440", H = "900", spots = "0"] = process.argv.slice(2);
const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.env.URL ?? "http://localhost:3217/";
const port = 9333 + Math.floor(Math.random() * 500);
mkdirSync(outDir, { recursive: true });

const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${path.resolve(outDir, ".profile")}`,
  "--hide-scrollbars",
  "--no-first-run",
  `--window-size=${W},${H}`,
  "about:blank",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) {
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    if (targets.length) break;
  } catch {}
  await sleep(200);
}
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result ?? m.error);
    pending.delete(m.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const i = ++id;
    pending.set(i, resolve);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result?.value;

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +W, height: +H, deviceScaleFactor: 1, mobile: +W < 600 });
await send("Page.navigate", { url: URL });
await sleep(3500);
await evaluate("document.documentElement.style.scrollBehavior='auto'");

for (const [n, spot] of spots.split(",").entries()) {
  const y = spot.startsWith("#")
    ? await evaluate(`(() => { const [sel, off] = ${JSON.stringify(spot)}.split(/(?=[+-]\\d)/); const el = document.querySelector(sel); return el ? el.getBoundingClientRect().top + scrollY + Number(off || 0) : 0 })()`)
    : Number(spot);
  await evaluate(`window.scrollTo(0, ${y})`);
  // Let the scroll engine, reveals and lazy images settle.
  await sleep(900);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  const file = path.join(outDir, `${String(n).padStart(2, "0")}-${spot.replace(/[^a-z0-9]+/gi, "_")}.png`);
  writeFileSync(file, Buffer.from(shot.data, "base64"));
  console.log(file);
}
if (process.env.INFO) console.log(await evaluate(process.env.INFO));
ws.close();
chrome.kill();
process.exit(0);

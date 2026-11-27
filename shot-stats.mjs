// Screenshots for Statistik Indonesia v4: headless Chromium via CDP.
// Usage: node shot-stats.mjs <base-url> <out-dir>
// Reads shots.json beside this file, waits for window.__shotReady,
// captures JPEG q82 straight from the browser (no conversion step).
import { readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const [base, outDir] = process.argv.slice(2);
const CHROME = process.env.HOME + "/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome";
const PORT = 9335;
const shots = JSON.parse(readFileSync(join(here, "shots.json"), "utf8"));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`, "--window-size=1400,1100", "about:blank",
], { stdio: "ignore" });

async function getWs() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const page = list.find((t) => t.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await sleep(200);
  }
  throw new Error("devtools did not come up");
}

let id = 0;
const pending = new Map();
let ws;
try {
  const wsUrl = await getWs();
  ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((res) => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  const evalJs = async (expr) => {
    const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result?.exceptionDetails) throw new Error("JS error: " + JSON.stringify(r.result.exceptionDetails).slice(0, 800));
    return r.result?.result?.value;
  };
  await send("Page.enable");
  await send("Runtime.enable");

  for (const s of shots) {
    const url = base + s.path;
    await send("Emulation.setDeviceMetricsOverride", { width: s.viewport.width, height: s.viewport.height, deviceScaleFactor: 1, mobile: s.viewport.width < 500 });
    await send("Page.navigate", { url });
    // wait for the app to render
    let ready = false;
    for (let i = 0; i < 40; i++) {
      await sleep(250);
      ready = await evalJs("window.__shotReady === true");
      if (ready) break;
    }
    if (!ready) throw new Error(`__shotReady never became true for ${s.path}`);
    await sleep(400);
    const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 82 });
    const buf = Buffer.from(shot.result.data, "base64");
    writeFileSync(join(outDir, s.file), buf);
    console.log(s.file, buf.length, "bytes", ready ? "ready" : "TIMEOUT");
  }
} finally {
  try { ws?.close(); } catch {}
  chrome.kill();
}
console.log("done");

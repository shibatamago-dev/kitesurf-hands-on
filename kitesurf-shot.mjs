// Kitesurf (http://127.0.0.1:8787) に Puppeteer-core で接続してスクリーンショットを撮る
// usage: node kitesurf-shot.mjs <url> <out.png>
import puppeteer from "puppeteer-core";

const url = process.argv[2] || "https://example.com/";
const out = process.argv[3] || "kitesurf.png";
const port = process.env.KITESURF_PORT || "8787";

const browser = await puppeteer.connect({
  browserWSEndpoint: `ws://127.0.0.1:${port}/devtools/browser`,
  defaultViewport: { width: 1280, height: 800 },
});
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  // 描画が落ち着くまで少し待つ（エンジン差を吸収するための固定待ち。速度比較には使わない）
  await new Promise((r) => setTimeout(r, 3000));
  const title = await page.title().catch((e) => `(title取得失敗: ${e.message})`);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 500) ?? "").catch((e) => `(evaluate失敗: ${e.message})`);
  console.log(JSON.stringify({ url, title, text }, null, 2));
  await page.screenshot({ path: out });
  console.log("screenshot:", out);
} finally {
  await browser.disconnect();
}

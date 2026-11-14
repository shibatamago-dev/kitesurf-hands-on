// 通常の Chromium (puppeteer 同梱) で同じ条件のスクリーンショットを撮る
// usage: node chromium-shot.mjs <url> <out.png>
import puppeteer from "puppeteer";

const url = process.argv[2] || "https://example.com/";
const out = process.argv[3] || "chromium.png";

const proxy = process.env.CHROME_PROXY || "";
const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--no-sandbox", "--disable-setuid-sandbox",
    ...(proxy ? [`--proxy-server=${proxy}`, "--ignore-certificate-errors"] : []),
  ],
  defaultViewport: { width: 1280, height: 800 },
});
try {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1000));
  const title = await page.title().catch((e) => `(title取得失敗: ${e.message})`);
  const text = await page.evaluate(() => document.body?.innerText?.slice(0, 500) ?? "").catch((e) => `(evaluate失敗: ${e.message})`);
  console.log(JSON.stringify({ url, title, text }, null, 2));
  await page.screenshot({ path: out });
  console.log("screenshot:", out);
} finally {
  await browser.close();
}

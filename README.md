# kitesurf-hands-on

Cloudflare Kitesurf（オープンソース版）をローカルでビルド・起動し、Puppeteerで接続して描画とJavaScript実行を検証した再現コードです。Zenn記事「Kitesurfを実際に動かしてみた」の付属リポジトリ。

## 検証環境
- Ubuntu 24.04（約1.5 vCPU / 約6GB RAM のVM）
- Node.js 24 / pnpm 9.15.4 / Bazelisk（Bazel 9.3.0）

## 手順
1. Kitesurf 本体をクローンしてビルド・起動する（別ディレクトリで実施）
   - `pnpm install --frozen-lockfile`
   - `bazel run //packages/engine:dev_build`（このVMでは約51分）
   - `wrangler dev --env local -c wrangler.jsonc -c test/fixtures-worker/wrangler.jsonc --port 8787 --var KITESURF_ALLOW_PRIVATE_NETWORK:1`
   - `curl http://127.0.0.1:8787/health` → `kitesurf: OK`
2. テストページをローカル配信する
   - `python3 -m http.server 8000 --bind 127.0.0.1`
3. スクリーンショットを撮る
   - `npm install`
   - `node kitesurf-shot.mjs "http://127.0.0.1:8000/test-page.html" shots/kitesurf-testpage.png`
   - `node chromium-shot.mjs "http://127.0.0.1:8000/test-page.html" shots/chromium-testpage.png`（比較用）

## 結果
- Kitesurf: flex / grid / 表 / グラデーション / 日本語描画 OK、JavaScript実行 OK（40+2=42、1..10合計=55、UA取得）
- 外部サイト（example.com）の取得は検証環境のプロキシ制約でタイムアウトしたため、描画検証はローカルページで実施

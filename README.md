# KeepPix — keeppix.app

Privacy-first image tools: resize, compress, crop and convert images entirely in the browser.
Files never leave the user's device.

## Features (v1)

- Resize (never upscales), center crop to common ratios (1:1, 4:5, 16:9, 3:2, 3.5×4.5 ID photo)
- Convert to JPEG, WebP or PNG with a quality slider
- "Max file size" mode: lowers quality, then dimensions, until the file fits (JPEG/WebP)
- Presets: web, social, application photo, document ≤ 2 MB, email ≤ 500 KB
- Batch processing, drag & drop, paste from clipboard
- Strips EXIF metadata (including GPS location) on re-encode
- Privacy proof built in: online/offline indicator, live network-request counter, strict CSP (`connect-src 'none'`)
- English and Greek UI (auto-detected from the browser, switchable, `?lang=el` / `?lang=en`)
- No cookies, no analytics, no external scripts or fonts
- Installable app (PWA): works with no connection at all after the first visit
- PDF tools (tab or `keeppix.app/#pdf`): images → PDF (A4/Letter/fit, margins), merge PDFs (keeps text), compress PDF (rasterizes pages to JPEG; light/balanced/strong, black & white, max-size target)

## Project layout

```
public/
  index.html            # the whole app (HTML + CSS + JS, no dependencies)
  sw.js                 # service worker: caches the app's own files for offline use
  manifest.webmanifest  # makes it installable
  icons/                # app icons
  pdf-tools.js          # PDF tools (loaded on demand)
  vendor/               # pdf-lib 1.17.1 (MIT) and PDF.js 6.2 (Apache-2.0), see THIRD-PARTY-LICENSES.txt
  _headers              # security headers served by Cloudflare
wrangler.jsonc # Cloudflare Workers static-assets config
```

## Run locally

Just open `public/index.html` in a browser. Or:

```bash
npx wrangler dev
```

## Deploy to Cloudflare (via GitHub)

1. Create a new GitHub repo (e.g. `image-tools`) and push this folder:
   ```bash
   git init && git add . && git commit -m "v1"
   git branch -M main
   git remote add origin git@github.com:<you>/image-tools.git
   git push -u origin main
   ```
2. Cloudflare dashboard → **Workers & Pages → Create → Import a repository** → pick the repo.
   Leave the build command empty; the deploy command is `npx wrangler deploy`.
3. Every push to `main` redeploys automatically. Add a custom domain under the Worker's **Domains** tab.

Or deploy straight from your machine: `npx wrangler login` then `npx wrangler deploy`.

## Releasing a new version

When you change any file in `public/`, bump `VERSION` in `public/sw.js` (v8 → v9) so installed copies pick up the update.

## Roadmap

- Better codecs via WebAssembly (MozJPEG, AVIF)
- PDF: split / extract pages, rotate, reorder by thumbnail
- Manual crop box

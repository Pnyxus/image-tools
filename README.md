# Kratopix — kratopix.app

Privacy-first image tools: resize, compress, crop and convert images entirely in the browser.
Files never leave the user's device.

Kratopix is open source under the [GNU AGPL-3.0](LICENSE). You can read every line that runs in your browser and check the privacy promise for yourself.

Formerly **KeepPix** (keeppix.app), renamed 26 Oct 2026. The name comes from Greek κρατάω, "I keep".

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
- PDF tools (tab or `kratopix.app/#pdf`): images → PDF (A4/Letter/fit, margins), merge PDFs (keeps text), compress PDF (rasterizes pages to JPEG; light/balanced/strong, black & white, max-size target)

## Project layout

```
public/
  index.html            # the whole app (HTML + CSS + JS, no dependencies)
  el/index.html         # Greek page for Google (kratopix.app/el/), GENERATED: run `node tools/build-el.mjs` after editing index.html
  sitemap.xml, robots.txt  # for Google Search Console
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

## Old address (keeppix.app)

keeppix.app stays registered and redirects to kratopix.app:
- Cloudflare Redirect Rule on the keeppix.app zone: 301 to `https://kratopix.app` + same path, query kept, for every path **except `/sw.js`**.
- `/sw.js` is still served on keeppix.app so installed copies of the old app update to a worker that clears the old offline copy, unregisters itself and reloads into the redirect (see the top of `public/sw.js`).
- `index.html` also sends keeppix.app visitors to kratopix.app with JavaScript, as a fallback.

## Releasing a new version

When you change any file in `public/`, bump `VERSION` in `public/sw.js` (for example v27 → v28) so installed copies pick up the update.

## Roadmap

- Better codecs via WebAssembly (MozJPEG, AVIF)
- PDF: split / extract pages, rotate, reorder by thumbnail
- Manual crop box

## Contributing

Bug reports and ideas are welcome as GitHub issues. Pull requests are welcome too; please keep to the project rules:

- Nothing may send a request outside kratopix.app: no analytics, CDNs, web fonts or external scripts. The network counter in the app must stay at 0.
- Every new piece of visible text needs an English and a Greek string in the `STR` table in `public/index.html`.
- After editing `public/index.html`, run `node tools/build-el.mjs` to regenerate the Greek page.
- Bump `VERSION` in `public/sw.js` for any change in `public/`.

## License

Copyright © 2026 Pnyxus (https://pnyxus.gr)

Kratopix is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. See [LICENSE](LICENSE). In short: you may use, study, change and share it, but if you publish a modified version, including as a website, you must make its source code available under the same license.

Bundled libraries keep their own licenses: pdf-lib (MIT) and PDF.js (Apache-2.0). See `public/vendor/THIRD-PARTY-LICENSES.txt`.

The name "Kratopix" and the Kratopix shield logo are not covered by the code license. If you publish your own version, please give it a different name and logo.

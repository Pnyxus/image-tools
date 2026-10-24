// KeepPix PDF tools: images → PDF, merge PDFs, compress PDF.
// Everything runs in the browser. Libraries (pdf-lib, PDF.js) are served from this site
// and only loaded when the PDF tab is opened. No file is ever sent anywhere.
(() => {
  "use strict";
  const KP = window.KeepPix;
  const $ = (s) => document.querySelector(s);

  // ---------- Strings ----------
  const S = {
    en: {
      toolImg: "Images → PDF", toolMerge: "Merge PDFs", toolCompress: "Compress PDF",
      dropImg: "Drop images here or click to choose", dropPdf: "Drop PDF files here or click to choose",
      dropSubImg: "Each image becomes one page. Drag to reorder below.",
      dropSubMerge: "Files are merged in the order listed below.",
      dropSubCompress: "Each PDF is compressed separately.",
      pageSize: "Page size", a4: "A4", letter: "Letter", fit: "Fit to image",
      margin: "Margins", mNone: "None", mSmall: "Small", mNormal: "Normal",
      imgQ: "Image quality", qStd: "Standard (smaller file)", qHigh: "High",
      level: "Compression", lLight: "Light — best quality", lBalanced: "Balanced (recommended)",
      lStrong: "Strong — smallest file", gray: "Black & white (smaller for documents)",
      maxMB: "Max file size (MB)", noLimit: "no limit",
      compressNote: "Pages are saved as high-quality images, so text won’t be selectable afterwards. Ideal for scans, forms and photos of documents.",
      goImg: "Create PDF", goMerge: "Merge PDFs", goCompress: "Compress",
      up: "Move up", down: "Move down", remove: "Remove",
      empty: "No files added yet.", loading: "Loading PDF tools…",
      working: (i, n) => `Processing ${i} of ${n}…`, pageOf: (f, p, n) => `${f}: page ${p} of ${n}…`,
      saving: "Saving…", done: "Done.", pages: (n) => (n === 1 ? "1 page" : `${n} pages`),
      download: "Download PDF",
      errLib: "Couldn’t load the PDF tools. Check your connection and reload once — after that they work offline.",
      errLocked: (f) => `“${f}” is password-protected. Remove the password first.`,
      errBadPdf: (f) => `“${f}” couldn’t be read as a PDF.`,
      errImg: (f) => `“${f}” couldn’t be read as an image.`,
      errGeneric: "Something went wrong.",
      noteNoFit: "Couldn’t get under the size limit even at the strongest setting — this is the smallest version.",
      noteBigger: "This PDF was already well optimized: the original is smaller, keep that one.",
      noteLevel: (l) => `Used “${l}” compression to fit the size limit.`,
    },
    el: {
      toolImg: "Εικόνες → PDF", toolMerge: "Ένωση PDF", toolCompress: "Συμπίεση PDF",
      dropImg: "Σύρετε εικόνες εδώ ή πατήστε για επιλογή", dropPdf: "Σύρετε αρχεία PDF εδώ ή πατήστε για επιλογή",
      dropSubImg: "Κάθε εικόνα γίνεται μία σελίδα. Αλλάξτε τη σειρά παρακάτω.",
      dropSubMerge: "Τα αρχεία ενώνονται με τη σειρά της λίστας.",
      dropSubCompress: "Κάθε PDF συμπιέζεται ξεχωριστά.",
      pageSize: "Μέγεθος σελίδας", a4: "A4", letter: "Letter", fit: "Όσο η εικόνα",
      margin: "Περιθώρια", mNone: "Χωρίς", mSmall: "Μικρά", mNormal: "Κανονικά",
      imgQ: "Ποιότητα εικόνας", qStd: "Κανονική (μικρότερο αρχείο)", qHigh: "Υψηλή",
      level: "Συμπίεση", lLight: "Ελαφριά — καλύτερη ποιότητα", lBalanced: "Ισορροπημένη (προτείνεται)",
      lStrong: "Ισχυρή — μικρότερο αρχείο", gray: "Ασπρόμαυρο (μικρότερο για έγγραφα)",
      maxMB: "Μέγιστο μέγεθος αρχείου (MB)", noLimit: "χωρίς όριο",
      compressNote: "Οι σελίδες αποθηκεύονται ως εικόνες υψηλής ποιότητας, οπότε το κείμενο δεν θα επιλέγεται μετά. Ιδανικό για σκαναρισμένα έγγραφα, αιτήσεις και φωτογραφίες εγγράφων.",
      goImg: "Δημιουργία PDF", goMerge: "Ένωση PDF", goCompress: "Συμπίεση",
      up: "Πάνω", down: "Κάτω", remove: "Αφαίρεση",
      empty: "Δεν έχουν προστεθεί αρχεία.", loading: "Φόρτωση εργαλείων PDF…",
      working: (i, n) => `Επεξεργασία ${i} από ${n}…`, pageOf: (f, p, n) => `${f}: σελίδα ${p} από ${n}…`,
      saving: "Αποθήκευση…", done: "Έτοιμο.", pages: (n) => (n === 1 ? "1 σελίδα" : `${n} σελίδες`),
      download: "Λήψη PDF",
      errLib: "Δεν φόρτωσαν τα εργαλεία PDF. Ελέγξτε τη σύνδεση και ανανεώστε μία φορά — μετά δουλεύουν και χωρίς internet.",
      errLocked: (f) => `Το «${f}» έχει κωδικό. Αφαιρέστε πρώτα τον κωδικό.`,
      errBadPdf: (f) => `Το «${f}» δεν διαβάζεται ως PDF.`,
      errImg: (f) => `Το «${f}» δεν διαβάζεται ως εικόνα.`,
      errGeneric: "Κάτι πήγε στραβά.",
      noteNoFit: "Δεν χώρεσε στο όριο ούτε με την ισχυρότερη ρύθμιση — αυτή είναι η μικρότερη εκδοχή.",
      noteBigger: "Αυτό το PDF ήταν ήδη βελτιστοποιημένο: το αρχικό είναι μικρότερο, κρατήστε εκείνο.",
      noteLevel: (l) => `Χρησιμοποιήθηκε συμπίεση «${l}» για να χωρέσει στο όριο.`,
    },
  };
  const t = (k, ...a) => { const v = S[KP.lang()][k] ?? S.en[k]; return typeof v === "function" ? v(...a) : v; };

  // ---------- Tabs ----------
  const tabBtns = [...document.querySelectorAll(".tabs [data-tab]")];
  function showTab(name) {
    for (const b of tabBtns) {
      const on = b.dataset.tab === name;
      b.setAttribute("aria-selected", String(on));
      document.getElementById("tab-" + b.dataset.tab).hidden = !on;
    }
    if (name === "pdf") loadLibs().catch(() => {});
    try { history.replaceState(null, "", name === "pdf" ? "#pdf" : location.pathname + location.search); } catch { /* ignore */ }
  }
  tabBtns.forEach((b) => b.addEventListener("click", () => showTab(b.dataset.tab)));

  // ---------- Libraries (lazy) ----------
  let libsPromise = null, pdfjs = null;
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = () => rej(new Error(t("errLib")));
      document.head.appendChild(s);
    });
  }
  function loadLibs() {
    if (!libsPromise) {
      libsPromise = Promise.all([
        window.PDFLib ? null : loadScript("/vendor/pdf-lib.min.js"),
        import("/vendor/pdf.min.js").then((m) => { pdfjs = m; m.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.js"; }),
      ]).catch((e) => { libsPromise = null; throw new Error(t("errLib")); });
    }
    return libsPromise;
  }

  // ---------- State ----------
  const isPdf = (f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name);
  const isImg = (f) => f.type.startsWith("image/") || /\.(heic|heif|avif)$/i.test(f.name);
  const TOOLS = {
    img2pdf:  { accept: "image/*", filter: isImg, min: 1, drop: "dropImg", sub: "dropSubImg", go: "goImg", order: true },
    merge:    { accept: "application/pdf,.pdf", filter: isPdf, min: 2, drop: "dropPdf", sub: "dropSubMerge", go: "goMerge", order: true },
    compress: { accept: "application/pdf,.pdf", filter: isPdf, min: 1, drop: "dropPdf", sub: "dropSubCompress", go: "goCompress", order: false },
  };
  let tool = "img2pdf", items = [], busy = false, resultUrls = [];

  const el = {
    tools: $("#pdfTools"), drop: $("#pdfDrop"), file: $("#pdfFile"), dropTitle: $("#pdfDropTitle"), dropSub: $("#pdfDropSub"),
    list: $("#pdfList"), go: $("#pdfGo"), status: $("#pdfStatus"), results: $("#pdfResults"),
  };

  function setTool(name) {
    tool = name; items = []; clearResults(); setStatus("");
    for (const b of el.tools.querySelectorAll("[data-tool]")) b.setAttribute("aria-pressed", String(b.dataset.tool === name));
    for (const o of document.querySelectorAll("[data-opts]")) o.hidden = o.dataset.opts !== name;
    el.file.accept = TOOLS[name].accept;
    applyLang();
  }
  el.tools.addEventListener("click", (e) => { const b = e.target.closest("[data-tool]"); if (b && !busy) setTool(b.dataset.tool); });

  // ---------- Input ----------
  el.drop.addEventListener("click", () => el.file.click());
  el.drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.file.click(); } });
  el.file.addEventListener("change", () => { add(el.file.files); el.file.value = ""; });
  ["dragenter", "dragover"].forEach((ev) => el.drop.addEventListener(ev, (e) => { e.preventDefault(); el.drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => el.drop.addEventListener(ev, (e) => { e.preventDefault(); el.drop.classList.remove("over"); }));
  el.drop.addEventListener("drop", (e) => add(e.dataTransfer.files));

  function add(list) {
    if (busy) return;
    const ok = [...list].filter(TOOLS[tool].filter);
    if (!ok.length) return;
    items = items.concat(ok);
    clearResults(); setStatus("");
    renderList(); updateGo();
  }

  el.list.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]"); if (!b || busy) return;
    const i = +b.dataset.i;
    if (b.dataset.act === "up" && i > 0) [items[i - 1], items[i]] = [items[i], items[i - 1]];
    if (b.dataset.act === "down" && i < items.length - 1) [items[i + 1], items[i]] = [items[i], items[i + 1]];
    if (b.dataset.act === "rm") items.splice(i, 1);
    renderList(); updateGo();
  });

  function renderList() {
    if (!items.length) { el.list.innerHTML = `<li class="empty">${esc(t("empty"))}</li>`; return; }
    const order = TOOLS[tool].order;
    el.list.innerHTML = items.map((f, i) => `
      <li>
        <span class="num">${i + 1}</span>
        <span class="fname" title="${esc(f.name)}">${esc(f.name)}</span>
        <span class="fsize">${KP.fmt(f.size)}</span>
        <span class="acts">
          ${order ? `<button class="ib" data-act="up" data-i="${i}" aria-label="${esc(t("up"))}" title="${esc(t("up"))}" ${i === 0 ? "disabled" : ""}>↑</button>
          <button class="ib" data-act="down" data-i="${i}" aria-label="${esc(t("down"))}" title="${esc(t("down"))}" ${i === items.length - 1 ? "disabled" : ""}>↓</button>` : ""}
          <button class="ib" data-act="rm" data-i="${i}" aria-label="${esc(t("remove"))}" title="${esc(t("remove"))}">✕</button>
        </span>
      </li>`).join("");
  }

  function updateGo() {
    el.go.textContent = t(TOOLS[tool].go);
    el.go.disabled = busy || items.length < TOOLS[tool].min;
  }

  function applyLang() {
    for (const n of document.querySelectorAll("[data-pi18n]")) n.textContent = t(n.dataset.pi18n);
    for (const n of document.querySelectorAll("[data-pi18n-ph]")) n.placeholder = t(n.dataset.pi18nPh);
    el.dropTitle.textContent = t(TOOLS[tool].drop);
    el.dropSub.textContent = t(TOOLS[tool].sub);
    el.drop.setAttribute("aria-label", t(TOOLS[tool].drop));
    renderList(); updateGo();
  }
  addEventListener("keeppix:lang", () => { applyLang(); clearResults(); setStatus(""); });

  // ---------- Run ----------
  el.go.addEventListener("click", run);
  async function run() {
    if (busy || items.length < TOOLS[tool].min) return;
    busy = true; updateGo(); clearResults();
    try {
      setStatus(t("loading"));
      await loadLibs();
      if (tool === "img2pdf") await imagesToPdf();
      else if (tool === "merge") await mergePdfs();
      else await compressPdfs();
      setStatus(t("done"));
    } catch (e) {
      setStatus(e && e.message ? e.message : t("errGeneric"), true);
    } finally {
      busy = false; updateGo();
    }
  }

  // Images → PDF
  async function imagesToPdf() {
    const { PDFDocument } = window.PDFLib;
    const out = await PDFDocument.create();
    const size = $("#pdfPage").value, margin = +$("#pdfMargin").value, high = $("#pdfImgQ").value === "high";
    const maxSide = high ? 3508 : 2480, q = high ? 0.92 : 0.85;
    let before = 0;
    for (let i = 0; i < items.length; i++) {
      const f = items[i]; before += f.size;
      setStatus(t("working", i + 1, items.length));
      const bmp = await loadBitmap(f);
      const s = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
      const cw = Math.max(1, Math.round(bmp.width * s)), ch = Math.max(1, Math.round(bmp.height * s));
      const c = canvas(cw, ch), ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cw, ch);
      ctx.imageSmoothingQuality = "high"; ctx.drawImage(bmp, 0, 0, cw, ch);
      if (bmp.close) bmp.close();
      const img = await out.embedJpg(await canvasBytes(c, "image/jpeg", q));
      let pw, ph;
      if (size === "fit") { const k = 842 / Math.max(cw, ch); pw = cw * k + 2 * margin; ph = ch * k + 2 * margin; }
      else { const [a, b] = size === "letter" ? [612, 792] : [595.28, 841.89]; [pw, ph] = cw > ch ? [b, a] : [a, b]; }
      const page = out.addPage([pw, ph]);
      const k = Math.min((pw - 2 * margin) / cw, (ph - 2 * margin) / ch);
      const dw = cw * k, dh = ch * k;
      page.drawImage(img, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
      c.width = c.height = 0;
    }
    setStatus(t("saving"));
    const bytes = await out.save();
    const name = (items.length === 1 ? base(items[0].name) : "images") + ".pdf";
    addResult(name, bytes, before, out.getPageCount(), []);
  }

  // Merge
  async function mergePdfs() {
    const { PDFDocument } = window.PDFLib;
    const out = await PDFDocument.create();
    let before = 0;
    for (let i = 0; i < items.length; i++) {
      const f = items[i]; before += f.size;
      setStatus(t("working", i + 1, items.length));
      const src = await loadPdfLib(f);
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((p) => out.addPage(p));
    }
    setStatus(t("saving"));
    const bytes = await out.save({ useObjectStreams: true });
    addResult("merged.pdf", bytes, before, out.getPageCount(), []);
  }

  async function loadPdfLib(f) {
    const bytes = new Uint8Array(await f.arrayBuffer());
    try { return await window.PDFLib.PDFDocument.load(bytes, { updateMetadata: false }); }
    catch (e) {
      if (/encrypt/i.test(String(e && (e.name + e.message)))) throw new Error(t("errLocked", f.name));
      throw new Error(t("errBadPdf", f.name));
    }
  }

  // Compress
  const LEVELS = {
    light:    { dpi: 200, q: 0.82 },
    balanced: { dpi: 144, q: 0.7 },
    strong:   { dpi: 110, q: 0.55 },
    extreme:  { dpi: 84,  q: 0.45 },
  };
  const ORDER = ["light", "balanced", "strong", "extreme"];
  const LEVEL_NAME = { light: "lLight", balanced: "lBalanced", strong: "lStrong", extreme: "lStrong" };

  async function compressPdfs() {
    const level = $("#pdfLevel").value, gray = $("#pdfGray").checked;
    const mb = parseFloat($("#pdfMax").value);
    const maxBytes = Number.isFinite(mb) && mb > 0 ? mb * 1024 * 1024 : 0;
    for (const f of items) {
      const data = new Uint8Array(await f.arrayBuffer());
      const task = pdfjs.getDocument({ data, isEvalSupported: false, useSystemFonts: true });
      let doc;
      try { doc = await task.promise; }
      catch (e) {
        if (e && e.name === "PasswordException") throw new Error(t("errLocked", f.name));
        throw new Error(t("errBadPdf", f.name));
      }
      let best = null, used = level;
      for (let li = ORDER.indexOf(level); li < ORDER.length; li++) {
        used = ORDER[li];
        const bytes = await rasterize(doc, LEVELS[used], gray, f.name);
        if (!best || bytes.length < best.length) best = bytes;
        if (!maxBytes || bytes.length <= maxBytes) break;
      }
      const notes = [];
      if (maxBytes && best.length > maxBytes) notes.push(t("noteNoFit"));
      else if (used !== level) notes.push(t("noteLevel", t(LEVEL_NAME[used]).split(" — ")[0].split(" (")[0]));
      if (best.length >= f.size) notes.push(t("noteBigger"));
      addResult(base(f.name) + "-compressed.pdf", best, f.size, doc.numPages, notes);
      await task.destroy();
    }
  }

  async function rasterize(doc, { dpi, q }, gray, label) {
    const out = await window.PDFLib.PDFDocument.create();
    for (let p = 1; p <= doc.numPages; p++) {
      setStatus(t("pageOf", label, p, doc.numPages));
      const page = await doc.getPage(p);
      const vp1 = page.getViewport({ scale: 1 });
      const scale = Math.min(dpi / 72, 4000 / Math.max(vp1.width, vp1.height));
      const vp = page.getViewport({ scale });
      const c = canvas(Math.ceil(vp.width), Math.ceil(vp.height)), ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      await page.render({ canvas: c, canvasContext: ctx, viewport: vp, background: "#ffffff" }).promise;
      if (gray) toGray(c);
      const img = await out.embedJpg(await canvasBytes(c, "image/jpeg", q));
      out.addPage([vp1.width, vp1.height]).drawImage(img, { x: 0, y: 0, width: vp1.width, height: vp1.height });
      page.cleanup();
      c.width = c.height = 0;
    }
    return out.save({ useObjectStreams: true });
  }

  function toGray(c) {
    const ctx = c.getContext("2d");
    const d = ctx.getImageData(0, 0, c.width, c.height), a = d.data;
    for (let i = 0; i < a.length; i += 4) {
      const y = (a[i] * 299 + a[i + 1] * 587 + a[i + 2] * 114) / 1000;
      a[i] = a[i + 1] = a[i + 2] = y;
    }
    ctx.putImageData(d, 0, 0);
  }

  // ---------- Helpers ----------
  function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function canvasBytes(c, type, q) {
    return new Promise((res, rej) => c.toBlob((b) => (b ? b.arrayBuffer().then((ab) => res(new Uint8Array(ab)), rej) : rej(new Error(t("errGeneric")))), type, q));
  }
  async function loadBitmap(f) {
    if ("createImageBitmap" in window) {
      try { return await createImageBitmap(f, { imageOrientation: "from-image" }); } catch { /* fall through */ }
    }
    const url = URL.createObjectURL(f);
    try { const img = new Image(); img.src = url; await img.decode(); return img; }
    catch { throw new Error(t("errImg", f.name)); }
    finally { URL.revokeObjectURL(url); }
  }
  const base = (n) => n.replace(/\.[^.]+$/, "") || "document";
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function setStatus(msg, err) { el.status.textContent = msg; el.status.classList.toggle("err", !!err); }

  function clearResults() {
    for (const u of resultUrls) URL.revokeObjectURL(u);
    resultUrls = []; el.results.innerHTML = "";
  }
  function addResult(name, bytes, before, pages, notes) {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob); resultUrls.push(url);
    const pct = Math.round((1 - blob.size / before) * 100);
    const change = pct >= 0 ? `<span class="save">−${pct}%</span>` : `<span class="save worse">+${-pct}%</span>`;
    const card = document.createElement("div"); card.className = "card pdfcard";
    card.innerHTML = `
      <div class="meta">
        <div class="name" title="${esc(name)}">📄 ${esc(name)}</div>
        <div class="sizes">${KP.fmt(before)} → <b>${KP.fmt(blob.size)}</b> ${change}</div>
        <div>${esc(t("pages", pages))}</div>
        ${notes.map((n) => `<div class="note">${esc(n)}</div>`).join("")}
      </div>`;
    const a = document.createElement("a");
    a.className = "btn"; a.href = url; a.download = name; a.textContent = t("download");
    card.querySelector(".meta").appendChild(a);
    el.results.appendChild(card);
  }

  // ---------- Init ----------
  setTool("img2pdf");
  showTab(location.hash === "#pdf" ? "pdf" : "images");
})();

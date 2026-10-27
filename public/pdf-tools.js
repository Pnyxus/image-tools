// Kratopix PDF tools: images → PDF, merge PDFs, compress PDF, edit PDF.
// Everything runs in the browser. Libraries (pdf-lib, PDF.js) are served from this site
// and only loaded when the PDF tab is opened. No file is ever sent anywhere.
(() => {
  "use strict";
  const KP = window.Kratopix;
  const $ = (s) => document.querySelector(s);

  // ---------- Strings ----------
  const S = {
    en: {
      toolImg: "Images → PDF", toolMerge: "Merge PDFs", toolCompress: "Compress PDF",
      dropImg: "Drop images here or click to choose", dropPdf: "Drop PDF files here or click to choose",
      dropImgTap: "Tap to choose images", dropPdfTap: "Tap to choose PDF files", dropPdf1Tap: "Tap to choose a PDF",
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
      toolEdit: "Edit PDF", dropPdf1: "Drop a PDF here or click to choose", dropSubEdit: "Open one PDF, then add text, highlights, drawings, or hide parts of a page.",
      goEdit: "Save PDF", edText: "Text", edHighlight: "Highlight", edDraw: "Draw", edWhite: "White-out",
      edBlack: "Black out", edBlur: "Blur", edErase: "Remove", edColor: "Color", edSize: "Size",
      szS: "Small", szM: "Medium", szL: "Large", edUndo: "Undo",
      hintNone: "Pick a tool, then click or drag on a page.",
      hintPinch: "Two fingers: zoom and move the page.",
      hint_text: "Click where the text should go, type, then press Enter. Shift+Enter starts a new line.",
      hint_highlight: "Drag over the text you want to highlight.",
      hint_draw: "Draw with the mouse or your finger.",
      hint_whiteout: "Drag a box to cover something with white.",
      hint_blackout: "Drag a box over what you want to hide.",
      hint_blur: "Drag a box over what you want to blur.",
      hint_erase: "Click a mark to remove it.",
      editNote: "White-out, black out and blur really remove what’s underneath: those pages are saved as images, so their text can’t be selected or copied afterwards. Other pages stay as they were.",
      noteFlat: (n) => (n === 1 ? "1 page with hidden areas was saved as an image. The hidden content is gone from the file." : `${n} pages with hidden areas were saved as images. The hidden content is gone from the file.`),
      noEdits: "Add at least one change before saving.",
      rendering: (p, n) => `Loading page ${p} of ${n}…`,
    },
    el: {
      toolImg: "Εικόνες → PDF", toolMerge: "Ένωση PDF", toolCompress: "Συμπίεση PDF",
      dropImg: "Σύρετε εικόνες εδώ ή πατήστε για επιλογή", dropPdf: "Σύρετε αρχεία PDF εδώ ή πατήστε για επιλογή",
      dropImgTap: "Πατήστε για να επιλέξετε εικόνες", dropPdfTap: "Πατήστε για να επιλέξετε αρχεία PDF", dropPdf1Tap: "Πατήστε για να επιλέξετε ένα PDF",
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
      toolEdit: "Επεξεργασία PDF", dropPdf1: "Σύρετε ένα PDF εδώ ή πατήστε για επιλογή", dropSubEdit: "Ανοίξτε ένα PDF και προσθέστε κείμενο, επισήμανση, σχέδιο ή κρύψτε σημεία μιας σελίδας.",
      goEdit: "Αποθήκευση PDF", edText: "Κείμενο", edHighlight: "Επισήμανση", edDraw: "Σχέδιο", edWhite: "Λευκό",
      edBlack: "Μαύρισμα", edBlur: "Θόλωμα", edErase: "Αφαίρεση", edColor: "Χρώμα", edSize: "Μέγεθος",
      szS: "Μικρό", szM: "Μεσαίο", szL: "Μεγάλο", edUndo: "Αναίρεση",
      hintNone: "Διαλέξτε εργαλείο και πατήστε ή σύρετε πάνω στη σελίδα.",
      hintPinch: "Δύο δάχτυλα: ζουμ και μετακίνηση της σελίδας.",
      hint_text: "Πατήστε εκεί που θέλετε το κείμενο, γράψτε και πατήστε Enter. Με Shift+Enter αλλάζετε γραμμή.",
      hint_highlight: "Σύρετε πάνω στο κείμενο που θέλετε να επισημάνετε.",
      hint_draw: "Σχεδιάστε με το ποντίκι ή με το δάχτυλο.",
      hint_whiteout: "Σύρετε ένα πλαίσιο για να καλύψετε κάτι με λευκό.",
      hint_blackout: "Σύρετε ένα πλαίσιο πάνω σε ό,τι θέλετε να κρύψετε.",
      hint_blur: "Σύρετε ένα πλαίσιο πάνω σε ό,τι θέλετε να θολώσετε.",
      hint_erase: "Πατήστε ένα σημάδι για να το αφαιρέσετε.",
      editNote: "Το λευκό, το μαύρισμα και το θόλωμα αφαιρούν πραγματικά ό,τι υπάρχει από κάτω: αυτές οι σελίδες αποθηκεύονται ως εικόνες, οπότε το κείμενό τους δεν θα επιλέγεται μετά. Οι υπόλοιπες σελίδες μένουν όπως ήταν.",
      noteFlat: (n) => (n === 1 ? "1 σελίδα με κρυμμένα σημεία αποθηκεύτηκε ως εικόνα. Το κρυμμένο περιεχόμενο δεν υπάρχει πια στο αρχείο." : `${n} σελίδες με κρυμμένα σημεία αποθηκεύτηκαν ως εικόνες. Το κρυμμένο περιεχόμενο δεν υπάρχει πια στο αρχείο.`),
      noEdits: "Κάντε τουλάχιστον μία αλλαγή πριν την αποθήκευση.",
      rendering: (p, n) => `Φόρτωση σελίδας ${p} από ${n}…`,
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
    try { history.replaceState(null, "", name === "images" ? location.pathname + location.search : "#" + name); } catch { /* ignore */ }
  }
  tabBtns.forEach((b) => b.addEventListener("click", () => {
    const same = b.getAttribute("aria-selected") === "true";
    showTab(b.dataset.tab);
    if (!same && MOBILE.matches) scrollTo(0, 0);   // app-style: each tab opens at its top
  }));
  // On wide screens there is no About tab (that text is always shown below), so fall back to Images.
  const MOBILE = matchMedia("(max-width: 700px)");
  MOBILE.addEventListener?.("change", () => { if (!MOBILE.matches && location.hash === "#about") showTab("images"); });

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
    edit:     { accept: "application/pdf,.pdf", filter: isPdf, min: 1, drop: "dropPdf1", sub: "dropSubEdit", go: "goEdit", order: false, single: true },
  };
  let tool = "img2pdf", items = [], busy = false, resultUrls = [];

  const el = {
    tools: $("#pdfTools"), drop: $("#pdfDrop"), file: $("#pdfFile"), dropTitle: $("#pdfDropTitle"), dropSub: $("#pdfDropSub"),
    list: $("#pdfList"), go: $("#pdfGo"), status: $("#pdfStatus"), results: $("#pdfResults"),
  };

  function setTool(name) {
    tool = name; items = []; clearResults(); setStatus(""); closeEditor();
    for (const b of el.tools.querySelectorAll("[data-tool]")) b.setAttribute("aria-pressed", String(b.dataset.tool === name));
    for (const o of document.querySelectorAll("[data-opts]")) o.hidden = o.dataset.opts !== name;
    el.file.accept = TOOLS[name].accept;
    el.file.multiple = !TOOLS[name].single;
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
    items = TOOLS[tool].single ? [ok[0]] : items.concat(ok);
    clearResults(); setStatus("");
    renderList(); updateGo();
    if (tool === "edit") openEditor(items[0]);
  }

  el.list.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]"); if (!b || busy) return;
    const i = +b.dataset.i;
    if (b.dataset.act === "up" && i > 0) [items[i - 1], items[i]] = [items[i], items[i - 1]];
    if (b.dataset.act === "down" && i < items.length - 1) [items[i + 1], items[i]] = [items[i], items[i + 1]];
    if (b.dataset.act === "rm") { items.splice(i, 1); if (tool === "edit") closeEditor(); }
    renderList(); updateGo();
  });

  function renderList() {
    if (!items.length) { el.list.innerHTML = `<li class="empty">${esc(t("empty"))}</li>`; return; }
    const order = TOOLS[tool].order;
    el.list.innerHTML = items.map((f, i) => `
      <li>
        <span class="num">${i + 1}</span>
        ${thumbHtml(f)}
        <span class="finfo">
          <span class="fname" title="${esc(f.name)}">${esc(f.name)}</span>
          <span class="fsize">${KP.fmt(f.size)}${thumbs.get(f)?.pages ? " · " + esc(t("pages", thumbs.get(f).pages)) : ""}</span>
        </span>
        <span class="acts">
          ${order ? `<button class="ib" data-act="up" data-i="${i}" aria-label="${esc(t("up"))}" title="${esc(t("up"))}" ${i === 0 ? "disabled" : ""}>↑</button>
          <button class="ib" data-act="down" data-i="${i}" aria-label="${esc(t("down"))}" title="${esc(t("down"))}" ${i === items.length - 1 ? "disabled" : ""}>↓</button>` : ""}
          <button class="ib" data-act="rm" data-i="${i}" aria-label="${esc(t("remove"))}" title="${esc(t("remove"))}">✕</button>
        </span>
      </li>`).join("");
  }

  // ---------- Previews ----------
  // Small first-page (PDF) or picture (image) previews for the file list, made on this device.
  const thumbs = new WeakMap(); // File -> { url, pages } (url "" = no preview possible)
  const thumbQueue = [];
  let thumbBusy = false;
  const THUMB_PX = 112; // ~56 CSS px at 2x

  function thumbHtml(f) {
    if (tool === "edit") return "";
    const th = thumbs.get(f);
    if (!th) { queueThumb(f); return `<span class="thumb wait" aria-hidden="true"></span>`; }
    if (!th.url) return `<span class="thumb none" aria-hidden="true">${isPdf(f) ? "PDF" : ""}</span>`;
    return `<span class="thumb" aria-hidden="true"><img src="${th.url}" alt=""></span>`;
  }
  function queueThumb(f) {
    if (thumbQueue.includes(f)) return;
    thumbQueue.push(f);
    if (!thumbBusy) drainThumbs();
  }
  async function drainThumbs() {
    thumbBusy = true;
    while (thumbQueue.length) {
      const f = thumbQueue.shift();
      if (thumbs.has(f) || !items.includes(f)) continue;
      let th = { url: "", pages: 0 };
      try { th = isPdf(f) ? await pdfThumb(f) : await imgThumb(f); } catch {}
      thumbs.set(f, th);
      if (items.includes(f) && !busy) renderList();
    }
    thumbBusy = false;
  }
  function canvasUrl(c) {
    return new Promise((res) => c.toBlob((b) => res(b ? URL.createObjectURL(b) : ""), "image/jpeg", 0.8));
  }
  async function pdfThumb(f) {
    await loadLibs();
    const task = pdfjs.getDocument({ data: new Uint8Array(await f.arrayBuffer()), isEvalSupported: false, useSystemFonts: true });
    try {
      const doc = await task.promise;
      const page = await doc.getPage(1);
      const v1 = page.getViewport({ scale: 1 });
      const vp = page.getViewport({ scale: THUMB_PX / Math.max(v1.width, v1.height) });
      const c = document.createElement("canvas");
      c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      return { url: await canvasUrl(c), pages: doc.numPages };
    } finally { task.destroy(); }
  }
  async function imgThumb(f) {
    const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
    const k = THUMB_PX / Math.max(bmp.width, bmp.height);
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
    const ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close?.();
    return { url: await canvasUrl(c), pages: 0 };
  }

  function updateGo() {
    el.go.textContent = t(TOOLS[tool].go);
    el.go.disabled = busy || items.length < TOOLS[tool].min || (tool === "edit" && !ED.doc);
  }

  function applyLang() {
    for (const n of document.querySelectorAll("[data-pi18n]")) n.textContent = t(n.dataset.pi18n);
    for (const n of document.querySelectorAll("[data-pi18n-ph]")) n.placeholder = t(n.dataset.pi18nPh);
    el.dropTitle.textContent = t(TOOLS[tool].drop + (KP.touch ? "Tap" : ""));
    el.dropSub.textContent = t(TOOLS[tool].sub);
    el.drop.setAttribute("aria-label", t(TOOLS[tool].drop));
    edHint();
    renderList(); updateGo();
  }
  addEventListener("kratopix:lang", () => { applyLang(); clearResults(); setStatus(""); });

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
      else if (tool === "edit") await saveEdited();
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

  // ---------- Edit PDF ----------
  // Marks are stored in page units (PDF points, top-left origin, as the page is shown).
  // On save, pages with white-out / black out / blur are re-drawn as images, so whatever was
  // underneath is really gone. Other pages are copied as they are, with the marks added on top.
  const REDACT = new Set(["whiteout", "blackout", "blur"]);
  const SIZES = { text: { s: 11, m: 16, l: 26 }, draw: { s: 1.5, m: 3, l: 6 } };
  const FONT = 'system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans",sans-serif';
  const ED = { doc: null, task: null, file: null, pages: [], hist: [], tool: "", gen: 0, io: null };
  const ed = {
    root: $("#pdfEditor"), tools: $("#edTools"), pages: $("#edPages"), color: $("#edColor"), size: $("#edSize"),
    undo: $("#edUndo"), hint: $("#edHint"),
  };

  function edHint() { ed.hint.textContent = t(ED.tool ? "hint_" + ED.tool : "hintNone") + (KP.touch ? " " + t("hintPinch") : ""); }
  function setEdTool(name) {
    commitText();
    ED.tool = ED.tool === name ? "" : name;
    for (const b of ed.tools.querySelectorAll("[data-ed]")) b.setAttribute("aria-pressed", String(b.dataset.ed === ED.tool));
    if (ED.tool) ed.root.dataset.tool = ED.tool; else delete ed.root.dataset.tool;
    edHint();
  }
  ed.tools.addEventListener("click", (e) => { const b = e.target.closest("[data-ed]"); if (b && !busy) setEdTool(b.dataset.ed); });
  ed.undo.addEventListener("click", () => {
    if (busy) return;
    commitText();
    while (ED.hist.length) {
      const a = ED.hist.pop(), pg = ED.pages[a.page], i = pg.anns.indexOf(a);
      if (i >= 0) { pg.anns.splice(i, 1); drawOverlay(pg); break; }
    }
    edButtons();
  });
  function edButtons() { ed.undo.disabled = !ED.pages.some((p) => p.anns.length); }

  function closeEditor() {
    commitText(true);
    ED.gen++;
    if (ED.io) ED.io.disconnect();
    for (const p of ED.pages) { if (p.pc) p.pc.width = p.pc.height = 0; if (p.ov) p.ov.width = p.ov.height = 0; }
    if (ED.task) ED.task.destroy();
    Object.assign(ED, { doc: null, task: null, file: null, pages: [], hist: [], io: null });
    ed.pages.innerHTML = "";
    ed.root.hidden = true;
    updateGo();
  }

  async function openEditor(f) {
    closeEditor();
    const gen = ED.gen;
    try {
      setStatus(t("loading"));
      await loadLibs();
      const data = new Uint8Array(await f.arrayBuffer());
      const task = pdfjs.getDocument({ data, isEvalSupported: false, useSystemFonts: true });
      let doc;
      try { doc = await task.promise; }
      catch (e) {
        task.destroy();
        if (e && e.name === "PasswordException") throw new Error(t("errLocked", f.name));
        throw new Error(t("errBadPdf", f.name));
      }
      if (gen !== ED.gen) { task.destroy(); return; }
      Object.assign(ED, { doc, task, file: f });
      for (let p = 1; p <= doc.numPages; p++) {
        setStatus(t("rendering", p, doc.numPages));
        const page = await doc.getPage(p);
        if (gen !== ED.gen) return;
        const vp = page.getViewport({ scale: 1 });
        const box = document.createElement("div");
        box.className = "edpage";
        box.style.aspectRatio = `${vp.width} / ${vp.height}`;
        box.innerHTML = `<span class="pno">${p}</span>`;
        const pg = { i: p - 1, page, vp, rot: page.rotate || 0, box, pc: null, ov: null, anns: [], drawn: false };
        box.dataset.i = p - 1;
        ed.pages.appendChild(box);
        ED.pages.push(pg);
      }
      ed.root.hidden = false;
      ED.io = new IntersectionObserver((ents) => {
        for (const en of ents) if (en.isIntersecting) renderPage(ED.pages[+en.target.dataset.i], gen);
      }, { rootMargin: "600px 0px" });
      for (const pg of ED.pages) ED.io.observe(pg.box);
      setStatus(""); edHint(); edButtons(); updateGo();
    } catch (e) {
      if (gen === ED.gen) setStatus(e && e.message ? e.message : t("errGeneric"), true);
    }
  }

  async function renderPage(pg, gen) {
    if (pg.drawn) return;
    pg.drawn = true;
    const css = pg.box.clientWidth || 800;
    const scale = Math.min(css * Math.min(devicePixelRatio || 1, 2), 2400) / pg.vp.width;
    const vp = pg.page.getViewport({ scale });
    const pc = canvas(Math.ceil(vp.width), Math.ceil(vp.height));
    const ov = canvas(pc.width, pc.height);
    ov.className = "ov";
    const ctx = pc.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, pc.width, pc.height);
    try { await pg.page.render({ canvas: pc, canvasContext: ctx, viewport: vp, background: "#ffffff" }).promise; }
    catch { pg.drawn = false; return; }
    if (gen !== ED.gen) return;
    pg.pc = pc; pg.ov = ov; pg.k = pc.width / pg.vp.width;
    pg.box.prepend(pc); pg.box.appendChild(ov);
    bindOverlay(pg);
    drawOverlay(pg);
  }

  // Draw the marks of one page onto ctx. k = pixels per page unit. src = canvas with the page image (for blur).
  function paintAnn(ctx, a, k, src) {
    ctx.save();
    if (a.type === "highlight") {
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(255,226,0,.45)";
      ctx.fillRect(a.x * k, a.y * k, a.w * k, a.h * k);
    } else if (a.type === "whiteout" || a.type === "blackout") {
      ctx.fillStyle = a.type === "whiteout" ? "#fff" : "#000";
      ctx.fillRect(a.x * k, a.y * k, a.w * k, a.h * k);
    } else if (a.type === "blur") {
      const x = Math.max(0, Math.floor(a.x * k)), y = Math.max(0, Math.floor(a.y * k));
      const w = Math.min(src.width - x, Math.ceil(a.w * k)), h = Math.min(src.height - y, Math.ceil(a.h * k));
      if (w > 0 && h > 0) {
        // Shrink to ~7-point blocks and scale back up smoothly: the detail is thrown away, not just softened.
        const block = Math.max(2, 7 * k);
        const sw = Math.max(1, Math.round(w / block)), sh = Math.max(1, Math.round(h / block));
        const tiny = canvas(sw, sh), tc = tiny.getContext("2d");
        tc.imageSmoothingQuality = "high";
        tc.drawImage(src, x, y, w, h, 0, 0, sw, sh);
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
        ctx.drawImage(tiny, 0, 0, sw, sh, x, y, w, h);
      }
    } else if (a.type === "draw") {
      ctx.strokeStyle = a.color; ctx.lineWidth = a.lw * k; ctx.lineCap = ctx.lineJoin = "round";
      ctx.beginPath();
      a.pts.forEach(([px, py], i) => (i ? ctx.lineTo(px * k, py * k) : ctx.moveTo(px * k, py * k)));
      if (a.pts.length === 1) ctx.lineTo(a.pts[0][0] * k + 0.01, a.pts[0][1] * k);
      ctx.stroke();
    } else if (a.type === "text") {
      ctx.fillStyle = a.color; ctx.textBaseline = "top"; ctx.font = `${a.size * k}px ${FONT}`;
      a.text.split("\n").forEach((ln, i) => ctx.fillText(ln, a.x * k, (a.y + i * a.size * 1.25 + a.size * 0.1) * k));
    }
    ctx.restore();
  }

  function drawOverlay(pg, extra) {
    if (!pg.ov) return;
    const ctx = pg.ov.getContext("2d");
    ctx.clearRect(0, 0, pg.ov.width, pg.ov.height);
    for (const a of extra ? pg.anns.concat(extra) : pg.anns) {
      if (a.type === "blur") {
        // Preview blur from the page image (what's under it); mark the box so it's visible.
        paintAnn(ctx, a, pg.k, pg.pc);
        ctx.save(); ctx.strokeStyle = "rgba(15,118,110,.6)"; ctx.setLineDash([4, 3]);
        ctx.strokeRect(a.x * pg.k, a.y * pg.k, a.w * pg.k, a.h * pg.k); ctx.restore();
      } else paintAnn(ctx, a, pg.k, pg.pc);
    }
  }

  function measureText(text, size) {
    const c = measureText.c || (measureText.c = canvas(1, 1).getContext("2d"));
    c.font = `${size}px ${FONT}`;
    const lines = text.split("\n");
    return { w: Math.max(...lines.map((l) => c.measureText(l).width)) + size * 0.1, h: lines.length * size * 1.25 };
  }

  function bbox(a) {
    if (a.type === "draw") {
      const xs = a.pts.map((p) => p[0]), ys = a.pts.map((p) => p[1]), m = a.lw / 2 + 3;
      return { x: Math.min(...xs) - m, y: Math.min(...ys) - m, w: Math.max(...xs) - Math.min(...xs) + 2 * m, h: Math.max(...ys) - Math.min(...ys) + 2 * m };
    }
    return a;
  }

  function addAnn(pg, a) { a.page = pg.i; pg.anns.push(a); ED.hist.push(a); drawOverlay(pg); edButtons(); }

  function bindOverlay(pg) {
    const ov = pg.ov;
    const pos = (e) => { const r = ov.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * pg.vp.width, (e.clientY - r.top) / r.height * pg.vp.height]; };
    // Phones: one finger uses the tool, two fingers zoom and move the page (CSS touch-action: pinch-zoom).
    // A second finger, or the browser taking over for a zoom (pointercancel), throws away the mark in progress.
    const fingers = new Set();
    let drag = null, tap = null;
    ov.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch") fingers.add(e.pointerId);
      if (fingers.size > 1) { drag = null; tap = null; drawOverlay(pg); return; }
      if (!ED.tool || busy || (e.pointerType === "mouse" && e.button !== 0)) return;
      const [x, y] = pos(e);
      if (ED.tool === "text" || ED.tool === "erase") {
        // Acted on when the finger lifts, so the first finger of a pinch doesn't add text or remove a mark.
        if (ED.tool === "text") e.preventDefault();
        tap = { id: e.pointerId, x, y, cx: e.clientX, cy: e.clientY };
        return;
      }
      commitText();
      e.preventDefault();
      ov.setPointerCapture(e.pointerId);
      drag = ED.tool === "draw"
        ? { type: "draw", pts: [[x, y]], color: ed.color.value, lw: SIZES.draw[ed.size.value] }
        : { type: ED.tool, x0: x, y0: y, x, y, w: 0, h: 0 };
      drawOverlay(pg, drag);
    });
    ov.addEventListener("pointermove", (e) => {
      if (tap && Math.hypot(e.clientX - tap.cx, e.clientY - tap.cy) > 10) tap = null;
      if (!drag) return;
      const [x, y] = pos(e);
      if (drag.type === "draw") drag.pts.push([x, y]);
      else Object.assign(drag, { x: Math.min(x, drag.x0), y: Math.min(y, drag.y0), w: Math.abs(x - drag.x0), h: Math.abs(y - drag.y0) });
      drawOverlay(pg, drag);
    });
    const lift = (e) => { fingers.delete(e.pointerId); };
    ov.addEventListener("pointerup", (e) => {
      lift(e);
      if (tap && tap.id === e.pointerId) {
        const { x, y } = tap; tap = null;
        if (ED.tool === "text") startText(pg, x, y);
        else if (ED.tool === "erase") {
          for (let i = pg.anns.length - 1; i >= 0; i--) {
            const b = bbox(pg.anns[i]);
            if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { pg.anns.splice(i, 1); drawOverlay(pg); edButtons(); break; }
          }
        }
        return;
      }
      if (!drag) return;
      const a = drag; drag = null;
      if (a.type === "draw") {
        a.pts = a.pts.map(([x, y]) => [+x.toFixed(2), +y.toFixed(2)]);
        addAnn(pg, a);
      } else if (a.w >= 2 && a.h >= 2) {
        delete a.x0; delete a.y0;
        addAnn(pg, a);
      } else drawOverlay(pg);
    });
    ov.addEventListener("pointercancel", (e) => {
      lift(e);
      tap = null;
      if (drag) { drag = null; drawOverlay(pg); }
    });
  }

  // Text: a small box appears where you click; Enter adds it to the page.
  let typing = null;
  function startText(pg, x, y) {
    commitText();
    const size = SIZES.text[ed.size.value], color = ed.color.value;
    const ta = document.createElement("textarea");
    ta.rows = 1; ta.spellcheck = false;
    ta.setAttribute("aria-label", t("edText"));
    const scale = () => pg.box.clientWidth / pg.vp.width;
    Object.assign(ta.style, {
      left: (x / pg.vp.width * 100) + "%", top: (y / pg.vp.height * 100) + "%",
      fontSize: size * scale() + "px", color, height: size * 1.25 * scale() + 4 + "px", width: "8em",
    });
    const fit = () => {
      const m = measureText(ta.value || "M", size), s = scale();
      ta.style.width = Math.max(m.w * s + 12, 60) + "px";
      ta.style.height = m.h * s + 4 + "px";
    };
    ta.addEventListener("input", fit);
    ta.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitText(); }
      else if (e.key === "Escape") { e.preventDefault(); commitText(true); }
    });
    ta.addEventListener("blur", () => setTimeout(() => { if (typing && typing.ta === ta) commitText(); }, 0));
    pg.box.appendChild(ta);
    typing = { pg, ta, x, y, size, color };
    fit();
    ta.focus();
  }
  function commitText(cancel) {
    if (!typing) return;
    const { pg, ta, x, y, size, color } = typing;
    typing = null;
    const text = ta.value.replace(/\s+$/, "");
    ta.remove();
    if (cancel || !text.trim()) return;
    const m = measureText(text, size);
    addAnn(pg, { type: "text", text, x, y, size, color, w: m.w, h: m.h });
  }

  // ---------- Save ----------
  function hexRgb(h) { const n = parseInt(h.slice(1), 16); return window.PDFLib.rgb((n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255); }

  async function saveEdited() {
    commitText();
    if (!ED.doc) throw new Error(t("errGeneric"));
    if (!ED.pages.some((p) => p.anns.length)) throw new Error(t("noEdits"));
    const { PDFDocument, degrees, BlendMode } = window.PDFLib;
    const f = ED.file;
    const src = await loadPdfLib(f);
    const out = await PDFDocument.create();
    let flat = 0;
    for (const pg of ED.pages) {
      setStatus(t("pageOf", f.name, pg.i + 1, ED.pages.length));
      const anns = pg.anns;
      if (anns.some((a) => REDACT.has(a.type))) {
        // Re-draw the whole page as one image: nothing from the original page is kept.
        flat++;
        const k = Math.min(200 / 72, 4000 / Math.max(pg.vp.width, pg.vp.height));
        const vp = pg.page.getViewport({ scale: k });
        const c = canvas(Math.ceil(vp.width), Math.ceil(vp.height)), ctx = c.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
        await pg.page.render({ canvas: c, canvasContext: ctx, viewport: vp, background: "#ffffff" }).promise;
        for (const a of anns) paintAnn(ctx, a, c.width / pg.vp.width, c);
        const img = await out.embedJpg(await canvasBytes(c, "image/jpeg", 0.9));
        out.addPage([pg.vp.width, pg.vp.height]).drawImage(img, { x: 0, y: 0, width: pg.vp.width, height: pg.vp.height });
        c.width = c.height = 0;
        continue;
      }
      const [page] = await out.copyPages(src, [pg.i]);
      out.addPage(page);
      const P = (x, y) => { const [px, py] = pg.vp.convertToPdfPoint(x, y); return { x: px, y: py }; };
      for (const a of anns) {
        if (a.type === "highlight") {
          const p1 = P(a.x, a.y), p2 = P(a.x + a.w, a.y + a.h);
          page.drawRectangle({
            x: Math.min(p1.x, p2.x), y: Math.min(p1.y, p2.y), width: Math.abs(p2.x - p1.x), height: Math.abs(p2.y - p1.y),
            color: window.PDFLib.rgb(1, 0.886, 0), opacity: 0.45, blendMode: BlendMode.Multiply,
          });
        } else if (a.type === "draw") {
          const pts = a.pts.length === 1 ? [a.pts[0], [a.pts[0][0] + 0.01, a.pts[0][1]]] : a.pts;
          const path = pts.map(([x, y], i) => { const p = P(x, y); return `${i ? "L" : "M"}${p.x.toFixed(2)} ${(-p.y).toFixed(2)}`; }).join(" ");
          page.drawSvgPath(path, { x: 0, y: 0, borderColor: hexRgb(a.color), borderWidth: a.lw, borderLineCap: 1 });
        } else if (a.type === "text") {
          // Text is placed as a sharp image so every language (Greek included) shows correctly.
          const k = 4, c = canvas(Math.ceil(a.w * k) + 2, Math.ceil(a.h * k) + 2);
          paintAnn(c.getContext("2d"), { ...a, x: 0, y: 0 }, k);
          const img = await out.embedPng(await canvasBytes(c, "image/png"));
          const w = c.width / k, h = c.height / k, p = P(a.x, a.y + h);
          page.drawImage(img, { x: p.x, y: p.y, width: w, height: h, rotate: degrees(pg.rot) });
          c.width = c.height = 0;
        }
      }
    }
    setStatus(t("saving"));
    const bytes = await out.save({ useObjectStreams: true });
    addResult(base(f.name) + "-edited.pdf", bytes, f.size, out.getPageCount(), flat ? [t("noteFlat", flat)] : [], true);
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
  function addResult(name, bytes, before, pages, notes, noChange) {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob); resultUrls.push(url);
    const pct = Math.round((1 - blob.size / before) * 100);
    const change = noChange ? "" : pct >= 0 ? `<span class="save">−${pct}%</span>` : `<span class="save worse">+${-pct}%</span>`;
    const card = document.createElement("div"); card.className = "card pdfcard";
    card.innerHTML = `
      <div class="meta">
        <div class="name" title="${esc(name)}">📄 ${esc(name)}</div>
        <div class="sizes">${noChange ? `<b>${KP.fmt(blob.size)}</b>` : `${KP.fmt(before)} → <b>${KP.fmt(blob.size)}</b> ${change}`}</div>
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
  showTab(location.hash === "#pdf" ? "pdf" : location.hash === "#about" && MOBILE.matches ? "about" : "images");
})();

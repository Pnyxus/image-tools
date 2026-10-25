// Builds the Greek page public/el/index.html from public/index.html.
// Run after every change to index.html:  node tools/build-el.mjs
// Google reads the raw HTML, so the Greek page needs Greek text, title and tags baked in,
// not only switched on by JavaScript.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import vm from "node:vm";

const SRC = new URL("../public/index.html", import.meta.url);
const OUT = new URL("../public/el/index.html", import.meta.url);
let html = readFileSync(SRC, "utf8");

// Greek texts that exist only in <head> (the rest come from the STR table in index.html)
const DESC = "Δωρεάν συμπίεση και σμίκρυνση εικόνων και PDF μέσα στον browser, π.χ. για αιτήσεις στο gov.gr. Τα αρχεία δεν ανεβαίνουν πουθενά. Χωρίς λογαριασμό.";
const OG_DESC = "Συμπίεση και μετατροπή εικόνων και PDF μέσα στον browser. Τίποτα δεν ανεβαίνει, δουλεύει χωρίς internet, χωρίς λογαριασμό.";
const URL_EL = "https://keeppix.app/el/";

const strSrc = html.match(/const STR = (\{[\s\S]*?\n  \});/);
if (!strSrc) throw new Error("STR table not found in index.html");
const EL = vm.runInNewContext(`(${strSrc[1]})`).el;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
let n = 0;
function swap(re, fn) {
  const before = html;
  html = html.replace(re, fn);
  if (html === before) throw new Error("No match for " + re);
}

swap('<html lang="en">', () => '<html lang="el">');
swap(/<title>[^<]*<\/title>/, () => `<title>${esc(EL.title)}</title>`);
swap(/(<meta name="description" content=")[^"]*/, (_, a) => a + esc(DESC));
swap(/(<link rel="canonical" href=")[^"]*/, (_, a) => a + URL_EL);
swap(/(<meta property="og:url" content=")[^"]*/, (_, a) => a + URL_EL);
swap(/(<meta property="og:locale" content=")[^"]*/, (_, a) => a + "el_GR");
swap(/(<meta property="og:title" content=")[^"]*/, (_, a) => a + esc(EL.title));
swap(/(<meta property="og:description" content=")[^"]*/, (_, a) => a + esc(OG_DESC));
swap(/("url":")https:\/\/keeppix\.app\/(")/, (_, a, b) => a + URL_EL + b);
swap(/("@type":"WebApplication","name":"KeepPix",)/, (m) => m + '"inLanguage":"el",');
html = html.replace(/"inLanguage":\["en","el"\],/, "");
swap(/("description":")Free tools[^"]*/, (_, d) => d + esc(OG_DESC));

// Visible text: elements marked data-i18n="key" with plain-text content
html = html.replace(/(<(\w+)\b[^>]*\sdata-i18n="(\w+)"[^>]*>)([^<]*)(<\/\2>)/g, (m, open, tag, key, _text, close) => {
  if (typeof EL[key] !== "string") return m;
  n++;
  return open + esc(EL[key]).replace(/&quot;/g, '"') + close;
});
// Attributes: title / placeholder / aria-label
for (const [data, attr] of [["data-i18n-title", "title"], ["data-i18n-ph", "placeholder"], ["data-i18n-aria", "aria-label"]]) {
  html = html.replace(new RegExp(`<[^>]*\\s${data}="(\\w+)"[^>]*>`, "g"), (tag, key) =>
    typeof EL[key] === "string" ? tag.replace(new RegExp(`\\s${attr}="[^"]*"`), ` ${attr}="${esc(EL[key])}"`) : tag);
}
// Language button points the other way
swap(/(<button class="btn ghost" id="langBtn" type="button") lang="el">Ελληνικά</, (_, a) => `${a} lang="en">English<`);

html = html.replace("<!doctype html>", "<!doctype html>\n<!-- Generated from public/index.html by tools/build-el.mjs. Do not edit by hand. -->");
mkdirSync(new URL("../public/el/", import.meta.url), { recursive: true });
writeFileSync(OUT, html);
console.log(`✓ public/el/index.html written (${n} texts in Greek)`);

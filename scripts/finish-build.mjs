// Runs after `react-router build`: writes the 404 page and the security headers.
// Every inline script and style in the built pages is hashed into the policy, so nothing else can run.
import { createHash } from "node:crypto";
import { cpSync, globSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const out = "build/client";
cpSync(`${out}/404/index.html`, `${out}/404.html`);
for (const extra of ["404", "__spa-fallback.html"]) rmSync(`${out}/${extra}`, { recursive: true });

const sha = (s) => `'sha256-${createHash("sha256").update(s).digest("base64")}'`;
const scripts = new Set();
const styles = new Set();
for (const file of globSync(`${out}/**/*.html`)) {
  const html = readFileSync(file, "utf8");
  if (/\son\w+=|javascript:/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ""))) throw new Error(`Inline handler in ${file}`);
  for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) if (!/\ssrc=/.test(attrs) && body) scripts.add(sha(body));
  for (const [, body] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) styles.add(sha(body));
}

const policy = [
  "default-src 'none'",
  `script-src 'self' ${[...scripts].join(" ")}`,
  "script-src-attr 'none'",
  `style-src 'self' ${[...styles].join(" ")}`,
  "style-src-attr 'unsafe-inline'", // motion values and letter delays are style attributes; they cannot run code
  "img-src 'self'",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");
const line = `  Content-Security-Policy: ${policy}`;
if (line.length > 2000) throw new Error(`Policy is ${line.length} characters; Cloudflare allows 2000 per line`);

const base = readFileSync("headers.txt", "utf8");
const slot = "  # Content-Security-Policy";
if (base.split(slot).length !== 2) throw new Error("headers.txt must hold the Content-Security-Policy line once");

// One rule per file that exists, so a missing file is never cached. Only assets have hashed names.
const day = "public, max-age=86400, stale-while-revalidate=604800";
const cache = { assets: "public, max-age=31536000, immutable", fonts: day, img: day, media: day };
const rules = Object.entries(cache).flatMap(([dir, value]) =>
  globSync(`${dir}/*`, { cwd: out }).sort().map((file) => `/${file}\n  Cache-Control: ${value}\n`),
);
if (rules.length > 99) throw new Error(`${rules.length + 1} header rules; Cloudflare allows 100`);

writeFileSync(`${out}/_headers`, base.replace(slot, () => line) + rules.join(""));
console.log(`Policy: ${scripts.size} script and ${styles.size} style hashes, ${line.length} characters`);

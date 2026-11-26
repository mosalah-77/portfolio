// Reads the built HTML, so it checks what a visitor without JavaScript gets. Run `npm run build` first.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const pages = ["", "samepage", "oriel-and-reed", "fixcity", "ssh-honeypot", "how-i-work"];
const html = (p) => readFileSync(new URL(`../build/client/${p ? `${p}/` : ""}index.html`, import.meta.url), "utf8");
const text = (p) => html(p).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replaceAll("&#x27;", "'").replaceAll("&amp;", "&");

test("every page has its own title, one h1 and the contact links", () => {
  const titles = pages.map((p) => html(p).match(/<title>(.*?)<\/title>/)[1]);
  assert.equal(new Set(titles).size, pages.length);
  for (const p of pages) {
    assert.equal(html(p).match(/<h1/g).length, 1, p);
    assert.match(html(p), /mailto:m\.elmorshedy635@gmail\.com/);
  }
});

test("each animated heading is in the page text once, and its label says the same", () => {
  const names = { "": "Mohamed Elmorshedy", samepage: "Samepage", "oriel-and-reed": "Oriel & Reed", fixcity: "FixCity", "ssh-honeypot": "SSH Honeypot", "how-i-work": "How I work" };
  for (const p of pages) {
    const [, label, inner] = html(p).match(/<h1 aria-label="([^"]*)"[^>]*>([\s\S]*?)<\/h1>/);
    const seen = inner.replace(/<[^>]+>/g, "").replaceAll("&amp;", "&").trim();
    assert.equal(label.replaceAll("&amp;", "&"), names[p], p);
    assert.equal(seen, names[p], p);
  }
});

test("project demo and code links go through the short-link domain", () => {
  for (const [p, key] of [["samepage", "samepage"], ["oriel-and-reed", "oriel"], ["fixcity", "fixcity"]]) {
    for (const page of ["", p]) {
      assert.ok(html(page).includes(`href="https://go.mosalah-77.workers.dev/${key}"`), `${page} demo`);
      assert.ok(html(page).includes(`href="https://go.mosalah-77.workers.dev/${key}-code"`), `${page} code`);
    }
  }
});

test("the honeypot has no demo to open, and says it never left my machine", () => {
  const page = html("ssh-honeypot");
  assert.ok(page.includes('href="https://go.mosalah-77.workers.dev/honeypot-code"'));
  assert.doesNotMatch(text("ssh-honeypot").split("Next project")[0], /Live demo/);
  assert.match(text("ssh-honeypot"), /only run on my own machine/);
});

test("made-up companies are labelled", () => {
  for (const p of ["", "samepage"]) assert.match(text(p), /companies are made up/i);
  assert.match(text("oriel-and-reed"), /made-up interior design studio/i);
  assert.match(text("fixcity"), /made-up data/i);
});

test("nothing readable is hidden before JavaScript runs", () => {
  const allowed = /class="scene-note is-fixed"/; // the later step of the redrawn review
  for (const p of pages) for (const tag of html(p).match(/<[^>]+style="[^"]*opacity:0[;"][^>]*>/g) ?? []) assert.match(tag, allowed, `${p}: ${tag}`);
});

test("the security policy allows only this site's own code", () => {
  const headers = readFileSync(new URL("../build/client/_headers", import.meta.url), "utf8");
  const csp = headers.match(/Content-Security-Policy: (.*)/)[1];
  assert.match(csp, /default-src 'none'/);
  for (const h of ["Strict-Transport-Security", "X-Content-Type-Options: nosniff", "X-Frame-Options: DENY"]) assert.ok(headers.includes(h), h);
  assert.match(csp, /frame-ancestors 'none'/);
  assert.doesNotMatch(csp, /script-src[^;]*unsafe|https?:|\*/);
  for (const p of pages) assert.doesNotMatch(html(p), /<(script|link|img)[^>]+(src|href)="(https?:)?\/\//, p);
});

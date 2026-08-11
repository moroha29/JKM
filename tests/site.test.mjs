import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [html, css, script, workflow, og] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "script.js"), "utf8"),
  readFile(path.join(root, ".github/workflows/pages.yml"), "utf8"),
  readFile(path.join(root, "assets/og.png")),
]);

assert.match(html, /<meta name="viewport"/);
assert.match(html, /<meta property="og:image" content="https:\/\/moroha29\.github\.io\/JKM\/assets\/og\.png"/);
assert.match(html, /id="work"/);
assert.match(html, /id="studio"/);
assert.match(html, /id="people"/);
assert.match(html, /id="contact"/);
assert.equal((html.match(/class="person"/g) || []).length, 3, "exactly three founder placeholders are required");
assert.equal((html.match(/<article class="case /g) || []).length, 3, "the portfolio must keep three focused case studies");
assert.doesNotMatch(html, /(?:src|href)="\/(?!\/)/, "root-absolute assets break at the /JKM/ project path");
assert.doesNotMatch(html, /<img(?![^>]*\balt=)[^>]*>/, "every image needs alt text, including an explicit empty decorative alt");
assert.doesNotMatch(script, /_jump|qaTarget/);
assert.doesNotMatch(css, /Temporary lower-page visual QA/);
assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length, "CSS braces must balance");
assert.match(css, /prefers-reduced-motion/);
assert.match(workflow, /npm test/);
assert.match(workflow, /actions\/deploy-pages@v4/);

const localAssets = [...html.matchAll(/(?:src|href)="\.\/([^"#?]+)"/g)].map((match) => match[1]);
await Promise.all([...new Set(localAssets)].map((asset) => access(path.join(root, asset))));

assert.equal(og.toString("ascii", 1, 4), "PNG");
assert.equal(og.readUInt32BE(16), 1200, "social image must be 1200px wide");
assert.equal(og.readUInt32BE(20), 630, "social image must be 630px high");

console.log("JKM site contract tests passed.");

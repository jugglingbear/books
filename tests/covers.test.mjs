import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";

test("every catalog cover is a local image included in the deployment", () => {
  const vault = new URL("../vault/books/", import.meta.url);
  for (const filename of readdirSync(vault).filter((name) => name.endsWith(".md"))) {
    const note = readFileSync(new URL(filename, vault), "utf8");
    const match = note.match(/^cover: (".*")$/m);
    assert.ok(match, `Missing local cover field: ${filename}`);
    const cover = JSON.parse(match[1]);
    if (!cover) continue;
    assert.match(cover, /^\/covers\/[a-z0-9-]+\.(png|jpg|webp|gif)$/, filename);
    const asset = new URL(`../public${cover}`, import.meta.url);
    assert.ok(existsSync(asset), `Missing cover asset: ${filename}`);
    assert.ok(statSync(asset).size > 100, `Empty cover asset: ${filename}`);
  }
});

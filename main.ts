// The World Today — 19 November 2026
// make.fun bounty news-image-20261119
//
// The poster (entry.png, 1024x1024) is held in this repository next to
// this program. This program copies it, byte for byte, into the output
// directory as entry.png, then checks the copy is identical.

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "entry.png");

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const destPath = join(outDir, "entry.png");

// Read the poster held in the repository.
if (!existsSync(sourcePath)) {
  console.error(`entry.png not found next to main.ts: ${sourcePath}`);
  process.exit(1);
}
const image = readFileSync(sourcePath);
console.log(`Read ${image.length} bytes from ${sourcePath}`);

// Make sure the output directory exists, then write the copy.
mkdirSync(outDir, { recursive: true });
writeFileSync(destPath, image);

// Verify the copy: same byte length, same bytes.
const written = statSync(destPath).size;
if (written !== image.length) {
  console.error(
    `entry.png mismatch: wrote ${written} bytes, expected ${image.length}`,
  );
  process.exit(1);
}

const roundTrip = readFileSync(destPath);
if (!roundTrip.equals(image)) {
  console.error("entry.png mismatch: written bytes differ from entry.png");
  process.exit(1);
}

console.log(`Wrote ${written} bytes to ${destPath}`);

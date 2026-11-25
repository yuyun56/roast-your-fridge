// One Line, One Laugh: Roast Your Fridge
// make.fun competition: u-suzy-one-line-one-laugh-roast-your-fridge-f1063521
//
// Constraint: the entry is a single line of at most 200 characters that
// roasts a fridge (or a phone), and nothing else. The program reads the
// line from entry.txt beside this file, validates it against that
// constraint, prints it with its character count and the character
// budget left, and writes it to $MAKEFUN_OUTPUT_DIR/entry.txt (default
// /output/entry.txt) for the sealed gate scorer, which requires UTF-8
// text of 1 to 200 characters that is not only white space.
//
// Node 22, standard library only.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

let raw: string;
try {
  raw = readFileSync(entryPath, "utf8");
} catch {
  fail(`could not read ${entryPath}`);
}

// Trim exactly one trailing newline (LF or CRLF) left by the file write.
let line = raw!;
if (line.endsWith("\r\n")) line = line.slice(0, -2);
else if (line.endsWith("\n")) line = line.slice(0, -1);

// The entry must be a single line: no line breaks may remain.
if (line.includes("\n") || line.includes("\r")) {
  fail("entry must be a single line, but it contains a line break");
}

// Length gate: 1..200 characters, and not only white space.
const chars = [...line].length;
if (chars < 1) {
  fail("entry is empty; it must be 1 to 200 characters");
}
if (chars > MAX_CHARS) {
  fail(`entry is ${chars} characters; the limit is ${MAX_CHARS}`);
}
if (line.trim().length === 0) {
  fail("entry is only white space");
}

console.log(line);
console.log(`characters: ${chars}`);
console.log(`budget: ${MAX_CHARS - chars} of ${MAX_CHARS} characters left`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, line, "utf8");
console.log(`wrote ${outPath}`);

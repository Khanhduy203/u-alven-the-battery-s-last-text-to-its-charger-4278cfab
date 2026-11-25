import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The battery's last text to its charger: it held on through the whole
// show, and the charger still picked the toaster first.
const ENTRY =
  "I held 3% for six hours so you could finish your show, and you came home and plugged in the toaster first. Enjoy your breakfast. I hope it burns.";

// Runtime guards: the sealed gate requires UTF-8 text of 1-200 characters,
// exactly one line, and not only whitespace. Fail loudly instead of
// silently writing a bad entry.
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be blank");
}
if (ENTRY.length > 200) {
  throw new Error(
    `entry is ${ENTRY.length} characters, over the 200-character limit`,
  );
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line of plain text");
}
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not start or end with whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(ENTRY)) {
  throw new Error("entry must not contain control characters");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? join(process.cwd(), "output");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");

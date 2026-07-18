#!/usr/bin/env node
/**
 * Demo hook: append one line to edit-audit.log for each agent file write.
 * stdin: JSON payload from Cursor (shape may vary by version).
 */
import fs from 'node:fs';
import path from 'node:path';

const chunks = [];
for await (const c of process.stdin) chunks.push(c);
const raw = Buffer.concat(chunks).toString('utf8');
let file = 'unknown';
try {
  const j = JSON.parse(raw || '{}');
  file = j.file_path || j.path || j.filePath || file;
} catch {
  /* ignore */
}
const root = process.cwd();
const logDir = path.join(root, '.cursor', 'hooks');
fs.mkdirSync(logDir, { recursive: true });
const line = `${new Date().toISOString()}\t${file}\n`;
fs.appendFileSync(path.join(logDir, 'edit-audit.log'), line, 'utf8');
process.stdout.write(JSON.stringify({}));

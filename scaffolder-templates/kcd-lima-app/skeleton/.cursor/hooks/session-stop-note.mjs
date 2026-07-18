#!/usr/bin/env node
/**
 * Demo hook on stop: no-op JSON out; could extend to flush metrics or notify CI.
 */
import fs from 'node:fs';
import path from 'node:path';

const chunks = [];
for await (const c of process.stdin) chunks.push(c);
const root = process.cwd();
const logDir = path.join(root, '.cursor', 'hooks');
fs.mkdirSync(logDir, { recursive: true });
fs.appendFileSync(
  path.join(logDir, 'session-stop.log'),
  `${new Date().toISOString()}\tsessionStop\n`,
  'utf8',
);
process.stdout.write(JSON.stringify({}));

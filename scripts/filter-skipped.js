#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dir = process.argv[2] || 'merged-results';
if (!fs.existsSync(dir)) { console.error(`Directory not found: ${dir}`); process.exit(1); }
const files = fs.readdirSync(dir).filter(f => f.endsWith('-result.json'));
let removed = 0;
for (const f of files) {
  const p = path.join(dir, f);
  try {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    const status = (data.status || '').toLowerCase();
    if (status === 'skipped') { fs.unlinkSync(p); console.log(`Removed: ${f}`); removed++; }
  } catch (e) { console.warn(`Unreadable: ${f} (${e.message})`); }
}
console.log(`Skipped removed: ${removed}/${files.length}`);

#!/usr/bin/env node
/**
 * Lightweight command router for Telegram conventions.
 * Prints a JSON intent that an agent can act on.
 */

function norm(s) {
  return String(s || '').trim();
}

const input = norm(process.argv.slice(2).join(' '));

const out = {
  input,
  intent: null,
  args: {},
};

const lc = input.toLowerCase();

if (lc === 'help') {
  out.intent = 'help';
} else if (lc === 'status') {
  out.intent = 'status';
} else if (lc.startsWith('audit vps')) {
  out.intent = 'audit_vps';
} else if (lc.startsWith('audit repo')) {
  out.intent = 'audit_repo';
  out.args.repo = norm(input.slice('audit repo'.length)) || null;
} else if (lc.startsWith('ship report')) {
  out.intent = 'ship_report';
  out.args.repo = norm(input.slice('ship report'.length)) || null;
} else if (lc.startsWith('screenshots')) {
  out.intent = 'screenshots';
  out.args.scope = norm(input.slice('screenshots'.length)) || null;
} else if (lc.startsWith('diagram master')) {
  out.intent = 'diagram_master';
  out.args.topic = norm(input.slice('diagram master'.length)) || null;
} else if (lc.startsWith('diagram sub')) {
  out.intent = 'diagram_sub';
  out.args.topic = norm(input.slice('diagram sub'.length)) || null;
} else if (lc === 'await feedback') {
  out.intent = 'await_feedback';
}

console.log(JSON.stringify(out, null, 2));
process.exit(out.intent ? 0 : 2);

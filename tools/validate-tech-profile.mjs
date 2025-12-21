#!/usr/bin/env node
/**
 * Tech Profile Validator (no external dependencies)
 *
 * Usage:
 *   node tools/validate-tech-profile.mjs --help
 *   node tools/validate-tech-profile.mjs --file interview-prep/tech-profile__entries.json
 *   node tools/validate-tech-profile.mjs --file interview-prep/tech-profile__entries.json --strict
 *
 * Exit codes:
 *   0 - PASS
 *   1 - FAIL (errors; or warnings in --strict)
 */

import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();

const DEFAULT_FILE = 'interview-prep/tech-profile__entries.json';
const PROFICIENCY = new Set(['core', 'strong', 'working', 'aware']);
const EVIDENCE_TYPES = new Set(['test', 'script', 'example', 'checklist']);

function printHelp() {
  console.log(`
Tech Profile Validator (no external deps)

Options:
  --file <path>    JSON file to validate (default: ${DEFAULT_FILE})
  --strict         Treat warnings as errors
  --help           Show help

Examples:
  node tools/validate-tech-profile.mjs --file ${DEFAULT_FILE}
  node tools/validate-tech-profile.mjs --file ${DEFAULT_FILE} --strict
`.trim());
}

function parseArgs(argv) {
  const args = { file: DEFAULT_FILE, strict: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--strict') args.strict = true;
    else if (a === '--file') {
      const next = argv[i + 1];
      if (!next) throw new Error('Missing value for --file');
      args.file = next;
      i += 1;
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isStringArray(v, min = 1) {
  return Array.isArray(v) && v.length >= min && v.every(isNonEmptyString);
}

function isISODate(v) {
  return isNonEmptyString(v) && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(v.trim());
}

function readJson(filePath) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(REPO_ROOT, filePath);
  const raw = fs.readFileSync(abs, 'utf-8');
  return JSON.parse(raw);
}

function unwrapEntries(doc) {
  if (Array.isArray(doc)) return { meta: null, entries: doc };
  if (doc && typeof doc === 'object' && Array.isArray(doc.entries)) return { meta: doc._meta ?? null, entries: doc.entries };
  throw new Error('Invalid file format: expected array or { entries: [...] }');
}

function normalizeMdRef(ref) {
  if (!isNonEmptyString(ref)) return null;
  const v = ref.trim();
  if (v.startsWith('md:')) return v.slice('md:'.length);
  if (v.startsWith('file:')) return v.slice('file:'.length);
  if (v.startsWith('interview-prep/') && v.endsWith('.md')) return v;
  if (v.startsWith('examples/') && v.endsWith('.md')) return v;
  return null;
}

function validateEntry(entry, idx, ctx) {
  const errors = [];
  const warnings = [];

  const at = (msg) => `Entry[${idx}](${entry?.id ?? 'NO_ID'}): ${msg}`;

  if (!entry || typeof entry !== 'object') {
    errors.push(at('Entry must be an object'));
    return { errors, warnings };
  }

  const requiredString = ['id', 'name', 'category', 'updatedAt'];
  for (const k of requiredString) {
    if (!isNonEmptyString(entry[k])) errors.push(at(`Missing/invalid "${k}"`));
  }

  if (!PROFICIENCY.has(entry.proficiency)) {
    errors.push(at(`Invalid "proficiency" (expected one of ${Array.from(PROFICIENCY).join(', ')})`));
  }

  const requiredStringArrays = ['principles', 'patterns', 'bestPractices', 'alternatives', 'tradeOffs', 'boundaries', 'refs'];
  for (const k of requiredStringArrays) {
    if (!isStringArray(entry[k], 1)) errors.push(at(`Missing/invalid "${k}" (non-empty string array required)`));
  }

  if (!isISODate(entry.updatedAt)) errors.push(at('Invalid "updatedAt" (YYYY-MM-DD required)'));

  // verification
  const v = entry.verification;
  if (!v || typeof v !== 'object') {
    errors.push(at('Missing "verification" object'));
  } else {
    if (!EVIDENCE_TYPES.has(v.type)) errors.push(at(`Invalid verification.type (expected ${Array.from(EVIDENCE_TYPES).join(', ')})`));
    if (!isNonEmptyString(v.howToRun)) errors.push(at('verification.howToRun required'));
    if (!isNonEmptyString(v.successSignal)) errors.push(at('verification.successSignal required'));
    if (!isNonEmptyString(v.failureSignal)) errors.push(at('verification.failureSignal required'));
  }

  // cpsol
  const c = entry.cpsol;
  if (!c || typeof c !== 'object') {
    errors.push(at('Missing "cpsol" object'));
  } else {
    for (const k of ['context', 'problem', 'solution', 'outcome', 'learnings']) {
      if (!isNonEmptyString(c[k])) errors.push(at(`cpsol.${k} required`));
    }
  }

  // Resume anchor validation: refs must include at least one resume:*
  const refs = Array.isArray(entry.refs) ? entry.refs : [];
  const hasResume = refs.some((r) => isNonEmptyString(r) && r.trim().startsWith('resume:'));
  if (!hasResume) errors.push(at('Missing resume anchor in refs (must include at least one "resume:*")'));

  // Link validation: refs containing md:... must exist
  for (const r of refs) {
    const mdPath = normalizeMdRef(r);
    if (!mdPath) continue;
    const abs = path.join(ctx.repoRoot, mdPath);
    if (!fs.existsSync(abs)) errors.push(at(`Missing referenced markdown file: ${mdPath}`));
  }

  // perfNotes (optional)
  if (entry.perfNotes !== undefined) {
    if (!Array.isArray(entry.perfNotes)) errors.push(at('perfNotes must be an array if present'));
    else {
      entry.perfNotes.forEach((p, pIdx) => {
        const pAt = (msg) => at(`perfNotes[${pIdx}]: ${msg}`);
        if (!p || typeof p !== 'object') {
          errors.push(pAt('must be an object'));
          return;
        }
        for (const k of ['metric', 'baseline', 'budget', 'method', 'risks', 'rollback']) {
          if (!isNonEmptyString(p[k])) errors.push(pAt(`${k} required`));
        }
      });
    }
  }

  // uxNotes (optional)
  if (entry.uxNotes !== undefined) {
    if (!isStringArray(entry.uxNotes, 1)) errors.push(at('uxNotes must be a non-empty string array if present'));
  }

  // Soft warnings
  if (hasResume && !refs.some((r) => normalizeMdRef(r))) {
    warnings.push(at('No md:* refs found; consider linking to interview-prep/*.md or examples/* for stronger evidence'));
  }

  return { errors, warnings };
}

function summarize(entries) {
  const byProf = new Map();
  const byCat = new Map();
  for (const e of entries) {
    const p = e?.proficiency ?? 'unknown';
    const c = e?.category ?? 'unknown';
    byProf.set(p, (byProf.get(p) ?? 0) + 1);
    byCat.set(c, (byCat.get(c) ?? 0) + 1);
  }
  return { byProf, byCat };
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    console.error('Run with --help for usage.');
    process.exit(1);
  }

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const ctx = { repoRoot: REPO_ROOT };
  let doc;
  try {
    doc = readJson(args.file);
  } catch (e) {
    console.error(`ERROR: Failed to read/parse JSON: ${e.message}`);
    process.exit(1);
  }

  let entries;
  try {
    ({ entries } = unwrapEntries(doc));
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
  }

  const allErrors = [];
  const allWarnings = [];

  entries.forEach((entry, idx) => {
    const { errors, warnings } = validateEntry(entry, idx, ctx);
    allErrors.push(...errors);
    allWarnings.push(...warnings);
  });

  const { byProf, byCat } = summarize(entries);

  console.log('--- Tech Profile Validation Summary ---');
  console.log(`File: ${args.file}`);
  console.log(`Entries: ${entries.length}`);
  console.log('By proficiency:', Object.fromEntries(byProf.entries()));
  console.log('By category:', Object.fromEntries(byCat.entries()));
  console.log(`Warnings: ${allWarnings.length}`);
  console.log(`Errors: ${allErrors.length}`);

  if (allWarnings.length) {
    console.log('\nWARNINGS:');
    allWarnings.forEach((w) => console.log(`- ${w}`));
  }

  if (allErrors.length) {
    console.log('\nERRORS:');
    allErrors.forEach((er) => console.log(`- ${er}`));
  }

  const strictFail = args.strict && allWarnings.length > 0;
  const pass = allErrors.length === 0 && !strictFail;
  console.log(`\nRESULT: ${pass ? 'PASS' : 'FAIL'}`);

  process.exit(pass ? 0 : 1);
}

main();



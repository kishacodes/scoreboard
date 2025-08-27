#!/usr/bin/env node
import { readFile, appendFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { exec as cpExec } from 'node:child_process';

const exec = promisify(cpExec);

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function nowLocal() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

async function getGitShaShort() {
  try {
    const { stdout } = await exec('git rev-parse --short HEAD');
    return stdout.trim();
  } catch {
    return 'no-git';
  }
}

async function main() {
  const args = process.argv.slice(2);
  const useStdin = args.includes('--stdin');
  const fileArg = args.find((a) => !a.startsWith('-'));

  let summaryText = '';
  if (useStdin) {
    summaryText = (await readStdin()).trim();
  } else if (fileArg) {
    const p = resolve(process.cwd(), fileArg);
    try {
      summaryText = (await readFile(p, 'utf8')).trim();
    } catch (e) {
      console.error(`Failed to read summary file: ${p}`);
      process.exit(1);
    }
  } else {
    console.error('Usage: node scripts/log-summary.mjs <summary-file> | --stdin');
    process.exit(1);
  }

  if (!summaryText) {
    console.error('No summary content provided. Aborting.');
    process.exit(1);
  }

  const sha = await getGitShaShort();
  const timestamp = nowLocal();

  const header = `\n## ${timestamp} - ${sha}\n\n`;
  const entry = `${header}${summaryText}\n\n`;

  const outPath = resolve(process.cwd(), 'docs/cascade-summaries.md');
  try {
    await access(outPath, constants.F_OK);
  } catch {
    // If file doesn't exist, create a header first
    await appendFile(outPath, '# Cascade Summaries\n\n');
  }

  await appendFile(outPath, entry, 'utf8');
  console.log(`Logged Cascade summary to docs/cascade-summaries.md (${sha})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

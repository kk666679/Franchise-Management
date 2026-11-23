import fs from "node:fs"
import path from "node:path"

type Row = Record<string, string>

const ROOT = process.cwd()
const INVENTORY_PATH = path.join(ROOT, "docs", "component-inventory.md")
const COMPONENTS_DIR = path.join(ROOT, "components")
const ALLOWED_STATUS = new Set(["planned", "scaffold", "implemented", "tested", "stable", "deprecated", "moved"])
const REQUIRED_COLS = ["name","path","category","owner","server_client","status","dependencies","consumers","tests","a11y","notes"]

function fail(msgs: string[]): never {
  console.error("inventory:audit failed")
  for (const m of msgs) console.error(`- ${m}`)
  process.exit(1)
}

function parseTable(md: string): Row[] {
  const lines = md.split(/\r?\n/).filter((l) => l.trim().startsWith("|"))
  if (lines.length < 3) return []
  const headers = lines[0].split("|").slice(1, -1).map((s) => s.trim())
  const rows: Row[] = []
  for (const line of lines.slice(2)) {
    const cells = line.split("|").slice(1, -1).map((s) => s.trim())
    if (cells.length === 1 && cells[0] === "") continue
    const row: Row = {}
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""))
    rows.push(row)
  }
  return { headers, rows } as any
}

function parseInventory(md: string): { headers: string[]; rows: Row[] } {
  const lines = md.split(/\r?\n/).filter((l) => l.trim().startsWith("|"))
  if (lines.length < 3) return { headers: [], rows: [] }
  const headers = lines[0].split("|").slice(1, -1).map((s) => s.trim())
  const rows: Row[] = []
  for (const line of lines.slice(2)) {
    if (/^\|\s*-+/.test(line)) continue
    const cells = line.split("|").slice(1, -1).map((s) => s.trim())
    if (cells.every((c) => c === "")) continue
    const row: Row = {}
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""))
    rows.push(row)
  }
  return { headers, rows }
}

function existsRel(p: string) {
  const clean = p.replace(/`/g, "").trim()
  return fs.existsSync(path.join(ROOT, clean))
}

function hasTestEvidence(row: Row): boolean {
  const tests = (row.tests || "").toLowerCase()
  if (!tests || ["no", "n/a", "none", "partial"].includes(tests)) return false
  if (tests.includes("yes")) return true
  if (tests.includes("tests/") || tests.includes(".test.")) return true
  return false
}

function walkFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walkFiles(full))
    else out.push(full)
  }
  return out
}

function main() {
  const errors: string[] = []
  if (!fs.existsSync(INVENTORY_PATH)) fail([`Missing ${path.relative(ROOT, INVENTORY_PATH)}`])
  const md = fs.readFileSync(INVENTORY_PATH, "utf8")
  const { headers, rows } = parseInventory(md)
  for (const col of REQUIRED_COLS) if (!headers.includes(col)) errors.push(`Inventory missing column: ${col}`)
  if (!fs.existsSync(COMPONENTS_DIR)) errors.push("Missing components/ directory")

  const rootBarrel = ["index.ts","index.tsx","index.js","index.jsx"].find((f) => fs.existsSync(path.join(COMPONENTS_DIR, f)))
  if (rootBarrel) errors.push(`Forbidden top-level barrel: components/${rootBarrel}`)

  const seenPaths = new Set<string>()
  for (const [i, row] of rows.entries()) {
    const where = `row ${i + 3} (${row.name || "unnamed"})`;
    for (const col of REQUIRED_COLS) if (!String(row[col] ?? "").trim()) errors.push(`${where}: missing ${col}`);
    const status = (row.status || "").toLowerCase();
    if (status && !ALLOWED_STATUS.has(status)) errors.push(`${where}: invalid status '${row.status}'`);
    const p = (row.path || "").replace(/`/g, "").trim();
    if (p) {
      if (seenPaths.has(p)) errors.push(`${where}: duplicate path ${p}`);
      seenPaths.add(p);
      const isGlob = /[*?]/.test(p);
      if (isGlob) {
        const base = p.replace(/[*?].*$/, "").replace(/[\\/]+$/, "");
        if (!existsRel(base)) errors.push(`${where}: path does not exist: ${p}`);
      } else if (!existsRel(p)) {
        errors.push(`${where}: path does not exist: ${p}`);
      }
    }
    if (status === "stable") {
      if (!hasTestEvidence(row)) errors.push(`${where}: stable component must have test evidence`);
      if ((row.consumers || "").toLowerCase().match(/^(no|none|n\/a)$/)) errors.push(`${where}: stable component must have real consumer`);
    }
  }

  const componentFiles = walkFiles(COMPONENTS_DIR).filter((f) => /\.(tsx?|jsx?)$/.test(f));
  const inventoryPaths = rows.map((r) => (r.path || "").replace(/`/g, "").trim()).filter(Boolean);
  const topLevel = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => `components/${d.name}`);
  for (const dir of topLevel) {
    const covered = inventoryPaths.some((p) => {
      const norm = p.replace(/\\/g, "/");
      const base = norm.replace(/[*?].*$/, "").replace(/\/+$/, "");
      return base === dir || base.startsWith(dir + "/") || norm.startsWith(dir + "/");
    });
    if (!covered) errors.push(`Missing inventory coverage for top-level directory: ${dir}`);
  }

  // Basic sanity: inventory should reference real test files when specified as path-like.
  for (const row of rows) {
    const tests = (row.tests || "").replace(/`/g, "")
    const matches = tests.match(/(tests\/[\w\-./\\]+\.(?:ts|tsx)|components\/[\w\-./\\]+\.test\.(?:ts|tsx))/g) || []
    for (const m of matches) if (!fs.existsSync(path.join(ROOT, m))) errors.push(`row (${row.name}): test path does not exist: ${m}`)
  }

  if (errors.length) fail(errors)
  console.log(`inventory:audit ok (${rows.length} rows, ${componentFiles.length} component files)`)
}

main()

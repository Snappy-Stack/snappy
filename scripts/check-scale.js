import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDir = path.join(__dirname, '../src')

// ------------------------------------------------------------------
// CONFIG
// ------------------------------------------------------------------

// Structural Tailwind prefixes whose px values must use rem.
const STRUCTURAL_PREFIXES = [
  'w',
  'h',
  'min-w',
  'min-h',
  'max-w',
  'max-h',
  'size',
  'basis',
  'inset',
  'top',
  'right',
  'bottom',
  'left',
  'translate-x',
  'translate-y',
  'p',
  'px',
  'py',
  'pt',
  'pb',
  'pl',
  'pr',
  'm',
  'mx',
  'my',
  'mt',
  'mb',
  'ml',
  'mr',
  'gap',
  'space-x',
  'space-y',
]

// Values at or below this are tiny accents (borders, dividers) — always ignored.
const TINY_PX_THRESHOLD = 4

// Global error threshold: px values at or above this are errors UNLESS the
// prefix has a higher per-prefix threshold defined below.
const GLOBAL_ERROR_THRESHOLD = 96

// Per-prefix error thresholds. Prefixes with a higher threshold than the
// global one allow larger px values as warnings instead of errors.
// e.g. max-w/max-h: common for text-truncation containers up to 300px.
const PREFIX_ERROR_THRESHOLD = {
  'max-w': 300,
  'max-h': 300,
}

// Text sizes: <=24px are decorative micro labels — allowed. >24px must use rem.
const TEXT_PX_THRESHOLD = 24

// Inline style properties that must use rem when >= GLOBAL_ERROR_THRESHOLD.
const INLINE_STYLE_PROPS = [
  'fontSize',
  'width',
  'height',
  'maxWidth',
  'minWidth',
  'maxHeight',
  'minHeight',
  'padding',
  'margin',
  'gap',
]

// Files to skip entirely.
const SKIP_FILES = new Set(['payload-types.ts', 'globals.css', 'icon.tsx'])

// Directories to skip entirely.
const SKIP_DIRS = new Set(['migrations', '.next', 'node_modules'])

// Lines containing these patterns are skipped (spec-required non-layout uses).
const SKIP_LINE_PATTERNS = [
  /sizes="[^"]+"/, // Next.js Image sizes prop
  /sizes=\{[^}]+\}/, // Next.js Image sizes (JSX expression)
]

// ------------------------------------------------------------------
// REGEXES
// ------------------------------------------------------------------

// Matches: prefix-[Npx] — e.g. min-h-[120px], max-w-[300px]
const STRUCTURAL_RE = /\b([\w-]+)-\[(\d+(?:\.\d+)?)px\]/g

// Matches: property: 'Npx' or property: Npx in inline style objects
const INLINE_STYLE_RE = new RegExp(
  `\\b(${INLINE_STYLE_PROPS.join('|')})\\s*[:=]\\s*['""]?(\\d+(?:\\.\\d+)?)px['""]?`,
  'g',
)

// ------------------------------------------------------------------
// STATE
// ------------------------------------------------------------------

let hasErrors = false

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------

function shouldSkipLine(line) {
  return SKIP_LINE_PATTERNS.some((p) => p.test(line))
}

function isStructuralPrefix(prefix) {
  return STRUCTURAL_PREFIXES.includes(prefix)
}

function pxToRem(px) {
  return (px / 16).toFixed(4).replace(/\.?0+$/, '')
}

// ------------------------------------------------------------------
// CHECKER
// ------------------------------------------------------------------

function checkLine(line, lineNum, filePath) {
  if (line.includes('lint-ignore-scale')) return
  if (shouldSkipLine(line)) return

  // -- Structural Tailwind classes --
  const re1 = new RegExp(STRUCTURAL_RE.source, 'g')
  let match
  while ((match = re1.exec(line)) !== null) {
    const prefix = match[1]
    const value = parseFloat(match[2])

    // Text sizes handled separately
    if (prefix === 'text') {
      if (value > TEXT_PX_THRESHOLD) {
        hasErrors = true
        console.error(`\nError in ${filePath}:${lineNum}`)
        console.error(`   Found : ${match[0]}`)
        console.error(
          `   Rule  : text sizes >24px should use rem. Use text-[${pxToRem(value)}rem].`,
        )
        console.error(`   Line  : ${line.trim().substring(0, 120)}`)
      }
      continue
    }

    if (!isStructuralPrefix(prefix)) continue
    if (value <= TINY_PX_THRESHOLD) continue

    const errorThreshold = Math.max(
      PREFIX_ERROR_THRESHOLD[prefix] ?? GLOBAL_ERROR_THRESHOLD,
      GLOBAL_ERROR_THRESHOLD,
    )

    if (value > errorThreshold) {
      hasErrors = true
      console.error(`\nError in ${filePath}:${lineNum}`)
      console.error(`   Found : ${match[0]}`)
      console.error(
        `   Rule  : structural px >${errorThreshold}px should use rem. Use ${prefix}-[${pxToRem(value)}rem].`,
      )
      console.error(`   Line  : ${line.trim().substring(0, 120)}`)
    }
  }

  // -- Inline style px values --
  const re2 = new RegExp(INLINE_STYLE_RE.source, 'g')
  while ((match = re2.exec(line)) !== null) {
    const value = parseFloat(match[2])
    if (value >= GLOBAL_ERROR_THRESHOLD) {
      hasErrors = true
      console.error(`\nError in ${filePath}:${lineNum}`)
      console.error(`   Found : ${match[0]}`)
      console.error(
        `   Rule  : inline style px >=${GLOBAL_ERROR_THRESHOLD}px should use rem. Use ${pxToRem(value)}rem.`,
      )
      console.error(`   Line  : ${line.trim().substring(0, 120)}`)
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  lines.forEach((line, i) => checkLine(line, i + 1, filePath))
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir)
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walkDir(fullPath)
    } else if (
      (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) &&
      !SKIP_FILES.has(path.basename(fullPath))
    ) {
      checkFile(fullPath)
    }
  }
}

// ------------------------------------------------------------------
// RUN
// ------------------------------------------------------------------

console.log('Checking codebase for hardcoded pixel values that break fluid scaling...')
walkDir(srcDir)

if (hasErrors) {
  console.error('\nScale lint failed. Replace structural px values with rem equivalents.')
  console.error('Tip: Add // lint-ignore-scale to a line to whitelist an intentional exception.')
  process.exit(1)
} else {
  console.log('\nAll sizing values are scale-compliant.')
  process.exit(0)
}

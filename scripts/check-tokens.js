import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDir = path.join(__dirname, '../src')

// Regular expressions to catch non-compliant styling
const INVALID_PATTERNS = [
  {
    regex:
      /\b(text|bg|border|ring|fill|stroke)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d{2,3}\b/g,
    message: 'Standard Tailwind color used instead of a semantic token.',
  },
  {
    regex: /#([A-Fa-f0-9]{3}){1,2}\b/g,
    message: 'Hex color code used directly.',
  },
  {
    regex: /rgba?\([^\)]+\)/g,
    message: 'rgb() or rgba() color used directly.',
  },
  {
    regex: /\b(text|bg|border|ring)-snappy-accent\b/g,
    message: 'Deprecated snappy-accent token used. Use primary/secondary/tertiary colors.',
  },
]

let totalErrors = 0
const IGNORE_KEYWORD = 'lint-ignore-tokens'

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    if (
      [
        'migrations',
        'payload-types.ts',
        'globals',
        'icon.tsx',
        'layout.tsx',
        'globals.css',
      ].includes(file)
    )
      continue

    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walkDir(fullPath)
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      checkFile(fullPath)
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\r\n').join('\n').split('\n')
  const baseName = path.relative(srcDir, filePath)

  lines.forEach((line, index) => {
    // Check if this line OR the previous line contains the ignore keyword
    const isIgnored =
      line.includes(IGNORE_KEYWORD) || (index > 0 && lines[index - 1].includes(IGNORE_KEYWORD))

    if (isIgnored) return

    for (const pattern of INVALID_PATTERNS) {
      const matches = line.match(pattern.regex)
      if (matches) {
        totalErrors++
        console.error(`ERROR: ${baseName}:${index + 1}`)
        console.error(`  - Found: ${matches.join(', ')}`)
        console.error(`  - Rule: ${pattern.message}`)
        console.error(`  - Line: ${line.trim()}`)
        console.error('')
      }
    }
  })
}

console.log('Checking codebase for hardcoded colors and invalid tokens...\n')
walkDir(srcDir)

if (totalErrors > 0) {
  console.error(`FAILURE: ${totalErrors} token violation(s) detected.`)
  console.error('Please replace hardcoded colors with semantic tokens from the design system.')
  console.error(`To ignore a specific line, add: // ${IGNORE_KEYWORD}`)
  process.exit(1)
} else {
  console.log('All styling tokens are compliant.')
  process.exit(0)
}

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const srcDir = path.join(__dirname, '../src')

// Our semantic tokens handle dark mode automatically, so we can strip the hardcoded variations
const replacements = [
  // Remove dark: prefix for our semantic tokens
  { from: /dark:text-zinc-\d{2,3}/g, to: '' },
  { from: /dark:bg-zinc-\d{2,3}(?:\/\d+)?/g, to: '' },
  { from: /dark:border-zinc-\d{2,3}/g, to: '' },
  { from: /dark:hover:bg-zinc-\d{2,3}(?:\/\d+)?/g, to: '' },
  { from: /dark:hover:text-zinc-\d{2,3}/g, to: '' },

  // Replace base zinc colors
  { from: /bg-zinc-(950|900|850|800)/g, to: 'bg-background' },
  { from: /bg-zinc-(50|100|200)/g, to: 'bg-snappy-card' },
  { from: /border-zinc-\d{2,3}/g, to: 'border-snappy-border' },
  { from: /text-zinc-(950|900|800|100|50)/g, to: 'text-foreground' },
  { from: /text-zinc-(600|500|400|300)/g, to: 'text-foreground/60' },

  // Replace standard colors with semantic accents
  { from: /text-red-\d{2,3}/g, to: 'text-tertiary' },
  { from: /bg-red-\d{2,3}(?:\/\d+)?/g, to: 'bg-tertiary/10' },
  { from: /text-blue-\d{2,3}/g, to: 'text-primary' },
  { from: /bg-blue-\d{2,3}(?:\/\d+)?/g, to: 'bg-primary' },
  { from: /text-green-\d{2,3}/g, to: 'text-secondary' },
  { from: /bg-green-\d{2,3}(?:\/\d+)?/g, to: 'bg-secondary' },

  // Deprecated snappy tokens
  { from: /bg-snappy-accent/g, to: 'bg-primary' },
  { from: /text-snappy-accent/g, to: 'text-primary' },

  // rgba or hex
  { from: /shadow-\[0_0_8px_rgba\(34,197,94,0\.5\)\]/g, to: 'shadow-lg shadow-secondary/50' },

  // Clean up extra spaces
  { from: /  +/g, to: ' ' },
  { from: / "/g, to: '"' },
  { from: /" /g, to: '"' },
]

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let changed = false
  let newContent = content

  replacements.forEach((r) => {
    if (newContent.match(r.from)) {
      newContent = newContent.replace(r.from, (match) => {
        return r.to
      })
      changed = true
    }
  })

  // Cleanup potential className=" " or duplicated spaces
  newContent = newContent.replace(/className=" /g, 'className="')
  newContent = newContent.replace(/className="([^"]+) "/g, 'className="$1"')

  if (changed && newContent !== content) {
    fs.writeFileSync(filePath, newContent)
    console.log(`Fixed: ${filePath}`)
  }
}

function walkDir(dir) {
  if (dir.includes('migrations') || dir.includes('payload-types') || dir.includes('globals')) return

  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walkDir(fullPath)
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fixFile(fullPath)
    }
  }
}

walkDir(srcDir)
console.log('Auto-fix completed.')

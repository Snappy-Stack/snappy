#!/usr/bin/env node

/**
 * create-snappy
 * The official CLI to bootstrap the SNAPPY stack.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import readline from 'readline'
import os from 'os'
import { Command } from 'commander'
import prompts from 'prompts'
import pc from 'picocolors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG_DIR = path.join(os.homedir(), '.snappy')
const CONFIG_FILE = path.join(CONFIG_DIR, 'auth.json')

// This is a placeholder Client ID.
// Note: This must be an 'OAuth App' with 'Device Flow' enabled in GitHub settings.
const CLIENT_ID = 'Ov23liWHoGiMponaUxrc'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

// --- Auth Utilities ---

function getSavedToken() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
      return data.access_token
    } catch (e) {
      return null
    }
  }
  return null
}

function saveToken(token) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ access_token: token }, null, 2))
}

async function githubLogin() {
  console.log('\n🔐 Authenticating with GitHub...')

  try {
    const response = await fetch('https://github.com/login/device/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: CLIENT_ID, scope: 'repo read:user' }),
    })

    if (response.status === 404) {
      throw new Error(
        'GitHub returned 404. This usually means the Client ID is invalid or the app is not registered.',
      )
    }

    const data = await response.json()
    if (data.error) throw new Error(`Auth request failed: ${data.error_description || data.error}`)

    const { device_code, user_code, verification_uri, interval, expires_in } = data

    console.log(`\n1. Go to: \x1b[34m${verification_uri}\x1b[0m`)
    console.log(`2. Enter code: \x1b[1m\x1b[32m${user_code}\x1b[0m`)
    console.log(
      `\nWaiting for authorization... (Expires in ${Math.floor(expires_in / 60)} minutes)`,
    )

    const poll = async () => {
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          device_code,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        }),
      })

      const tokenData = await res.json()

      if (tokenData.error) {
        if (tokenData.error === 'authorization_pending') {
          await new Promise((r) => setTimeout(r, (interval || 5) * 1000))
          return poll()
        }
        throw new Error(`Polling failed: ${tokenData.error_description || tokenData.error}`)
      }

      return tokenData.access_token
    }

    const accessToken = await poll()
    saveToken(accessToken)
    console.log('✅ Successfully authenticated!')
    return accessToken
  } catch (err) {
    console.warn(`\x1b[33m\n⚠️  GitHub OAuth failed: ${err.message}\x1b[0m`)
    console.log('\x1b[36mFalling back to manual token entry...\x1b[0m')
    const manualToken = await question('Paste your GitHub Personal Access Token (PAT): ')

    if (!manualToken || manualToken.trim() === '') {
      throw new Error('No token provided. Installation aborted.')
    }

    saveToken(manualToken.trim())
    console.log('✅ Token saved manually.')
    return manualToken.trim()
  }
}

// --- Main CLI ---

async function main() {
  console.log(pc.cyan('\n🚀 Welcome to the SNAPPY Stack Installer!'))
  console.log('------------------------------------------')

  const program = new Command()
  program
    .name('create-snappy')
    .description('Bootstrap a new SNAPPY project.')
    .argument('[directory]', 'Project directory name')
    .option('-t, --template <name>', 'Template to use (main, portofolio)')
    .option('--local', 'Copy from local files instead of cloning (for dev)')
    .option('--login', 'Authenticate with GitHub to access private templates')
    .parse(process.argv)

  const options = program.opts()
  let providedName = program.args[0]

  if (options.login) {
    try {
      await githubLogin()
      rl.close()
      process.exit(0)
    } catch (e) {
      console.error(pc.red(e.message))
      rl.close()
      process.exit(1)
    }
    return
  }

  // INTERACTIVE PROMPTS
  const questions = []

  if (!providedName) {
    questions.push({
      type: 'text',
      name: 'projectName',
      message: 'What is your project named?',
      initial: 'my-snappy-app',
      validate: (value) => (value.length > 0 ? true : 'Please enter a project name.'),
    })
  }

  questions.push({
    type: 'text',
    name: 'projectDescription',
    message: 'Project description?',
    initial: 'A fresh SNAPPY app',
  })

  questions.push({
    type: 'text',
    name: 'authorName',
    message: 'Author name?',
    initial: 'Wicky',
  })

  if (!options.template) {
    questions.push({
      type: 'select',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        { title: 'Portfolio', description: 'A sleek portfolio template', value: 'portofolio' },
      ],
      initial: 0,
    })
  }

  const response = await prompts(questions, {
    onCancel: () => {
      console.log(pc.yellow('Installation cancelled.'))
      process.exit(0)
    },
  })

  const projectName = providedName || response.projectName
  const projectDescription = response.projectDescription
  const authorName = response.authorName
  const selectedTemplate = options.template || response.template || 'portofolio'

  const targetDir = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(targetDir)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: pc.yellow(`Directory ${projectName} already exists. Overwrite?`),
      initial: false,
    })

    if (!overwrite) {
      console.log('Aborted.')
      process.exit(0)
    }
    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  // Create target dir
  fs.mkdirSync(targetDir, { recursive: true })

  try {
    if (options.local) {
      console.log(pc.gray(`\n📂 [Local Mode] Copying template files...`))
      const templateDir = path.resolve(__dirname, '../../')
      const skipList = ['node_modules', '.git', projectName, '.next', 'dist', 'scripts']
      const entries = fs.readdirSync(templateDir, { withFileTypes: true })

      for (const entry of entries) {
        if (skipList.some((skip) => entry.name.startsWith(skip))) continue
        const srcPath = path.join(templateDir, entry.name)
        const destPath = path.join(targetDir, entry.name)
        fs.cpSync(srcPath, destPath, { recursive: true })
      }
      console.log(pc.green('✅ Template files copied.'))
    } else {
      let token = getSavedToken()

      if (!token) {
        console.log('\n🔒 No active session found.')
        token = await githubLogin()
      }

      console.log(
        pc.blue(`\n🌐 [Remote Mode] Initializing from repository (Branch: ${selectedTemplate})...`),
      )

      const repoUrl = process.env.SNAPPY_REPO_URL || 'https://github.com/WickyID/snappy-template'
      // Use standard authenticated URL format
      const authenticatedUrl = repoUrl.replace('https://', `https://x-access-token:${token}@`)

      console.log(`Cloning into ${pc.bold(projectName)}...`)
      try {
        // Clone specific branch based on the selected template
        execSync(`git clone --depth 1 -b ${selectedTemplate} ${authenticatedUrl} "${targetDir}"`, {
          stdio: 'inherit',
        })
      } catch (cloneErr) {
        console.error(
          pc.red("Clone failed. Your token might have expired, or the branch doesn't exist yet."),
        )
        console.log('Try running `create-snappy --login` to refresh your session.')
        throw cloneErr
      }

      // Cleanup .git to start fresh
      if (fs.existsSync(path.join(targetDir, '.git'))) {
        fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true })
      }
      console.log(pc.green('✅ Repository cloned and cleaned.'))
    }

    // 2. Customize package.json and README.md
    console.log('\n📝 Customizing project files...')
    const pkgPath = path.join(targetDir, 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      pkg.name = projectName.toLowerCase().replace(/\s+/g, '-')
      pkg.description = projectDescription || pkg.description
      pkg.author = authorName || pkg.author
      if (pkg.bin) delete pkg.bin
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
    }

    // Customize README (if present)
    const readmePath = path.join(targetDir, 'README.md')
    if (fs.existsSync(readmePath)) {
      const readmeContent = `# ${projectName}\n\n${projectDescription}\n\nGenerated with \`create-snappy\`.`
      fs.writeFileSync(readmePath, readmeContent)
    }
    console.log(pc.green('✅ Project details injected.'))

    // 3. Configure .env
    console.log('\n🛠️ Configuring environment variables...')
    const envContent = `NEXT_PUBLIC_SUPABASE_ANON_KEY="REDACTED_JWT"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="REDACTED_SB"
NEXT_PUBLIC_SUPABASE_URL="https://REDACTED.supabase.co"
POSTGRES_DATABASE="postgres"
POSTGRES_HOST="db.REDACTED.supabase.co"
POSTGRES_PASSWORD="REDACTED"
POSTGRES_PRISMA_URL="postgres://postgres.REDACTED:REDACTED@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
POSTGRES_URL="postgres://postgres.REDACTED:REDACTED@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_URL_NON_POOLING="postgres://postgres.REDACTED:REDACTED@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
POSTGRES_USER="postgres"
SUPABASE_ANON_KEY="REDACTED_JWT"
SUPABASE_JWT_SECRET="eUd+Xs31EEcvPZjAsl+6U6fd5sZbxsSvlNk77EreXwHrRLFW7hizGB+zeZhKEo7DzwgAshgXn2/fZ0UP1ZHVbw=="
SUPABASE_PUBLISHABLE_KEY="REDACTED_SB"
SUPABASE_SECRET_KEY="REDACTED_SB"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6InNlcnZpY2Vfcm9sZSIsImiYXQiOjE3NzI4MzU4NTksImV4cCI6MjA4ODQxMTg1OX0.iJAQUh6kaRN2U9VkQM3QejM2n2ZHpCPnntJ5MU2n6DQ"
SUPABASE_URL="https://REDACTED.supabase.co"
DATABASE_URL="postgres://postgres.REDACTED:REDACTED@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x&uselibpqcompat=true"
PAYLOAD_SECRET="${Math.random().toString(36).substring(2)}"
S3_BUCKET="lorem_ass-et"
S3_ACCESS_KEY_ID="7bf5d11de3ba4969c89653674201ab61"
S3_SECRET_ACCESS_KEY="046090bb1767edb48de57d8aae69f7155935acb64c231e6d6e52c090294ca62f"
S3_ENDPOINT="https://REDACTED.storage.supabase.co/storage/v1/s3"
S3_REGION="ap-southeast-1"
PUBLIC_FRONTEND_URL="http://localhost:3000"
REQUIRE_LOGIN="no"
`
    fs.writeFileSync(path.join(targetDir, '.env'), envContent)
    console.log(pc.green('✅ .env generated.'))

    if (process.env.SKIP_INSTALL !== 'true') {
      console.log(pc.magenta('\n📦 Installing dependencies (pnpm)...'))
      try {
        execSync('pnpm install', { cwd: targetDir, stdio: 'inherit' })
      } catch (e) {
        console.warn(pc.yellow('Warning: pnpm install failed.'))
      }
    }

    console.log(pc.green('\n✅ SNAPPY Stack is ready!'))
    console.log(`\nNext steps:\n  cd ${pc.bold(projectName)}\n  pnpm run dev\n`)
  } catch (err) {
    console.error(pc.red(`Installation failed: ${err.message || err}`))
  } finally {
    if (rl) rl.close()
  }
}

main().catch((err) => {
  console.error(pc.red(err))
  if (rl) rl.close()
  process.exit(1)
})


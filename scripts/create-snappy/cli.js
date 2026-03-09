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
import crypto from 'crypto'
import { Command } from 'commander'
import prompts from 'prompts'
import pc from 'picocolors'
import ora from 'ora'

const SNAPPY_LOGO = `
    ███████╗███╗   ██╗ █████╗ ██████╗ ██████╗ ██╗   ██╗
    ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝
    ███████╗██╔██╗ ██║███████║██████╔╝██████╔╝ ╚████╔╝ 
    ╚════██║██║╚██╗██║██╔══██║██╔═══╝ ██╔═══╝   ╚██╔╝  
    ███████║██║ ╚████║██║  ██║██║     ██║        ██║   
    ╚══════╝╚═╝  ╚═══╝╚╚╝  ╚═╝╚═╝     ╚═╝        ╚═╝   
`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG_DIR = path.join(os.homedir(), '.snappy')
const LOREM_CONFIG_FILE = path.join(CONFIG_DIR, 'lorem.json')
const AUTH_FILE = path.join(CONFIG_DIR, 'auth.json')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')

// This is the Client ID for GitHub Device OAuth
const CLIENT_ID = 'Ov23liWHoGiMponaUxrc'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

// --- Auth & Config Utilities ---

function getSavedToken() {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'))
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
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ access_token: token }, null, 2))
}

function getSavedConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'))
    } catch (e) {
      return {}
    }
  }
  return {}
}

function saveConfig(config) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
  }
  const current = getSavedConfig()
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ ...current, ...config }, null, 2))
}

function getMachineId() {
  const machineIdFile = path.join(CONFIG_DIR, 'machine-id')
  const hostname = os.hostname()
  
  if (fs.existsSync(machineIdFile)) {
    return {
      id: fs.readFileSync(machineIdFile, 'utf8').trim(),
      hostname
    }
  }

  // Generate a stable ID based on hardware info
  const platform = os.platform()
  const arch = os.arch()
  const cpus = os.cpus().length
  
  const rawId = `${platform}-${arch}-${cpus}-${hostname}`
  const hash = crypto.createHash('sha256').update(rawId).digest('hex').substring(0, 12)
  
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true })
  }
  fs.writeFileSync(machineIdFile, hash)
  return { id: hash, hostname }
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

function getPackageManager() {
  return 'pnpm'
}

async function main() {
  console.log(pc.cyan(SNAPPY_LOGO))
  console.log(pc.cyan('🚀 Welcome to the SNAPPY Stack Installer! (v0.1.18)'))
  console.log('------------------------------------------')

  const program = new Command()
  program
    .name('create-snappy')
    .description('The official installer for the SNAPPY stack. (Private Access Required)')
    .argument('[project-name]', 'Name of the project directory')
    .option('-t, --template <name>', 'Template to use (portfolio)', 'portfolio')
    .option('--login', 'Authenticate with GitHub to access private templates')
    .option('--guided', 'Force guided setup for environment variables')
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

  const savedConfig = getSavedConfig()
  const hasSavedConfig = Object.keys(savedConfig).length > 0

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
    initial: savedConfig.authorName || 'Wicky',
  })

  if (!options.template) {
    questions.push({
      type: 'select',
      name: 'template',
      message: 'Which template would you like to use?',
      choices: [
        { title: 'Portfolio', description: 'A sleek portfolio template', value: 'portfolio' },
      ],
      initial: 0,
    })
  }

  questions.push({
    type: 'password',
    name: 'snappyLicenseKey',
    message: 'SNAPPY License Key (leave blank for trial)?',
    initial: savedConfig.snappyLicenseKey || '',
  })

  // Guided Setup Questions
  const needsGuided = options.guided || !hasSavedConfig

  if (needsGuided) {
    console.log(pc.yellow('\n🛠️  Guided Setup: Please enter your infrastructure details.'))
    console.log(pc.gray('These will be saved to ~/.snappy/config.json for future use.\n'))

    questions.push(
      {
        type: 'text',
        name: 's3Bucket',
        message: 'R2/S3 Bucket Name?',
        initial: savedConfig.s3Bucket || 'snappy-production',
      },
      {
        type: 'text',
        name: 's3Region',
        message: 'R2/S3 Region?',
        initial: savedConfig.s3Region || 'auto',
      },
      {
        type: 'text',
        name: 's3Endpoint',
        message: 'R2/S3 Endpoint URL?',
        initial: savedConfig.s3Endpoint || '',
      },
      {
        type: 'password',
        name: 's3AccessKey',
        message: 'R2/S3 Access Key ID?',
        initial: savedConfig.s3AccessKey || '',
      },
      {
        type: 'password',
        name: 's3SecretKey',
        message: 'R2/S3 Secret Access Key?',
        initial: savedConfig.s3SecretKey || '',
      },
    )
  }

  const response = await prompts(questions, {
    onCancel: () => {
      console.log(pc.yellow('Installation cancelled.'))
      process.exit(0)
    },
  })

  // Merge responses with saved config
  const config = {
    ...savedConfig,
    authorName: response.authorName || savedConfig.authorName,
    snappyLicenseKey: response.snappyLicenseKey || savedConfig.snappyLicenseKey,
    s3Bucket: response.s3Bucket || savedConfig.s3Bucket,
    s3Region: response.s3Region || savedConfig.s3Region,
    s3Endpoint: response.s3Endpoint || savedConfig.s3Endpoint,
    s3AccessKey: response.s3AccessKey || savedConfig.s3AccessKey,
    s3SecretKey: response.s3SecretKey || savedConfig.s3SecretKey,
  }

  // Save if it was a guided session or forced
  if (needsGuided) {
    saveConfig(config)
  }

  const projectName = providedName || response.projectName
  const projectDescription = response.projectDescription
  const authorName = config.authorName
  const selectedTemplate = options.template || response.template || 'portfolio'

  const targetDir = path.resolve(process.cwd(), projectName)

  // Target directory check (but don't create yet to keep it empty for git clone)
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

  let finalLicenseToken = config.snappyLicenseKey;
  let isTrial = false;
  let { id: machineId, hostname } = getMachineId();
  let machineIdToSave = machineId;
  let skippedLicense = false;

  // Auto-detect Lorem Ipsum sandbox for developers
  let loremConfig = null;
  if (fs.existsSync(LOREM_CONFIG_FILE)) {
    try {
      loremConfig = JSON.parse(fs.readFileSync(LOREM_CONFIG_FILE, 'utf8'));
      if (!finalLicenseToken || finalLicenseToken.trim() === '') {
        console.log(pc.yellow('\n🧪 Developer Sandbox Detected: Auto-configuring Lorem Ipsum environment.'));
        isTrial = true;
        finalLicenseToken = 'lorem_sandbox_mode';
      } else {
        console.log(pc.green('\n✅ Using provided license key. (Sandbox config ignored)'));
      }
    } catch (e) {
      console.error(pc.red('⚠️ Failed to parse lorem.json: ' + e.message));
    }
  }

  if (!isTrial && (!finalLicenseToken || finalLicenseToken.trim() === '')) {
    const trialResponse = await prompts({
      type: 'confirm',
      name: 'startTrial',
      message: '🎯 Start 2-hour free trial?',
      initial: true
    });

    if (trialResponse.startTrial) {
      console.log(pc.cyan('\n⏳ Setting up 2-hour free trial...'));
      
      try {
        const res = await fetch('https://snappycore.wicky.id/api/trial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ machineId, hostname })
        });
        
        const data = await res.json();
        if (res.ok && data.token) {
          finalLicenseToken = data.token;
          isTrial = true;
          machineIdToSave = machineId;
        } else {
          console.error(pc.red(`\n❌ Trial generation failed: ${data.error || 'Unknown error'}`));
          console.log(pc.gray('The installer cannot proceed without a valid trial license.'));
          process.exit(1);
        }
      } catch (err) {
        console.error(pc.red(`\n❌ Could not reach licensing server: ${err.message}`));
        process.exit(1);
      }
    } else {
      skippedLicense = true;
    }
  }

  try {
  // 1. Initialize from repository
    const repoUrl = 'https://github.com/snappy-stack/snappy.git'
    const cloneSpinner = ora(`Cloning template (${selectedTemplate})...`).start()

    try {
      // Use inherit to see actual errors if it fails
      cloneSpinner.stop()
      execSync(`git clone --depth 1 -b ${selectedTemplate} ${repoUrl} "${targetDir}"`, {
        stdio: 'inherit',
      })
      
      // Template already has correct payload.config.ts — no patching needed.
      console.log(pc.green('✔ Project cloned successfully.'))
    } catch (err) {
      console.error(pc.red("\n❌ Installation failed during project cloning."))
      console.error(pc.gray(`Template: ${selectedTemplate}`))
      console.error(pc.gray(`Repository: ${repoUrl}`))
      throw err
    }

    // Now safe to write metadata files
    if (machineIdToSave) {
      fs.writeFileSync(path.join(targetDir, '.snappy-machine-id'), machineIdToSave);
    }

    if (fs.existsSync(path.join(targetDir, '.git'))) {
      fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true })
    }
    console.log(pc.green('✅ Project initialized from secure source.'))

    // 2. Customize package.json and README.md
    console.log('\n📝 Customizing project files...')
    const pkgPath = path.join(targetDir, 'package.json')
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      pkg.name = projectName.toLowerCase().replace(/\s+/g, '-')
      pkg.description = projectDescription || pkg.description
      pkg.author = authorName || pkg.author
      if (pkg.bin) delete pkg.bin
      
      // FIX LEXICAL MISMATCH - FORCE 0.35.0
      if (pkg.dependencies) {
        const targetLexical = "0.35.0";
        console.log(pc.yellow(`🔄 Forcing Lexical dependencies to ${targetLexical}...`));
        
        // Fix main dependency
        pkg.dependencies.lexical = targetLexical;

        // Update @snappy-stack/core to latest
        if (pkg.dependencies['@snappy-stack/core']) {
          pkg.dependencies['@snappy-stack/core'] = '^0.1.7';
        }
        
        // Fix all @lexical/* sub-dependencies
        Object.keys(pkg.dependencies).forEach(dep => {
          if (dep.startsWith('@lexical/')) {
            pkg.dependencies[dep] = targetLexical;
          }
        });

        // Add overrides for pnpm/npm to be absolutely sure
        pkg.overrides = { ...pkg.overrides, lexical: targetLexical };
        pkg.resolutions = { ...pkg.resolutions, lexical: targetLexical }; // For yarn
        pkg.pnpm = { 
          ...pkg.pnpm, 
          overrides: { ...pkg.pnpm?.overrides, lexical: targetLexical } 
        };
      }

      // CLEANUP LOCKFILES
      ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock'].forEach(lock => {
        const lockPath = path.join(targetDir, lock);
        if (fs.existsSync(lockPath)) fs.unlinkSync(lockPath);
      });

      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
    }

    const readmePath = path.join(targetDir, 'README.md')
    if (fs.existsSync(readmePath)) {
      const readmeContent = `# ${projectName}\n\n${projectDescription}\n\nGenerated with \`create-snappy\`.`
      fs.writeFileSync(readmePath, readmeContent)
    }
    console.log(pc.green('✅ Project details injected.'))

    // 3. Configure .env
    console.log('\n🛠️ Configuring environment variables...')
    
    const finalS3Bucket = config.s3Bucket
    const finalS3Endpoint = config.s3Endpoint
    const finalS3AccessKey = config.s3AccessKey
    const finalS3SecretKey = config.s3SecretKey
    const finalS3Region = config.s3Region

    const payloadSecret = crypto.randomBytes(32).toString('hex')
    
    const envContent = `# SNAPPY STACK - Zero-Config Environment
SNAPPY_LICENSE_TOKEN="${finalLicenseToken || ''}"
SNAPPY_API_URL="https://snappycore.wicky.id"

# Payload CMS
PAYLOAD_SECRET="${payloadSecret}"
PUBLIC_FRONTEND_URL="http://localhost:3000"

# R2 Storage Configuration (Isolated via SNAPPY)
S3_BUCKET="${finalS3Bucket}"
NEXT_PUBLIC_S3_BUCKET="${finalS3Bucket}"
S3_REGION="${finalS3Region}"
S3_ENDPOINT="${finalS3Endpoint}"
S3_ACCESS_KEY_ID="${finalS3AccessKey}"
S3_SECRET_ACCESS_KEY="${finalS3SecretKey}"
`
    fs.writeFileSync(path.join(targetDir, '.env'), envContent)
    console.log(pc.green('✅ .env generated.\n'))

    if (process.env.SKIP_INSTALL !== 'true') {
      const pm = getPackageManager()
      const installCmd = pm === 'npm' ? 'npm install' : `${pm} install`
      const installSpinner = ora(`Installing dependencies using ${pm}...`).start()
      try {
        execSync(installCmd, { cwd: targetDir, stdio: 'ignore' })
        installSpinner.succeed('Dependencies installed successfully.')
      } catch (e) {
        installSpinner.fail('Failed to install dependencies.')
        console.warn(pc.yellow(`Warning: ${installCmd} failed.`))
      }
    }

    const pmRun = getPackageManager() === 'npm' ? 'npm run dev' : `${getPackageManager()} run dev`

    if (skippedLicense) {
      console.log(pc.red('\n  ──────────────────────────────────'));
      console.log(`    🔑 ${pc.bold(pc.white('Add your license key to .env'))}`);
      console.log(pc.gray('       SNAPPY_LICENSE_TOKEN=sk_snappy_...'));
      console.log('');
      console.log(`    📡 ${pc.cyan('Get your key: wicky.id')}`);
      console.log(`    📖 ${pc.cyan('Docs: snappycore.wicky.id')}`);
      console.log(pc.red('  ──────────────────────────────────'));
      console.log(pc.bold(pc.red('\n    THERE IS NO MERCY IN PRODUCTION 👹 \n')));
    } else if (isTrial) {
      console.log(pc.green('\n✅ 2-hour free trial active! Your trial license has been added to .env.'));
    }

    console.log(pc.green('\n✅ SNAPPY Stack is perfectly prepared and ready to launch!'))
    console.log(`\nNext steps:\n  cd ${pc.bold(projectName)}\n  ${pmRun}\n`)

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

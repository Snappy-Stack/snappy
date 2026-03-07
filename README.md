<div align="center">
  <h1>⚡ The SNAPPY Stack</h1>
  <p><strong>Speed. Power. Premium UI.</strong><br/>The ultimate Next.js 15 + Payload CMS v3 starter template tailored for freelance developers and high-end agencies.</p>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Payload CMS](https://img.shields.io/badge/Payload-v3-black?style=flat-square&logo=payload)](https://payloadcms.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20|%20S3-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Ark UI](https://img.shields.io/badge/Ark%20UI-Components-E45354?style=flat-square)](https://ark-ui.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🚀 Why SNAPPY?

The SNAPPY stack eliminates boilerplate while holding onto premium, custom-coded flexibility. It bridges the gap between headless CMS scalability and beautiful, accessible frontend components.

- **Payload CMS v3 APIs**: Run your CMS seamlessly alongside your Next.js App Router. No complex multi-repo deployments.
- **Supabase Backbone**: Out-of-the-box configuration for Supabase PostgreSQL and S3 Object Storage.
- **Ark UI & Tailwind v4**: Headless, accessible components styled with the latest utility-first CSS engine.
- **Zero-Config CLI**: Instantly bootstrap a new, fully connected project using the secure `create-snappy` CLI.

## 🛠️ Getting Started

### 1. Bootstrap a New Project

Use our dedicated CLI for an instant setup. The CLI handles environment configuration, package installation, and database cloning.

```bash
npx @snappy/backend create-snappy my-new-project
```

_(For private repository access, authenticate first using `npx @snappy/backend create-snappy login`)_

### 2. Local Development

Navigate to your new project and start the development server:

```bash
cd my-new-project
pnpm run dev
```

_Your application will be available at `http://localhost:3000`._
_Your Admin Panel will be available at `http://localhost:3000/admin`._

### 3. Database Workflows

**Migrations**
Never use external GUI tools to alter the database schema. Whenever you modify a Payload Collection or Global, generate a migration:

```bash
pnpm run migrate:create my_new_feature
pnpm run migrate
```

**Seeding**
Need dummy data? The template includes a seeder that creates an Admin user, Landing Pages, and Blog posts:

```bash
pnpm run seed
```

## 🏗️ Project Architecture

```plaintext
my-new-project/
├── .agent/            # AI Assistant Rules (SNAPPY Conventions)
├── src/
│   ├── app/           # Next.js App Router (Frontend + API Routes)
│   ├── collections/   # Payload CMS Collections (Users, Media, etc.)
│   ├── components/    # Reusable React & Ark UI Components
│   └── globals/       # Payload CMS Globals (Nav, SEO, Branding)
├── .env               # Supabase Connection Strings
└── package.json       # Project Scripts & Dependencies
```

## ☁️ Deployment

The SNAPPY stack is perfectly optimized for modern edge infrastructure.

1. **Frontend & Compute**: Deploy directly to [Vercel](https://vercel.com).
2. **Database & Storage**: Connect to [Supabase](https://supabase.com) using your provisioned `DATABASE_URL` and `S3_ENDPOINT`.

---

<div align="center">
  Built with ❤️ for modern web agencies.
</div>

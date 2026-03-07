# SNAPPY Stack Future Improvements (Post-V1)

This document tracks planned improvements for the SNAPPY Template that will elevate the UI robustness and development experience after the core V1 features (Auth, Data, SEO, Error Handling) are solid.

## 1. Foundational Base UI Components (Ark UI + Tailwind v4)

A premium template needs a baseline set of beautifully styled, accessible components pre-built in the `src/components/ui/` folder.

- **Button**: Implement `Button` with variants (primary, secondary, outline, ghost) and loading states.
- **Form Primitives**: Implement `Input`, `Label`, and `Textarea` for consistent form styling.
- **Layout Primitives**: Implement `Card` (CardHeader, CardContent, CardFooter) wrappers utilizing glassmorphism or premium shadows.
- **Dialog & Modals**: Implement accessible `Dialog` components for alerts and confirmations.

## 2. Developer Experience (DX)

- **Git Hooks**: Setup Husky + lint-staged to run Prettier & ESLint automatically on every `git commit`. This enforces style consistency without developer intervention.
- **CI/CD Pipelines**: Add `.github/workflows/ci.yml` for automated testing, type-checking, and Playwright e2e test runs on every Pull Request.
- **VSCode Workspace Integration**: Add `.vscode/extensions.json` to automatically prompt users to install Payload, Tailwind, and ESLint extensions.

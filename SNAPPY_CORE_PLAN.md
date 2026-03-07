# SNAPPY Core Package & Authentication Architecture

## The Vision: `@snappy/core`

To prevent unauthorized white-labeling and keep your proprietary code separated from the boilerplate, we will move the brains of SNAPPY into its own NPM package (e.g., `@snappy/core`).

When users run `npx create-snappy`, they get the UI, styling, and basic schema, but the deep authentication, deployment telemetry, and admin controls are locked inside the core package.

### Architecture Overview

1. **The Core Wrapper (`withSnappy`)**
   Your `payload.config.ts` will no longer define all the rules. It will be wrapped by the core package:

   ```ts
   import { withSnappy } from '@snappy/core'

   export default withSnappy(
     buildConfig({
       collections: [
         /* User collections */
       ],
       // ...
     }),
   )
   ```

2. **Encrypted Baked-in Admin**
   - The `@snappy/core` package will **hardcode** and optionally obfuscate your `ADMIN_EMAIL` (winner@... or wicky@...).
   - The core wrapper automatically modifies the `Users` collection to forcefully grant your baked-in email Super Admin rights on database initialization.
   - Users cannot easily delete this because it's injected dynamically at runtime via the core package.

3. **Magic Link Authentication (Resend)**
   - No passwords. The core package will override the default Payload login UI.
   - We will implement a custom `/login` route inside `@snappy/core` that generates a secure token and emails it via Resend API.
   - The login route can be moved to a secret URL (e.g., `/snappy-access`) configurable via the core, so it's not even visible as `/login` to the public.

4. **Dynamic Owner Setup (npx create-snappy)**
   - During CLI setup, it will prompt for `OWNER_EMAIL`.
   - This saves to their `.env` file.
   - On first boot, `@snappy/core` reads `OWNER_EMAIL` and seeds them as an Admin alongside your baked-in email.

5. **Token-Based Deployment (Future)**
   - By controlling the core package, you can eventually require a `SNAPPY_LICENSE_TOKEN` in the `.env`.
   - The core package can verify this token against your central server during the build phase before allowing the Next.js app to compile.

## Immediate Implementation Steps

**Phase 0: Finalize Wicky.ID Template (Current)**

1. Complete all visual and functional requirements for the Wicky.ID portfolio based on the current monolith structure.
2. Refine all Payload UI elements, the frontend Next.js app, and existing deployment pipelines.
3. Once the "perfect template" is achieved, freeze the feature set to prepare for extraction.

**Phase 1: Package Creation**

1. Extract the `Users` collection logic, Authentication hooks, and Seeding logic out of `Template_Snappy`.
2. Move them into a local `packages/snappy-core` directory (using npm workspaces) to build the abstraction.

**Phase 2: Magic Links**

1. Create a custom Payload endpoint in the core package to handle Magic Link generation.
2. Integrate Resend email sending within the core.
3. Build the custom, hidden login page.

**Phase 3: The CLI Update**

1. Update `create-snappy` to automatically set up standard `.env` variables and the `OWNER_EMAIL`.
2. Ensure the generated template properly imports from the new core package.

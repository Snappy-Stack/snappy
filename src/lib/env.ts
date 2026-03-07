/**
 * Simple environment variable validation to prevent cryptic runtime errors.
 * This runs on the server side during initialization.
 */
export function validateEnv() {
 // List of strictly required variables that must exist for the app to function
 const required = [
 'DATABASE_URL',
 'PAYLOAD_SECRET',
 'S3_BUCKET',
 'S3_ACCESS_KEY_ID',
 'S3_SECRET_ACCESS_KEY',
 'S3_REGION',
 'S3_ENDPOINT',
 ]

 const missing = required.filter((key) => !process.env[key])

 // Explicitly handle PUBLIC_FRONTEND_URL with a fallback if missing
 if (!process.env.PUBLIC_FRONTEND_URL) {
 process.env.PUBLIC_FRONTEND_URL = 'http://localhost:3000'
 }

 if (missing.length > 0) {
 const errorMsg = `
❌ MISSING ENVIRONMENT VARIABLES:
${missing.map((key) => ` - ${key}`).join('\n')}

Please check your .env file and ensure all required variables are set.
`
 console.error(errorMsg)

 // In production, we want to throw to prevent boot.
 // In development, we log clearly so the developer knows what to fix.
 if (process.env.NODE_ENV === 'production') {
 throw new Error('Missing required environment variables. See logs for details.')
 }
 }
}

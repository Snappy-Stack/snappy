const { getPayload } = require('payload')
const config = require('./src/payload.config').default

async function testAuth() {
  const payload = await getPayload({ config })
  try {
    const result = await payload.login({
      collection: 'users',
      data: {
        email: 'admin@snappy.io',
        password: 'snappy123', // Use the password seeded earlier
      },
    })
    console.log('Login successful:', !!result.token)
    console.log('Token snippet:', result.token ? result.token.substring(0, 15) + '...' : 'null')
    console.log('User:', result.user?.email)
  } catch (err) {
    console.error('Login failed:', err)
  }
  process.exit(0)
}

testAuth()

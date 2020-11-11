const fetch = require('node-fetch')

const handler = async function (event) {
  try {
    const { authorization } = event.headers
    const response = await fetch('https://roei.arzv.nl/login.php', {
      headers: {
        cookie: authorization
      },
      redirect: 'manual'
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        // Unsuccessful is 200, stays on login. Successful is 302, goes to index
        valid: response.status === 302
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}

module.exports = { handler }

const fetch = require('node-fetch')

const handler = async function (event) {
  try {
    const { authorization } = event.headers
    const response = await fetch('https://roei.arzv.nl/login.php', {
      headers: {
        cookie: `PHPSESSID=${authorization}`
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: response.url.endsWith('home.php')
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

const fetch = require('node-fetch')
const qs = require('querystring')
const crypto = require('crypto')

const handler = async function (event) {
  try {
    const { body } = event
    const { username, password } = JSON.parse(body)

    // Create own session id the one received from server does not always work
    const token = crypto.randomBytes(13).toString('hex')
    const response = await fetch('https://roei.arzv.nl/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: `PHPSESSID=${token}`
      },
      body: qs.stringify({
        username,
        password,
        remember: 'on',
        remember_device: 'on'
      })
    })

    if (response.url.endsWith('home.php')) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          id: username,
          token
        })
      }
    }

    return {
      statusCode: 403,
      body: JSON.stringify({
        success: false,
        error: 'Invalid username or password'
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

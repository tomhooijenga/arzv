const fetch = require('node-fetch')
const qs = require('querystring')
const setCookieParser = require('set-cookie-parser')

const handler = async function (event) {
  try {
    const { body } = event
    const { username, password } = JSON.parse(body)

    const response = await fetch('https://roei.arzv.nl/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.stringify({
        username,
        password,
        remember: 'on',
        remember_device: 'on'
      }),
      redirect: 'manual'
    })

    // Unsuccessful is 200, stays on login. Successful is 302, goes to index
    if (response.status === 200) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          success: false,
          error: 'Invalid username or password'
        })
      }
    }

    const cookiesHeader = response.headers.raw()['set-cookie']
    const cookies = setCookieParser(cookiesHeader, {
      map: true
    })
    const token = ['PHPSESSID', 'roei-cookid', 'roei-cookname'].map((name) => {
      return `${name}=${encodeURIComponent(cookies[name].value)}`
    }).join('; ')

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        id: username,
        token
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

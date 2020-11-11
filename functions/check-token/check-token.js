const fetch = require('node-fetch')

const handler = async function (event) {
  try {
    const { authorization } = event.headers
    const response = await fetch('https://roei.arzv.nl/blocks/arzv_boot_afschrijven/get_boot_lijst.php', {
      headers: {
        cookie: authorization
      }
    })
    const doc = await response.text()

    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: doc.length > 0
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

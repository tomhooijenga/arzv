const fetch = require('node-fetch')
const qs = require('qs')

const handler = async function (event) {
  try {
    const { authorization } = event.headers
    const body = JSON.parse(event.body)

    const response = await fetch('https://roei.arzv.nl/blocks/arzv_boot_afschrijven/delete_booking.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        cookie: authorization
      },
      body: qs.stringify({
        booking_id: body.id,
        user_id: body.user_id
      })
    })

    const doc = await response.text()

    if (doc.length === 0) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          success: false,
          error: 'Token expired'
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true
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

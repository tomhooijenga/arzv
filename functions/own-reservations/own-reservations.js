const fetch = require('node-fetch')
const qs = require('querystring')
const cheerio = require('cheerio')
const { parse } = require('date-fns')

const handler = async function (event) {
  try {
    const { authorization } = event.headers
    const body = JSON.parse(event.body)

    const response = await fetch('https://roei.arzv.nl/blocks/arzv_boot_afschrijven/list_bookings.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: `PHPSESSID=${authorization}`
      },
      body: qs.stringify({
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

    const $ = cheerio.load(doc)
    const reservations = $('.display_list > li')
      .get()
      .map((item) => {
        const id = $(item).find('.booking_delete').attr('id')
        const [, boat, start, end] = $(item).find('.booking_info').text().match(/(.+) tussen (.+) en (.+)/)
        return {
          id,
          boat,
          person: '',
          start: parse(start, 'dd-MM-yyyy HH:mm', 0),
          end: parse(end, 'dd-MM-yyyy HH:mm', 0)
        }
      })

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        reservations
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack
      })
    }
  }
}

module.exports = { handler }

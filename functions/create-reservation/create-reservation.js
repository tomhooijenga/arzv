const fetch = require('node-fetch')
const qs = require('querystring')
const { format } = require('date-fns')
const cheerio = require('cheerio')

const handler = async function (event) {
  try {
    const { authorization } = event.headers
    const body = JSON.parse(event.body)
    const start = new Date(body.start)
    const end = new Date(body.end)

    const response = await fetch('https://roei.arzv.nl/blocks/arzv_boot_afschrijven/make_booking.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        cookie: authorization
      },
      body: qs.stringify({
        boat_array: body.boats.join(','),
        start_date: format(start, 'dd-MM-yyyy'),
        start_time: format(start, 'HH:mm'),
        end_date: format(end, 'dd-MM-yyyy'),
        end_time: format(end, 'HH:mm'),
        other_booking_id: body.user_id
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

    console.log(response.url, response.status, doc)

    const $ = cheerio.load(doc)
    const results = $('.booking_good, .booking_bad')
      .get()
      .map((item, i) => {
        return [body.boats[i].toString(), $(item).is('.booking_good')]
      })

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        available: Object.fromEntries(results)
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

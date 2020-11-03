const fetch = require('node-fetch')
const cheerio = require('cheerio')

const handler = async function (event) {
  try {
    const { authorization } = event.headers
    const response = await fetch('https://roei.arzv.nl/boot_afschrijven.php', {
      headers: {
        cookie: `PHPSESSID=${authorization}`
      }
    })
    const doc = await response.text()
    const $ = cheerio.load(doc)

    const items = $('#booking_details .booking_date_header, #booking_details .booking_date_header ~ div')

    let date = ''
    const reservations = []

    for (let i = 0; i < items.length; i++) {
      const item = $(items[i])

      if (item.is('.booking_date_header')) {
        const [d, m, y] = item.text().trim().split('-')
        date = `${y}-${m}-${d}`
      } else {
        const match = item.text().match(/(\d+:\d+) - (\d+:\d+)/)
        const [, from, to] = match
        const boat = item.find('b').text().trim()
        const person = item.find('i').text().trim().replace(/^\(|\)$/g, '')

        reservations.push({
          start: new Date(`${date} ${from}:00`),
          end: new Date(`${date} ${to}:00`),
          boat,
          person
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(reservations)
    }
  } catch (error) {
    // output to netlify function log
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({
        error: error.message
      })
    }
  }
}

module.exports = { handler }

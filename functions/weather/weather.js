const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { zonedTimeToUtc } = require('date-fns-tz')
const { parse } = require('date-fns')

function weatherValue (nodes, index) {
  return parseFloat(nodes.eq(index).text().replace(',', '.'))
}

const handler = async function () {
  try {
    const response = await fetch('https://roei.arzv.nl/home.php')
    const doc = await response.text()

    const $ = cheerio.load(doc)
    const ban = $('.vaarverbod_under_display').text()
    const weather = {
      ban: {
        active: false
      }
    }

    if (ban) {
      const [date, time] = ban.match(/(\d+[-:]\d+[-:]\d+)/g)
      const datetime = zonedTimeToUtc(parse(`${date} ${time}`, 'dd-MM-yyyy HH:mm:ss', 0), 'Europe/Amsterdam')

      weather.ban.active = true
      weather.ban.start = datetime
    }

    const weatherNodes = $('.weather_info')

    weather.temperature = weatherValue(weatherNodes, 0)
    weather.wind = weatherValue(weatherNodes, 1)
    weather.gusts = weatherValue(weatherNodes, 2)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        weather
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.stack
      })
    }
  }
}

module.exports = { handler }

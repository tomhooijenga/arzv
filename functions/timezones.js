const fetch = require('node-fetch')
const qs = require('querystring')
const { format } = require('date-fns')
const cheerio = require('cheerio')
const { zonedTimeToUtc } = require('date-fns-tz/esm')
const { utcToZonedTime } = require('date-fns-tz')

const handler = async function (event) {

    const date = event.queryStringParameters.date;

    return {
        statusCode: 200,
        body: JSON.stringify({
            input: date,
            date: new Date(date),
            utc: utcToZonedTime(date, 'Europe/Amsterdam')
        })
    }
}

module.exports = { handler }

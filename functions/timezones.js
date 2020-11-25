const { utcToZonedTime } = require('date-fns-tz')

const handler = async function (event) {

    const date = event.queryStringParameters.date;

    return {
        statusCode: 200,
        body: JSON.stringify({
            input: date,
            date: new Date(date).toString(),
            utc: utcToZonedTime(date, 'Europe/Amsterdam').toString()
        })
    }
}

module.exports = { handler }

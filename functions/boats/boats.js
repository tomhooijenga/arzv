const fetch = require('node-fetch')
const cheerio = require('cheerio')

const handler = async function (event) {
  try {
    const { authorization } = event.headers

    const response = await fetch('https://roei.arzv.nl/boot_afschrijven.php', {
      headers: {
        Cookie: `PHPSESSID=${authorization}`
      }
    })

    if (response.url.endsWith('login.php')) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          success: false,
          error: 'Token expired'
        })
      }
    }

    const doc = await response.text()
    const $ = cheerio.load(doc)

    const boats = $('#display_boten > .boot_type')
      .get()
      .map((boat) => {
        return {
          id: $('[name="boot_id"]', boat).val() || null,
          name: $('[type="submit"]', boat).val(),
          type: $('.boot_type_label', boat).text(),
          instruction: $('.boot_instructie', boat).length === 1,
          use: $('[data-gebruik]', boat).data('gebruik') || 'Buiten gebruik',
          weight: parseInt($('.boot_gewicht', boat).text()) || null,
          sweep: $('.boot_bord', boat).text(),
          scull: $('.boot_skull', boat).text(),
          steer: $('.boot_stuur', boat).text()
        }
      })

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        boats
      }, null, 2)
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

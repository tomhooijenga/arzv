module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule
      .use('html-loader')
      .loader('html-loader')
  },
  pwa: {
    name: 'ARZV Boten Afschrijven',
    themeColor: '#e52620',
    msTileColor: '#e52620',
    workboxOptions: {
      clientsClaim: true,
      skipWaiting: true
    },
    manifestOptions: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      background_color: '#e52620'
    }
  }
}

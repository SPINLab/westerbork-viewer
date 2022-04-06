const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  publicPath: './',

  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './node_modules/potree/build/potree/potree.js',
            to: 'libs/potree/potree.js',
          },
          {
            from: './node_modules/potree/build/potree/workers/',
            to: 'libs/potree/workers/',
          },
          { from: './node_modules/potree/libs/', to: 'libs/potree/libs/' },
          {
            from: './node_modules/potree/resources/icons/',
            to: 'libs/potree/resources/icons/',
          },
          {
            from: './node_modules/potree/resources/images/',
            to: 'libs/potree/resources/images/',
          },
          {
            from: './node_modules/potree/resources/textures/',
            to: 'libs/potree/resources/textures/',
          },
        ],
      }),
    ],
  },

  pluginOptions: {
    i18n: {
      locale: 'nl',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};

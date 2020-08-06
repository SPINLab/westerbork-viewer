const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  publicPath: './',

  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './node_modules/@tweenjs/tween.js/src/Tween.js',
            to: 'libs/tweenjs/Tween.js',
          },
          {
            from: './node_modules/jquery/dist/jquery.min.js',
            to: 'libs/jquery/jquery.min.js',
          },
          {
            from: './node_modules/three/build/three.min.js',
            to: 'libs/three/three.min.js',
          },
          {
            from: './node_modules/proj4/dist/proj4.js',
            to: 'libs/proj4/proj4.js',
          },
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

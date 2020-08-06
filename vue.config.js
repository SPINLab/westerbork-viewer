const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  publicPath: './',

  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: './node_modules/@tweenjs/tween.js/src/Tween.js',
          to: 'libs/tweenjs/Tween.js',
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: './node_modules/jquery/dist/jquery.min.js',
          to: 'libs/jquery/jquery.min.js',
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: './node_modules/three/build/three.min.js',
          to: 'libs/three/three.min.js',
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: './node_modules/proj4/dist/proj4.js',
          to: 'libs/proj4/proj4.js',
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: './node_modules/potree/build/potree/potree.js',
          to: 'libs/potree/potree.js',
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: './node_modules/potree/build/potree/workers/',
          to: 'libs/potree/workers/',
        },
      ]),
      new CopyWebpackPlugin([
        { from: './node_modules/potree/libs/', to: 'libs/potree/libs/' },
      ]),
      new CopyWebpackPlugin([
        {
          from: './node_modules/potree/resources/icons/',
          to: 'libs/potree/resources/icons/',
        },
      ]),
      new CopyWebpackPlugin([
        {
          from: './node_modules/potree/resources/textures/',
          to: 'libs/potree/resources/textures/',
        },
      ]),
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

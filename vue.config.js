const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  publicPath: "./",
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        { from: "./node_modules/@tweenjs/", to: "libs/@tweenjs/" }
      ]),
      new CopyWebpackPlugin([
        { from: "./node_modules/jquery/", to: "libs/jquery/" }
      ]),
      new CopyWebpackPlugin([
        { from: "./node_modules/three/", to: "libs/three/" }
      ]),
      new CopyWebpackPlugin([
        { from: "./node_modules/proj4", to: "libs/proj4/" }
      ]),
      new CopyWebpackPlugin([
        { from: "./node_modules/potree", to: "libs/potree/" }
      ])
    ]
  }
};

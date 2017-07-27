const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    app: ["babel-polyfill", "./app.js"]
  },
  output: {
    path: __dirname,
    filename: "./dist/[name].bundle.js",
  },
  devServer: {
    inline: true,
    contentBase: './',
    port: 9001
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "sasslint-loader"
          }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "eslint-loader"
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ["env", "react", "es2015", "stage-2", "stage-0"],
              plugins: [require('babel-plugin-transform-object-rest-spread')]
            }
          }
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("development"),
        "API_LOCATION_HREF": JSON.stringify("http://local.dev.com:9000")
      }
    })
  ]
}

const webpack = require("webpack");
const path = require("path");

/**
 * Build file for the feed-engine
 * "target": "node" has been added because fs and other built in node-modules were giving issues.
 * @type {{}}
 */

const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "node",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "gtrendsfeed.min.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "data/*"),
        to: path.resolve(__dirname, "build")
      }
    ])
  ]
};

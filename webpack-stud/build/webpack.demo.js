const path = require('path')
const firstPlugin = require('./plugins/webpack-firstPlugin')
const html = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(__dirname, '../dist2')
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: path.resolve(__dirname, 'loaders/drop-console.js')
    }]
  },
  plugins: [
    new html({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new firstPlugin()
  ]
}

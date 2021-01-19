const webpack = require('webpack')
const baseConfig = require('./webpack.config')
const merge = require('webpack-merge')

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 9988,
    hot: true,
    open: true,
    contentBase: '../dist'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})

const path = require('path')
const merge = require('webpack-merge')
const copyWebpackPlugin = require('copy-webpack-plugin')
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const uglifyJsPlugin = require('uglifyjs-webpack-plugin')
const parallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const baseConfig = require('./webpack.config')

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  plugins: [
    // new copyWebpackPlugin([{
    //   from: path.resolve(__dirname, '../public'),
    //   to: path.resolve(__dirname, '../dist')
    // }]),
    new parallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false,
          beautify: false
        },
        compress: {
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true
        }
      }
    })
  ],
  optimization: {
    minimizer: [
      new uglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new optimizeCssAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        }
      }
    }
  }
})

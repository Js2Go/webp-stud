const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    vendor: ['vue']
  },
  output: {
    path: path.resolve(__dirname, 'static/js'),
    filename: '[name].dll.js',
    library: '[name]_library',
    // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    })
  ]
}

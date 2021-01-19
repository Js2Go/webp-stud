const path = require('path')
const os = require('os')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const happyPack = require('happypack')
const webpack = require('webpack')
const copyWebpackPlugin = require('copy-webpack-plugin')
const bundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const happyThreadPool = happyPack.ThreadPool({ size: os.cpus().length })
const devMode = process.argv.indexOf('--mode=production') === -1

module.exports = {
  mode: 'development',
  devtool:'cheap-module-eval-source-map',
  entry: {
    main: path.resolve(__dirname, '../src/main.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[hash:8].js'
  },
  devServer: {
    port: 9876,
    hot: true,
    open: true,
    contentBase: '../dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'happypack/loader?id=happyBabel',
        }],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false
            }
          }
        }]
      },
      {
        test: /\.css$/,
        use: [{
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../dist/css',
            hmr: devMode
          }
        }, 'css-loader'],
      },
      {
        test: /\.sass$/,
        use: [{
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../dist/css',
            hmr: devMode
          }
        }, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.scss$/,
        use: [{
          loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          options: {
            publicPath: '../dist/css',
            hmr: devMode
          }
        }, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.ext$/,
        use: [
          'cache-loader'
        ],
        include: path.resolve(__dirname, 'src')
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      chunks: ['main']
    }),
    new vueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    new happyPack({
      id: 'happyBabel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env']
            ],
            cacheDirectory: true
          }
        }
      ],
      threadPool: happyThreadPool
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: path.resolve(__dirname, '../dist/static')
      }
    ]),
    new bundleAnalyzerPlugin({
      analyzerHost: '127.0.0.1',
      analyzerPort: 8889
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['*', '.js', '.json', '.vue']
  },
  externals: {
    jquery: 'jQuery'
  }
}

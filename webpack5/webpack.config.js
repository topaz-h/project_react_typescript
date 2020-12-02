const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const SpeedMeasureWebpack5Plugin = require('speed-measure-webpack5-plugin');
const smw = new SpeedMeasureWebpack5Plugin();
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = smw.wrap({
  mode: 'development',
  devtool: 'source-map',
  context: process.cwd(),
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    // 依次查找后缀
    extensions: ['js', 'jsx', 'json'],
    alias: {
      bootstrap: path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css')
    },
    modules: []
  },
  resolveLoader: {
    // 注册loader，添加自定义loader的目录（从node_modules找不到就从指定目录查找）
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  },
  module: {
    // noParse: //,
    rules: [
      {
        // 只能匹配数组中的某一个test
        oneOf: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
          {
            test: /\.less$/,
            use: [
              'style-loader',
              'css-loader',
              'less-loader'
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({

    }),
    new FriendlyErrorsWebpackPlugin({
      onErrors: (severity, errors) => {
        const error = errors[0];
        notifier.notify({
          title: 'webpack编译失败',
          message: severity + '：' + error.name,
          subtitle: error.file || '未找到文件',
          // icon
        })
      }
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true
    }),

  ],
  externals: {
    jquery: 'jQuery'
  }
})
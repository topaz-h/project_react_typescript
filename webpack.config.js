const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash:5].js'
  },
  devServer: {
    hot: true,
    // port 默认值：8080
    writeToDisk: true,
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: {
      // 起服务时先生成dist，再以静态资源访问dist；
      // 为browserHash时刷新重定向到index.html
      index: './index.html'
    }
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      // 这样配置后 @ 可以指向 src 目录
      "@": path.resolve("src")
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.[hash:5].html'
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
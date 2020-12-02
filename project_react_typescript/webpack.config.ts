const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/index.tsx',
  /*
  // 以下是使用 CDN 和资源 hash 的复杂示例：
  output: {
    path: "/home/proj/cdn/assets/[hash]",
    publicPath: "http://cdn.example.com/assets/[hash]/"
  },
  */
  output: {
    // 压缩导出js
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash:5].js'
  },
  devServer: {
    port: 8000,// port 默认值：8080
    host: "0.0.0.0",// 默认是 localhost
    // clientLogLevel: "none",
    compress: true,// 一切服务都启用gzip 压缩
    // 提供静态文件
    contentBase: [
      path.join(__dirname, 'dist'),
      path.join(__dirname, 'public'),
    ],
    hot: true,// 启用 webpack 的模块热替换特性
    hotOnly: true,// 启用热模块更换（请参阅devServer.hot服务器)如果生成失败，没有页面刷新作为回退。
    // open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://192.168.1.30:8085',//代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
        //ws: true, // proxy websockets
        pathRewrite: {//pathRewrite方法重写url
          '^/api': '/'
          //pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.16:8085/xxxx
          //pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
        }
      }
    },
    // index: 'index.htm',
    writeToDisk: true,
    historyApiFallback: {
      // 起服务时先生成dist，再以静态资源访问dist；
      // 为browserHash时刷新重定向到index.html
      index: './index.html'
    }
  },
  resolve: {
    // 自动解析确定的扩展; 能够使用户在引入模块时不带扩展
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      // 别名配置后 @ 可以指向 src 目录
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
    // 该插件将生成一个 HTML5 文件(支持生成多个)，该文件包含使用标记在正文中的所有捆绑包（包括script和link）。
    // html-webpack-插件将自动将所有必要的CSS、JS、meta和 favicon 文件注入到标记中。
    new HtmlWebpackPlugin({
      // 用于生成的 HTML 文档的标题
      title: "title",
      favicon: path.join(__dirname, 'public/favicon.ico'),
      // meta: {},
      // webpack模板的相对或绝对路径。支持html、hbs、ejs等等
      template: './public/index.html',
      filename: 'index.[hash:5].html'
    }),
    new HtmlWebpackPlugin({
      title: "title",
      favicon: path.join(__dirname, 'public/favicon.ico'),
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
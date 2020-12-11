// 1. node 内置模块
const path = require('path');
// 2. html模板打包插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 3. friendly识别某些类别的webpack错误，并清理，聚合和优先级; 通过node-notifier弹窗提示.
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
const errorIcon = path.join(__dirname, 'assets/image/ant_empty.svg');
/**
 * 4. 分析打包速度-包含总输出及每个插件、loader花费的时间(speed-measure-webpack-plugin不兼容webpack5,fork改造的)
 * 通过实例的wrap方法包裹config对象实现各个时间的分析结果输出在控制台
 */
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack5-plugin');
const smw = new SpeedMeasureWebpackPlugin();
/**
 * TreeMap sizes: [Stat文件信息, Parsed解析, Gzipped 压缩后]
 * 5. { "dev":"webpack --progress",
 *      "analyzer": "webpack-bundle-analyzer --port 8888 ./dist/stats.json"
 *    } 配合webpack一起使用。生成代码分析报告，提升代码质量
 */
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * @description {Object} webpack配置config对象 
 */
const config = {
  // 配置的模式
  mode: 'development',// ['development', 'production', 'none]
  // 调试工具的选择,不是浏览器插件
  devtool: 'source-map',
  // 上下文目录(根目录)
  // [process.cwd() 方法会返回 Node.js 进程的当前工作目录。](http://nodejs.cn/api/process/process_cwd.html)
  context: process.cwd(),
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 文件名：name表示变量,即入口的key值
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
        //ws: true, // proxy websocket
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
    // 不加扩展名时会按照数组顺序依次尝试添加扩展名进行匹配(文件越多放在越前面)
    extensions: [".js", ".jsx", ".json"],
    alias: {
      /**
       * 以bootstrap为例: 默认require('bootstrap')会导入package.json的main字段下的路径
       * { ...,"style": "dist/css/bootstrap.css","sass": "scss/bootstrap.scss","main": "dist/js/bootstrap.js",... }
       * 解决办法就是 require('bootstrap/dist/css/bootstrap.css') 或者 使用别名 require('bootstrap-css')
       */
      'bootstrap-css': path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css')
    },
    // 指定查找目录: webpack会使用类似 Node.js 一样进行路径搜索,不想一级一级往上查找
    modules: ['C:/node_modules', 'node_modules'],
    /**
     * package.json入口文件字段:
     * 配置 target === "web" 或者 target === "webworker" 时 mainFields 默认值是：
     * mainFields: ['browser', 'module', 'main'],
     * ----------------------------------------
     * target 的值为其他时，mainFields 默认值为：
     * mainFields: ["module", "main"],
     * eg: 以bootstrap为例可以把style加在main之前,就不会发生首先查找main了
     */
    /**
     * 当在package.json没有找到与mainFields匹配的入口,默认查找的文件名
     * mainFiles: ['index']
     */

  },
  // loader是函数-参数是一个文件内容,返回处理之后的文件内容(执行顺序从后往前)
  module: {
    rules: [
      {
        // oneOf
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
      },
    ]
  },
  // 插件是类class
  plugins: [
    /**
     * 该插件将生成一个 HTML5 文件(支持生成多个-实例化多个即可)，该文件包含使用标记在正文中的所有捆绑包（包括script和link）。
     * html-webpack-插件将自动将所有必要的CSS、JS、meta和 favicon 文件注入到标记中。支持esj语法
     */
    new HtmlWebpackPlugin({
      title: "webpack_optimize",// 用于生成的 HTML 文档的标题
      // meta: {},
      favicon: path.join(__dirname, 'public/favicon.ico'),
      template: './public/index.html',// webpack模板的相对或绝对路径。支持html、hbs、ejs等等
      // filename: 'index.[hash:5].html',
      filename: 'index.html'
    }),
    new FriendlyErrorsWebpackPlugin({
      onErrors: (severity, errors) => {
        const error = errors[0];
        notifier.notify({
          title: 'webpack编译错误',
          message: severity + '：' + error.name,
          subtitle: error.file || '',
          icon: errorIcon
        })
      }
    }),
    new BundleAnalyzerPlugin({
      /**
       * 不启动展示打包报告的http服务器 (默认build的时候启动port为8888展示分析报告)
       * 开启时控制台输出: `Webpack Bundle Analyzer is started at http://127.0.0.1:8888`
       */
      analyzerMode: 'disabled',
      /**
       * 是否生成stats.json文件
       * 在打包时额外生成stats.json,后续可通过 `"webpack-bundle-analyzer --port 8888 ./dist/stats.json"` 展示这个json描述的分析报告
       * 开启时控制台输出: `Webpack Bundle Analyzer saved stats file to 盘符:\绝对路径\dist\stats.json`
       */
      generateStatsFile: true,
    })
  ]
};
module.exports = smw.wrap(config);
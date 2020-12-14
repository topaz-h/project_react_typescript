// 1. node 内置模块
const path = require('path');
// 2. html模板打包插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 3. friendly识别某些类别的webpack错误，并清理，聚合和优先级; 通过node-notifier弹窗提示.
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
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

const { IgnorePlugin, DefinePlugin } = require('webpack');

// 6. 编译体积优化
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// 因为css可以和js并行加载:所以通过此插件提取css为单独文件,而不是内嵌在html中;然后去掉无用css并压缩
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssWebpackPlugin = require("purgecss-webpack-plugin");

// 文件匹配模块: 由字符串匹配出具体的文件
const glob = require("glob");
const PATHS = {
  src: path.join(__dirname, "src"),
  entry: path.resolve(__dirname, 'src/index.js'),
  dist: path.resolve(__dirname, 'dist'),
  public: path.join(__dirname, 'public'),
  bootstrapCss: path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css'),
  loaders: path.resolve(__dirname, 'loaders'),
  ico: path.join(__dirname, 'public/favicon.ico'),
  errorIcon: path.join(__dirname, 'src/assets/image/ant_empty.svg'),
  pages: path.resolve(__dirname, 'src/pages')
};

const entries = require('./config/entries');
const htmlPlugins = require('./config/html_plugins.js');
console.log('webpack.config.js', process.env.NODE_ENV)
/**
 * 环境:
 * 1. console.log('webpack.config.js', process.env.NODE_ENV);// undefined-取决于node
 * module.exports = (env)=>{// 脚本中"--mode=production"作为webpack.config.js的函数形式的参数
 *  console.log(env);// {development:true} | {production:true}
 *  return config;
 * }
 * {"build": "cross-env NODE_ENV=development webpack"}// 只能设置 node环境 下的变量NODE_ENV
 * 
 * 2. console.log('src/**.js', process.env.NODE_ENV);// 取决于webpack的mode模式
 * 优先级: 默认mode是production < config.mode < 脚本中"--mode=production"
 */


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
    // main: PATHS.entry
    ...entries(PATHS.pages)
  },
  output: {
    path: PATHS.dist,
    // 文件名：name表示变量,即入口的key值
    // filename: '[name].[hash:5].js',
    filename: '[name].js'
  },
  // 优化方案
  optimization: {
    // 开启最小化
    minimize: true,
    // 优化器
    minimizer: [
      // 原来使用的是uglify,作用是压缩js
      new TerserWebpackPlugin({
        parallel: true//开启多进程并行压缩
      }),
      new OptimizeCssAssetsWebpackPlugin({})
    ],
  },
  devServer: {
    port: 8000,// port 默认值：8080
    host: "0.0.0.0",// 默认是 localhost
    // clientLogLevel: "none",
    compress: true,// 一切服务都启用gzip 压缩
    // 提供静态文件
    contentBase: [
      PATHS.dist,
      PATHS.public
    ],
    // hot: true,// 启用 webpack 的模块热替换特性
    // hotOnly: true,// 启用热模块更换（请参阅devServer.hot服务器)如果生成失败，没有页面刷新作为回退。
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
      'bootstrap-css': PATHS.bootstrapCss,
      '@': PATHS.src
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
  /**
   * 外部模块: 不参与打包
   * 想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD
   * 或者window/global全局等方式进行使用
   * 
   * 配合html-webpack-externals-plugin插件使用,可外联配置cdn、本地文件等
   */
  externals: {
    // https://www.jq22.com/cdn/
    // const $ = require('jquery');// window.jquery
    jquery: 'jQuery',
  },
  resolveLoader: {
    // 注册loader，添加自定义loader的目录（从node_modules找不到就从指定目录查找）
    modules: ['node_modules', PATHS.loaders]
  },
  // loader是(模块内容转换)函数-参数是一个文件内容,返回处理之后的文件内容(执行顺序从后往前)
  module: {
    /**
     * module 之 noParse:
     * 使用 noParse 进行忽略的模块文件中不能使用 import 、 require 等语法
     * noParse: /title.js/, // 通过正则表达式去匹配模块
     */
    rules: [
      {
        // oneOf 仅匹配数组内的某一个规则项,匹配到一个之后不再查找其他的规则
        oneOf: [
          /**
         * 在一些性能开销较大的cache-loader之前添加此 loader ,可以以将结果缓存中磁盘中
         * 默认保存在 node_modules/.cache/cache-loader 目录下
         * NOTICE: 也可以用来js缓存,但是js已经用了babel-loader的缓存,没有必要多此一举
         */
          {
            test: /\.css$/,
            use: [
              'cache-loader',
              // 'style-loader',
              {
                // MiniCssExtractPlugin 替代 'style-loader'
                loader: MiniCssExtractPlugin.loader
              },
              'css-loader'
            ]
          },
          {
            test: /\.less$/,
            use: [
              'cache-loader',
              // 'style-loader',
              {
                // MiniCssExtractPlugin 替代 'style-loader'
                loader: MiniCssExtractPlugin.loader
              },
              'css-loader',
              'less-loader'
            ]
          },
          {
            test: /\.js$/,
            // exclude(排除) 的优先级高于 include(包含) ,尽量避免 exclude ，更倾向于使用 include
            include: PATHS.src,
            exclude: /node_modules/,
            /** 
             * 把thread-loader放置在其他 loader 之前， 放置在这个 loader 之后
             * 的 loader 就会在一个单独的worker池(worker pool)中运行
             * workers一般为cpu核数减一,即3个工作线程
             * ---  thread-loader替代了`happypack`
             * NOTICE: 当项目特别复杂才需要,不然的话开启线程池和线程之间通信花费的时间过多而得不偿失
             */
            use: [
              // {
              //   loader: 'thread-loader',
              //   options: { workers: 3 }
              // },
              // 'babel-loader',
              {
                loader: 'babel-loader',
                /**
                 * 通过 配置options.cacheDirectory为true 启动babel缓存
                 * Babel在转义js文件过程中消耗性能较高，将babel-loader执行的结果缓存起来，当重新打包构
                 * 建时会尝试读取缓存，从而提高打包构建速度、降低消耗
                 * 默认存放位置是 node_modules/.cache/babel-loader
                 * `yarn add babel-loader @babel/core @babel/preset-env -D`-- 后二者是为了搭配babel-loader解析的
                 */
                options: {
                  cacheDirectory: true,
                }
              }
            ]
          },
          {
            test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
            use: [
              'url-loader',
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    progressive: true,
                    quality: 65
                  },
                  optipng: {
                    enabled: false,
                  },
                  pngquant: {
                    quality: '65-90',
                    speed: 4
                  },
                  gifsicle: {
                    interlaced: false,
                  },
                  webp: {
                    quality: 75
                  }
                }
              }
            ]
          }
        ],// oneOf End
      }
    ]
  },
  // 插件是类class: 功能较为丰富
  plugins: [
    /**
     * 该插件将生成一个 HTML5 文件(支持生成多个-实例化多个即可)，该文件包含使用标记在正文中的所有捆绑包（包括script和link）。
     * html-webpack-插件将自动将所有必要的CSS、JS、meta和 favicon 文件注入到标记中。支持esj语法
     */
    // new HtmlWebpackPlugin({
    //   title: "webpack_optimize",// 用于生成的 HTML 文档的标题
    //   // meta: {},
    //   favicon: PATHS.ico,
    //   template: './public/index.html',// webpack模板的相对或绝对路径。支持html、hbs、ejs等等
    //   // filename: 'index.[hash:5].html',
    //   filename: 'index.html',
    //   minify: {// 最小化压缩html
    //     collapseWhitespace: true,// 去掉空格
    //     removeComments: true,// 去掉注释
    //     removeAttributeQuotes: true
    //   }
    // }),
    ...htmlPlugins(PATHS.pages, PATHS.ico),
    new FriendlyErrorsWebpackPlugin({
      onErrors: (severity, errors) => {
        const error = errors[0];
        const filename = error.file && error.file.split('!').pop();
        notifier.notify({
          title: 'webpack编译错误',
          message: severity + '：' + error.name,
          subtitle: filename|| '',
          icon: PATHS.errorIcon
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
    }),
    // new IgnorePlugin({
    //   // eg: 忽略moment下面的locale语言包; 需要时单独引入 `import 'moment/locale/zh-cn';`
    //   // requestRegExp 匹配(test)资源请求路径的正则表达式。
    //   resourceRegExp: /^\.\/locale$/,
    //   // contextRegExp （可选）匹配(test)资源上下文（目录）的正则表达式。
    //   contextRegExp: /moment$/
    // }),
    /**
     * webpack5中已经内置了模块缓存,不需要再使用此插件 - `hard-source-webpack-plugin`
     * new HardSourceWebpackPlugin(),
     */
    new OptimizeCssAssetsWebpackPlugin(),// 压缩css
    // 通过在loader处替换`style-loader`提取css
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    /**
     * css压缩
     * `**` 匹配任意字符串,包括路径分隔符
     * `*` 匹配任意字符串,不包括路径分隔符
     */
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    /**
     * 设置全局变量(不是 window ),所有模块都能读取到该变量的值
     * 可以在任意模块内通过 process.env.NODE_ENV 获取当前的环境变量
     * 但无法在 node环境 (webpack 配置文件中)下获取当前的环境变量
     * 
     * NOTICE: 定义在编译阶段使用的全局变量,但在浏览器运行阶段就只是值了
     */
    new DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify('development'),
      // 注意用双引号引起来，否则就成变量了 - 在执行阶段保证只是值,而不是变量
      // JSON.stringify('production') === "\"production\""
      'NODE_ENV': JSON.stringify('development'),
    })
  ]
};
module.exports = smw.wrap(config);
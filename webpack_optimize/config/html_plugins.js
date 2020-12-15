/**
 * 多页面输出配置
 * 与多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
 */
const glob = require("glob");
// https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

module.exports = function htmlPlugins(pages, ico) {
  let aEntryHtml = glob.sync(pages + '/*/*.html');
  let arr = [];
  aEntryHtml.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    let conf = {
      title: "webpack_optimize",// 用于生成的 HTML 文档的标题
      // meta: {},
      favicon: ico,
      // 模板来源
      template: filePath,
      // 文件名称
      // filename: 'index.[hash].html',
      // filename: 'index.[contenthash].html',
      filename: filename + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      // 排除块
      // excludeChunks: [ 'dev-helper' ],
      inject: true,
      // templateContent: `<h1>你好</h1>`,
      'meta': {
        // 'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
        // 'theme-color': '#4285f4',
        // Will generate: <meta name="theme-color" content="#4285f4">
        
        // 'Content-Security-Policy': { 'http-equiv': 'Content-Security-Policy', 'content': 'default-src https:' },
        // Will generate: <meta http-equiv="Content-Security-Policy" content="default-src https:">
        // Which equals to the following http header: `Content-Security-Policy: default-src https:`
        
        // 'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url' },
        // Will generate: <meta http-equiv="set-cookie" content="value; expires=date; path=url">
        // Which equals to the following http header: `set-cookie: value; expires=date; path=url`
      }
    };
    // console.log('config', process.env.NODE_ENV)// 是node的环境变量
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          collapseWhitespace: true,// 空格
          removeComments: true,// 注释
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeAttributeQuotes: true,// 属性的引号
          useShortDoctype: true
        },
        // chunksSortMode: 'dependency'
      })
    }
    arr.push(new HtmlWebpackPlugin(conf));
  })
  return arr;
}
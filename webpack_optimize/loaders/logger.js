/**
 * @description loader就是一个函数
 * @param {*} source 待处理资源
 * @return {*} 被处理之后的source资源
 */
const logger = (source) => {
  // 可能会被优化配置 friendly-errors-webpack-plugin 和 speed-measure-webpack5-plugin 忽略显示
  console.log('logger生效');
  return source;
}
module.exports = logger;
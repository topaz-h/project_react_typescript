const logger = (source) => {
  // 可能会被优化配置 friendly-errors-webpack-plugin 和 speed-measure-webpack5-plugin 忽略显示
  console.log('logger生效');
  return source;
}
module.exports = logger;
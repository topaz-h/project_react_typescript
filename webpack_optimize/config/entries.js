/**
 * 多入口配置
 * 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件
 * 如果该文件存在, 那么就作为入口处理
 */
const glob = require("glob");
module.exports = function entries(pages) {
  var entryFiles = glob.sync(pages + '/*/*.js');
  var map = Object.create(null);
  entryFiles.forEach((filePath) => {
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
    map[filename] = filePath;
  })
  return map;
}
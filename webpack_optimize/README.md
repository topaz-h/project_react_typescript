[toc]

# webpack 5 优化

## 一、两天的安排
### 1. webpack的优化配置和实战
1. 如何配置和启动项目
2. 如何进行数据性能分析
3. 编译时间的优化
4. 编译体积的优化
5. 如何运行的更快
> hard-source-webpack-plugin 替代dll


### 2. webpack优化的原理
2.1 tree-shaking

<br>

## 二、webpack_optimize

### 1. 项目初始化

### 2. 数据分析
#### 2.1 日志美化 - friendly-errors-webpack-plugin
#### 2.2 速度分析 - speed-measure-webpack5-plugin
#### 2.3 文件体积监控 - i webpack-bundle-analyzer

### 3. 编译时间优化

#### 3.1 缩小查找范围
##### 3.1.1 extensions - 对未加扩展名的模块确定范围
##### 3.1.2 alias - 加快webpack查找模块的速度
##### 3.1.3 modules - node_modules有一个查找机制,找不到会继续往父级目录的node_modules去查找,因此确定的第三方依赖模块都是在项目根目录下的 node_modules可减少查找时间
##### 3.1.4 mainFields
##### 3.1.5 mainFiles
##### 3.1.6 oneOf - 默认每个文件对于rules中的所有规则都会遍历一遍，用oneOf可以解决该问题，只要能匹配只要能匹配一个即可退出
##### 3.1.7 external - 不参与打包,而是通过cdn
##### 3.1.8 resolveLoader - 额外指定自定义loader的path

#### 3.2 noParse - 不解析(内部`无依赖`)的类库: 如lodash

#### 3.3 IgnorePlugin - 忽略某些特定的模块(如moment的语言包不参与打包)

#### 3.4 thread-loader(多进程) - 位于此loader之后的loader会在一个单独的worker 池(worker pool)中运行

#### 3.5 利用缓存
##### 3.5.1 babel-loader - 读缓存
Babel在转义js文件过程中消耗性能较高，将babel-loader执行的结果缓存起来，当重新打包构建
时会尝试读取缓存，从而提高打包构建速度、降低消耗
默认存放位置是 `node_modules/.cache/babel-loader`
##### 3.5.2 cache-loader
在一些性能开销较大的cache-loader之前添加此 loader ,可以以将结果缓存中磁盘中
默认保存在 `node_modules/.cache/cache-loader` 目录下
##### 3.5.3 hard-source-webpack-plugin
`HardSourceWebpackPlugin` 为 模块 提供了中间缓存,缓存默认的存放路径是`node_modules/.cache/hard-source`
配置 `hard-source-webpack-plugin` 后，首次构建时间并不会有太大的变化，但是从第二次开始，
构建时间大约可以减少 80% 左右
[webpack5]()中已经内置了模块缓存,不需要再使用此插件

### 4. 编译体积优化
#### 4.1 压缩JS、CSS、HTML和图片
optimize-css-assets-webpack-plugin是一个优化和压缩CSS资源的插件
terser-webpack-plugin是一个优化和压缩JS资源的插件
image-webpack-loader可以帮助我们对图片进行压缩和优化
#### 4.2 清除无用的CSS
purgecss-webpack-plugin单独提取CSS并清除用不到的CSS
#### 4.3 Tree Shaking
#### 4.4 Scope Hoisting

### 5. 运行速度优化
#### 5.1 代码分割
##### 5.1.1 入口点分割
##### 5.1.2 懒加载
##### 5.1.3 prefetch
##### 5.1.6 提取公共代码
#### 5.2 CDN

### 6. 开发体验
#### 6.1 HMR
#### 6.2 PWA



npx webpack --watch
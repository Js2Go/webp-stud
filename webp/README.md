0. 读取webpack.config.js
1. 解析文件依赖
2. 替换 require 为 __webpack_require__
3. 本地使用对象存储所有的文件，然后通过使用为 __webpack_require__ 获取文件内容，执行函数


<!-- @ todo
加上 loader
加上 plugin 机制 -->


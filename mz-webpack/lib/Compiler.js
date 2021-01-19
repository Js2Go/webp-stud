const path = require('path')
const fs = require('fs')
const babylon = require('babylon')
const t = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const ejs = require('ejs')
const { SyncHook } = require('tapable')

// babylon 主要就是把源码 转换成ast
// @babel/traverse
// @babel/types
// @babel/generator
class Compiler {
  constructor(config) {
    this.config = config
    // 保存入口文件的路径
    this.entryId // './src/index.js'
    // 保存所有模块的变量
    this.modules = {}
    this.entry = config.entry //入口路径
    // 工作路径
    this.root = process.cwd()
    this.hooks = {
      entryOption: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }

    // 如果传递了plugins参数
    let plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.apply(this)
      })
    }
    this.hooks.afterPlugins.call()
  }
  getSource(modulePath) {
    let content = fs.readFileSync(modulePath, 'utf-8')
    let rules = this.config.module.rules
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      let { test, use } = rule
      let len = use.length - 1
      if (test.test(modulePath)) { // 需要通过loader转换
        function normalLoader() {
          let loader = require(use[len--])
          // loader获取对应的loader实现转化功能
          content = loader(content)
          if (len >= 0) {
            normalLoader()
            // console.log(content)
          }
        }
        normalLoader()
      }
    }
    return content
  }
  // 解析源码
  parse(source, parentPath) { // AST解析语法树
    // console.log(source, parentPath)
    let ast = babylon.parse(source)
    let dependencies = []
    traverse(ast, {
      CallExpression(p) {
        let node = p.node // 拿到对应的节点
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let moduleName = node.arguments[0].value
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')
          moduleName = `./${path.join(parentPath, moduleName)}`
          dependencies.push(moduleName)
          node.arguments = [t.stringLiteral(moduleName)]
        }
      }
    })
    let sourceCode = generator(ast).code
    return { sourceCode, dependencies }
  }
  // 构建模块
  buildModule(modulePath, isEntry) {
    // 拿到模块的内容
    let source = this.getSource(modulePath)
    // 模块的id
    let moduleName = `./${path.relative(this.root, modulePath)}`
    // console.log(source)
    // console.log(moduleName)
    // 解析需要把source源码改造 返回一个依赖列表
    if (isEntry) {
      this.entryId = moduleName
    }
    let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName)) // ./src
    this.modules[moduleName] = sourceCode

    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root, dep), false)
    })
  }
  emitFile() {
    // 输出到那个目录下
    let main = path.join(this.config.output.path, this.config.output.filename)
    let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
    let code = ejs.render(templateStr, { entryId: this.entryId, modules: this.modules })
    this.assets = {}
    this.assets[main] = code
    fs.writeFileSync(main, this.assets[main])
  }
  run() {
    this.hooks.run.call()
    // 执行 并且创建模块的依赖关系
    this.hooks.compile.call()
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.hooks.afterCompile.call()
    // console.log(this.modules, this.entryId)
    // 发射一个文件 打包后的文件
    this.emitFile()
    this.hooks.emit.call()
    this.hooks.done.call()
  }
}

module.exports = Compiler
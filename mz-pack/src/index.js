#! /usr/bin/env node
const path = require('path')
const fs = require('fs')

const defaultConfig = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  }
}

const config = {...defaultConfig, ...require(path.resolve('./mz.config.js'))}

class MzPack {
  constructor(config) {
    this.config = config
    this.entry = config.entry
    // 工作目录
    this.root = process.cwd()
    this.modules = {}
  }
  generateModuleStr() {
    let fnTemp = ''
    Object.keys(this.modules).forEach(name => {
      fnTemp += `"${name}":${this.modules[name]},`
    })
    return fnTemp
  }
  generateFile() {
    let template = fs.readFileSync(path.resolve(__dirname, './template.js'), 'utf-8')
    this.template = template.replace('__entry__', this.entry)
      .replace('__modules_content__', this.generateModuleStr())
    fs.writeFileSync('./dist/'+this.config.output.filename, this.template)
    console.log('写入文件完毕')
  }
  start() {
    console.log('开始解析文件的依赖')
    const entryPath = path.resolve(this.root, this.entry)
    this.createModule(entryPath, this.entry)
    console.log(this.modules)
    this.generateFile()
  }
  parse(code, parent) {
    let deps = []
    let r = /require\('(.*)'\)/g
    // require('xx') 替换为 __webpack_require__
    code = code.replace(r, (match, arg) => {
      const retPath = path.join(parent, arg.replace(/\'|"/g), '')
      deps.push(retPath)
      return `__mzpack_require__("./${retPath}")`
    })
    return { code, deps }
    // 解析文件内容的 require
  }
  createModule(modulePath, name) {
    const fileContent = fs.readFileSync(modulePath, 'utf-8')
    // 替换后的代码和依赖数组
    const { code, deps } = this.parse(fileContent, path.dirname(name))
    console.log(code, deps)
    this.modules[name] = `function(module, exports, __mzpack_require__){
      eval(\'${code}\')
    }`
    // 循环获取所有依赖数组的内容
    deps.forEach(dep => {
      this.createModule(path.join(this.root, dep), './'+dep)
    })
    // console.log(name)
    // console.log(code)
  }
}

const mz = new MzPack(config)
mz.start()

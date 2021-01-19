#! /usr/bin/env node

// 1） 需要找到当前执行名的路径 拿到weboack.config.js
// console.log('start111')

const path = require('path')

let config = require(path.resolve('webpack.config.js'))

let Compiler = require('../lib/Compiler.js')
let compiler = new Compiler(config)
compiler.hooks.entryOption.call()

compiler.run()

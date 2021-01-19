!function(modules){
  const installModules = {}
  function __mzpack_require__(moduleId) {
    // 是否缓存
    if (installModules[moduleId]) {
      return installModules[moduleId]
    }
    let modules = installModules[moduleId] = {
      exports = {}
    }
    modules[moduleId].call(modules.exports, module, exports, __mzpack_require__)
    return module.exports
  }
  // 入口
  return __mzpack_require__('./src/index.js')
}("./src/index.js":function(module, exports, __mzpack_require__){
      eval('const sayHi = __mzpack_require__("./src/a.js")

sayHi('kaikai')
')
    },"./src/a.js":function(module, exports, __mzpack_require__){
      eval('const sayAge = __mzpack_require__("./src/common/util.js")

module.exports = name => {
  console.log('hello world', name)
  sayAge(18)
}')
    },"./src/common/util.js":function(module, exports, __mzpack_require__){
      eval('module.exports = age => {
  console.log('你今年' + age + '岁了')
}')
    },)
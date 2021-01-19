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
  return __mzpack_require__('__entry__')
}(__modules_content__)
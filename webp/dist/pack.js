(function (modules) { // webpackBootstrap
  // The module cache
  var installedModules = {};
  // The require function
  // 引入一个模块
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = installedModules[moduleId] = {
      exports: {}
    };
    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // Return the exports of the module
    return module.exports;
  }
  // Load entry module and return exports
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  ({
    "./src/a.js": (function (module, exports) {
      eval("module.exports = name => {\n  console.log('hello world', name)\n}\n\n//# sourceURL=webpack:///./src/a.js?");
    }),
    "./src/index.js": (function (module, exports, __webpack_require__) {
      eval("const sayHi = __webpack_require__(/*! ./a */ \"./src/a.js\")\n\nsayHi('kaikai')\n\n\n//# sourceURL=webpack:///./src/index.js?");
    })
  });


!function(obj) {

  {filepath: fileContent}
  console.log('自执行')
}(obj)
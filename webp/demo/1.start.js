let { SyncHook } = require('tapable')

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncHook(['name'])
    }
  }
  tap() { // 注册监听函数
    this.hooks.arch.tap('node', name => {
      console.log('node', name)
    })
    this.hooks.arch.tap('react', name => {
      console.log('react', name)
    })
  }
  start() {
    this.hooks.arch.call('mz')
  }
}

let l = new Lesson()
l.tap()
l.start() // 启动钩子

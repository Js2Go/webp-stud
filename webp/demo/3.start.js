let { SyncWaterfallHook } = require('tapable')

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncWaterfallHook(['name'])
    }
  }
  tap() { // 注册监听函数
    this.hooks.arch.tap('node', name => {
      console.log('node', name)
      return 'node学得不错'
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

let { SyncLoopHook } = require('tapable')

class Lesson {
  constructor() {
    this.index = 0
    this.hooks = {
      arch: new SyncLoopHook(['name'])
    }
  }
  tap() { // 注册监听函数
    this.hooks.arch.tap('node', name => {
      console.log('node', name)
      return ++this.index === 3 ? undefined : '继续学'
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

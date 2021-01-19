class SyncWaterfallHook { // 钩子是同步的
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tap(name, task) {
    this.tasks.push(task)
  }
  call(...args) {
    let [first, ...other] = this.tasks
    let ret = first(...args)
    other.reduce((prev, next) => {
      return next(prev)
    }, ret)
  }
}

let hook = new SyncWaterfallHook(['name'])

hook.tap('react', name => {
  console.log('react', name)
  return 'reactok'
})

hook.tap('node', name => {
  console.log('node', name)
  return 'nodeok'
})

hook.tap('webpack', name => {
  console.log('webpack', name)
  return 'webpackok'
})

hook.call('mz')

class SyncWaterfallHook { // 钩子是同步的
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tap(name, task) {
    this.tasks.push(task)
  }
  call(...args) {
    this.tasks.forEach(task => {
      let ret
      do {
        ret = task(...args)
      } while (ret != undefined)
    })
  }
}

let hook = new SyncWaterfallHook(['name'])
let total = 0

hook.tap('react', name => {
  console.log('react', name)
  return ++total === 3 ? undefined : 'reactok'
})

hook.tap('node', name => {
  console.log('node', name)
})

hook.tap('webpack', name => {
  console.log('webpack', name)
})

hook.call('mz')

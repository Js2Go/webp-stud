class AsyncSeriesHook { // 钩子是同步的
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tapAsync(name, task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    let finalCb = args.pop(), index = 0
    let next = () => {
      if (this.tasks.length === index) return finalCb()
      let task = this.tasks[index++]
      task(...args, next)
    }
    next()
  }
}

let hook = new AsyncSeriesHook(['name'])

hook.tapAsync('react', (name, cb) => {
  setTimeout(() => {
    console.log('react', name)
    cb()
  }, 1000)
})

hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    console.log('node', name)
    cb()
  }, 1000)
})

hook.callAsync('mz', () => {
  console.log('end')
})

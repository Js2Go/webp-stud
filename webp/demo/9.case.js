class AsyncSeriesWaterfallHook { // 钩子是同步的
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tapAsync(name, task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    let finalCb = args.pop(), index = 0
    let next = (err, data) => {
      let task = this.tasks[index]
      if (!task) return finalCb()
      if (index === 0) {
        task(...args, next)
      } else {
        task(data, next)
      }
      index++
    }
    next()
  }
}

let hook = new AsyncSeriesWaterfallHook(['name'])

hook.tapAsync('react', (name, cb) => {
  setTimeout(() => {
    console.log('react', name)
    cb(null, 'res')
  }, 1000)
})

hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    console.log('node', name)
    cb(null)
  }, 1000)
})

hook.callAsync('mz', () => {
  console.log('end')
})

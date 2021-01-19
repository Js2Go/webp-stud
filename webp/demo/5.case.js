class AsyncParallelHook { // 钩子是同步的
  constructor(args) { // args => ['name']
    this.tasks = []
  }
  tapAsync(name, task) {
    this.tasks.push(task)
  }
  callAsync(...args) {
    let finalCb = args.pop()
    let index = 0
    let done = () => {
      index++
      if (index === this.tasks.length) {
        finalCb()
      }
    }
    this.tasks.forEach(task => {
      task(...args, done)
    })
  }
}

let hook = new AsyncParallelHook(['name'])

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

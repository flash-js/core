export class SignalContext {
  sources = []
  targets = []
  compute = undefined
  state = {}

  constructor(init) {
    if (typeof init === 'function') {
      this.compute = init
    }
    else {
      // An absent value entry determines whether a value is set because undefined
      // is a valid value.
      this.state.value = init
    }
  }

  addSource(source) {
    if (!this.sources.includes(source)) {
      this.sources.push(source)
    }
  }

  removeSource(source) {
    const index = this.sources.indexOf(source)
    if (index !== -1) { 
      this.sources.splice(index, 1)
    }
  }

  addTarget(target) {
    if (!this.targets.includes(target)) {
      this.targets.push(target)
    }
  }

  removeTarget(target) {
    const index = this.targets.indexOf(target)
    if (index !== -1) { 
      this.targets.splice(index, 1)
    }
  }
}
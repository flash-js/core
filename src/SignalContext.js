export class SignalContext {
  compute = undefined
  state = {}

  sourceRefs = []
  targetRefs = []

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
    for (const ref of this.sourceRefs) {
      if (source === ref.deref()) return 
    }

    const ref = new WeakRef(source)
    this.sourceRefs.push(ref)
  }

  removeSource(source) {
    for (let i = 0; i < this.sourceRefs.length; ++i) {
      const ref = this.sourceRefs[i]
      if (source === ref.deref()) {
        this.sourceRefs.splice(i--, 1)
      } 
    }
  }

  addTarget(target) {
    for (const ref of this.targetRefs) {
      if (target === ref.deref()) return 
    }

    const ref = new WeakRef(target)
    this.targetRefs.push(ref)
  }

  removeTarget(target) {
    for (let i = 0; i < this.targetRefs.length; ++i) {
      const ref = this.targetRefs[i]
      if (target === ref.deref()) {
        this.targetRefs.splice(i--, 1)
      } 
    }
  }
}
export class SignalContext {
  compute = undefined
  state = {}

  sourceRefs = []
  sourceIndices = new WeakMap()
  targetRefs = []
  targetIndices = new WeakMap()

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
    if (this.sourceIndices.get(source) == null) {
      this.sourceIndices.set(source, this.sourceRefs.length)
      const ref = new WeakRef(source)
      this.sourceRefs.push(ref)
    }
  }

  removeSource(source) {
    const index = this.sourceIndices.get(source)
    if (index !== -1) { 
      this.sourceRefs.splice(index, 1)
      this.sourceIndices.delete(source)
    }
  }

  addTarget(target) {
    if (this.targetIndices.get(target) == null) {
      this.targetIndices.set(target, this.targetRefs.length)
      const ref = new WeakRef(target)
      this.targetRefs.push(ref)
    }
  }

  removeTarget(target) {
    const index = this.targetIndices.get(target)
    if (index !== -1) { 
      this.targetRefs.splice(index, 1)
      this.targetIndices.delete(target)
    }
  }
}
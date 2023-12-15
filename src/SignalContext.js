import { StrongRef, WeakRef } from './ref.js'

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

  disconnect() {
    this.disconnectSources()
    this.disconnectTargets()
  }

  disconnectSources() {
    for (const sourceRef of this.sourceRefs) {
      const source = sourceRef.deref()
      if (source == null) continue
      source.unsourceFor(this)
    }
  }

  disconnectTargets() {
    for (const targetRef of this.targetRefs) {
      const target = targetRef.deref()
      if (target == null) continue
      target.untargetFor(this)
    }
  }

  sourceFor(target) {
    this.addTarget(target)
    target.addSource(this)
  }

  targetFor(source) {
    this.addSource(source)
    source.addTarget(this)
  }

  unsourceFor(target) {
    this.removeTarget(target)
    target.removeSource(this)
  }

  untargetFor(source) {
    this.removeSource(source)
    target.removeSource(this)
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

    const ref = new StrongRef(target)
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
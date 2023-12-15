export class StrongRef{
  [Symbol.toStringTag] = "StrongRef"

  constructor(key) {
    this.key = key
  }

  deref() {
    return this.key
  }

}

// Shim WeakRef as a StrongRef
const WeakRefSafe = typeof WeakRef === undefined ? StrongRef : WeakRef

export { WeakRefSafe as WeakRef }
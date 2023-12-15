
export class StrongRef<T extends WeakKey>{
  [Symbol.toStringTag]: "StrongRef" = "StrongRef"
  key: T

  constructor(key: T) {
    this.key = key
  }

  deref(): T | undefined {
    return this.key
  }

}

// Shim WeakRef as a StrongRef
const WeakRefSafe = typeof WeakRef === undefined ? StrongRef : WeakRef

export { WeakRefSafe as WeakRef }
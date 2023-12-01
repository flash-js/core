import { ComputeFn } from "."

export declare class SignalContext<Init extends ComputeFn<T, Args> | T, T = Exclude<any, Function>, Args extends any[] = any[]> {
  compute: Init extends Function ? ComputeFn<T, Args> : undefined
  state: {
    value?: T
  }

  sourceRefs: WeakRef<any>[]
  sourceIndices: WeakMap<SignalContext<any>, number>
  targetRefs: WeakRef<any>[] 
  targetIndices: WeakMap<SignalContext<any>, number>

  constructor(init: Init) 

  addSource(source: SignalContext<any>): void 
  removeSource(source: SignalContext<any>): void 

  addTarget(target: SignalContext<any>): void 
  removeTarget(target: SignalContext<any>): void
}

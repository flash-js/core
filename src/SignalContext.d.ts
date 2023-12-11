import { ComputeFn } from "./flash"

export declare class SignalContext<Init extends ComputeFn<T, Args> | T, T = Exclude<any, Function>, Args extends any[] = any[]> {
  compute: Init extends Function ? ComputeFn<T, Args> : undefined
  state: {
    value?: T
  }

  sourceRefs: WeakRef<any>[]

  targetRefs: WeakRef<any>[] 

  constructor(init: Init) 

  disconnect(): void 

  sourceFor(target: SignalContext<any>): void 

  addSource(source: SignalContext<any>): void 
  removeSource(source: SignalContext<any>): void 

  addTarget(target: SignalContext<any>): void 
  removeTarget(target: SignalContext<any>): void
}

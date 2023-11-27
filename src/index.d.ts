export type SignalComputation<T, Args extends any[]> = (...args: [...Args]) => T

export interface StaticSignal<T>{
   (): T 
   (...value: T[]): StaticSignal<T> 
}
export interface ComputedSignal<T, Args extends any[] = any[] >{
   (): T 
   (...args: [...Args]): ComputedSignal<T>
}

export declare function on<T, Args extends any[] = any[] >(compute: SignalComputation<T, Args>): ComputedSignal<T, Args>
export declare function on<T>(initialValue?: T): StaticSignal<T>;
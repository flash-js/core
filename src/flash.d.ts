export * from './SignalContext'

export interface StaticSignal<T>{
   (): T 
   (...value: T[]): T 
   off(): void
   peak(): T
}
export interface ComputedSignal<T, Args extends any[] = any[] >{
   (): T 
   (...args: [...Args]): T
   off(): void
   peak(): T
}

export type ComputeFn<T, Args extends any[]> = (...args: [...Args]) => T

export declare function on<T, Args extends any[] = any[] >(compute: ComputeFn<T, Args>): ComputedSignal<T, Args>
export declare function on<T>(initialValue?: T): StaticSignal<T>

export declare function self<T>(initialValue: T): T;
export declare function self<T>(): T | undefined;

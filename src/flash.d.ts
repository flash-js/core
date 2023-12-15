export * from './SignalContext'

export interface Signal<T, Args extends any[] = [T] >{
   (): T 
   (...args: [...Args]): T
   off(): void
   on(): boolean
   peak(): T
}

export type ComputeFn<T, Args extends any[]> = (...args: [...Args]) => T

export declare function on<T, Args extends any[] = any[] >(compute: ComputeFn<T, Args>): Signal<T, Args>
export declare function on<T>(initialValue?: T): Signal<T>

export declare function self<T>(initialValue: T): T;
export declare function self<T>(): T | undefined;

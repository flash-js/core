export interface StaticSignal<T>{
   (): T 
   (...value: T[]): StaticSignal<T> 
}
export interface ComputedSignal<T, Args extends any[] = any[] >{
   (): T 
   (...args: [...Args]): ComputedSignal<T>
}

export type ComputeFn<T, Args extends any[]> = (...args: [...Args]) => T

export declare function on<T, Args extends any[] = any[] >(compute: ComputeFn<T, Args>): ComputedSignal<T, Args>
export declare function on<T>(initialValue?: T): StaticSignal<T>

export declare function self<T>(initialValue: T): T;
export declare function self<T>(): T | undefined;

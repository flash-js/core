export type SignalInitializer<T, Args extends any[] = any[] > = T | ((...args: [...Args]) => T)

export interface Signal<T>{
   (): T 
   (...args: any[]): Signal<T>
}

export declare function on<T>(init: SignalInitializer<T>): Signal<T>
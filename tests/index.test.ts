import { describe, expect, test } from "bun:test";
import { on } from "../src";

describe('A root signal', () => {
  test("should have a value", () => {
    const signal = on(1)
    expect(signal()).toBe(1)
  })

  test("should have an updatable value", () => {
    const signal = on(1)
    signal(2)
    expect(signal()).toBe(2)
  })

  test("should update it's value over many params", () => {
    const signal = on(1)
    signal(2, 3)
    expect(signal()).toBe(3)
  })
})

describe('A computed signal', () => {
  test("should compute its value", () => {
    const square = on((value) => value**2)
    square(2)
    expect(square()).toBe(4)
  })
  
  test("should compute its value over many params", () => {
    const sum = on((...values) => values.reduce((sum, value) => sum + value, 0))
    sum(1, 2, 3)
    expect(sum()).toBe(6)
  })

  test("should compute from signal with initial values", () => {
    const num = on(1)
    const square = on((a, b) => a + b + num())
    square(100, 10)
    expect(square()).toBe(111)
  })

  test("should compute from signal upstream", () => {
    const num = on(2)
    const square = on(() => num() ** 2)
    expect(square()).toBe(4)
  })
})

describe('Reactive signals', () => {
  test("should recompute from new signal upstream", () => {
    const lever = on(true)
    const left = on('LEFT')
    const right = on('RIGHT')
    const signal = on(() => lever() ? left() : right())
    
    expect(signal()).toBe('LEFT')

    left('left')
    expect(signal()).toBe('left')
    right('right')
    expect(signal()).toBe('left')

    lever(false)
    expect(signal()).toBe('right')

    left('LEFT')
    expect(signal()).toBe('right')
    right('RIGHT')
    expect(signal()).toBe('RIGHT')
  })

  test("should react to signal upstream", () => {
    const num = on(0)
    const square = on(() => num() ** 2)
    num(2)
    expect(square()).toBe(4)
  })

  test("should react to signal upstream with previous value", () => {
    const num = on(0)
    const sum = on((prev) => prev + num())
    sum(0)
    expect(sum()).toBe(0)
    num(1)
    expect(sum()).toBe(1)
    num(2)
    expect(sum()).toBe(3)
    num(5)
    expect(sum()).toBe(8)
  })


  test("should react to signals upstream", () => {
    const name = on('')
    const message = on(() => `Hello, ${name()}`)

    name('Bob')
    expect(message()).toBe(`Hello, Bob`)
    name('World')
    expect(message()).toBe(`Hello, World`)
  })
})

describe('Effects', () => {
  test("should respond to signal changes", () => {
    const log: number[] = []
    const count = on(0)
    const effect = on(() => {
      log.push(count())
    })

    // Activate the effect
    effect()

    count(1)(2)(3)

    expect(log).toEqual([0, 1, 2, 3])
  })

  test("should respond to deeper signal changes", () => {
    const log: number[] = []
    const count = on(0)
    const square = on(() => {
      const out = count() ** 2
      return out
    })
    const effect = on(() => {
      log.push(square())
    })

    // Activate the effect
    effect()

    count(1)(2)(3)

    expect(log).toEqual([0, 1, 4, 9])
  })
})
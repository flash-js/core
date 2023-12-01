import { describe, expect, test } from "bun:test";
import { on } from "../src/flash";

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

  test("should react to signals upstream", () => {
    const name = on<string>()
    const message = on(() => `Hello, ${name()}`)

    name('Bob')
    expect(message()).toBe(`Hello, Bob`)
    name('World')
    expect(message()).toBe(`Hello, World`)
  })

  test("should not react when using peak", () => {
    const source = on(0)
    const target = on(() => source.peak())

    target()

    expect(target()).toBe(0)

    source(1)
    expect(target()).toBe(0)
  })
})

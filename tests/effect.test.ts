import { describe, expect, test } from "bun:test";
import { on } from "../src/flash";

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

  test("multiple effects per source", () => {
    const externalState: number[] = []
    const source = on(0)
    const effectA = on(function effectA() {
      externalState[0] = source()
    })
    const effectB = on(function effectB() {
      externalState[1] = source()
    })
    const effectC = on(function effectA() {
      externalState[2] = source()
    })
    const effectD = on(function effectB() {
      externalState[3] = source()
    })

    effectA()
    effectB()
    effectC()
    effectD()

    expect(externalState).toEqual([0, 0, 0, 0])
    source(1)
    expect(externalState).toEqual([1, 1, 1, 1])
    source(2)
    expect(externalState).toEqual([2, 2, 2, 2])
  })

  test("should be able to be turned off", () => {
    let externalState = 0
    const event = on(0)
    const effect = on(() => {
      externalState = event()
    })
    effect()

    expect(externalState).toBe(0)
    event(1)
    expect(externalState).toBe(1)
    effect.off()
    event(2)
    expect(externalState).toBe(1)
  })

  test("Calling off() should not impact other targets", () => {
    let externalState: number[] = [] 
    const source = on(0)
    const effectA = on(() => {
      externalState[0] = source()

    })
    const effectB = on(() => {
      externalState[1] = source()
    })
    const effectC = on(function effectA() {
      externalState[2] = source()
    })
    const effectD = on(function effectB() {
      externalState[3] = source()
    })

    effectA()
    effectB()
    effectC()
    effectD()

    expect(externalState).toEqual([0, 0, 0, 0])

    source(1)
    expect(externalState).toEqual([1, 1, 1, 1])

    effectB.off()

    source(2)
    expect(externalState).toEqual([2, 1, 2, 2])

    effectA.off()

    source(3)
    expect(externalState).toEqual([2, 1, 3, 3])

    effectD.off()

    source(4)
    expect(externalState).toEqual([2, 1, 4, 3])
  })
})

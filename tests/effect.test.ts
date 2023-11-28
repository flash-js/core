import { describe, expect, test } from "bun:test";
import { on } from "../src";

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
})
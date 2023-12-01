import { describe, expect, test } from "bun:test";
import { on } from "../src/flash";

describe('Static Signals', () => {
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

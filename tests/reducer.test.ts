import { describe, expect, test } from "bun:test";
import { on, self } from "../src/flash";

describe('Reducers Signals', () => {
  test("should react to signal upstream with previous value", () => {
    const num = on(0)
    const sum = on((prev = self(0)) => prev + num())
    expect(sum()).toBe(0)
    num(1)
    expect(sum()).toBe(1)
    num(2)
    expect(sum()).toBe(3)
    num(5)
    expect(sum()).toBe(8)
  })
})
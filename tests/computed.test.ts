import { describe, expect, test } from "bun:test";
import { on } from "../src/flash";

describe('A computed signal', () => {
  test("should compute its value", () => {
    const square = on((value: number) => value**2)
    square(2)
    expect(square()).toBe(4)
  })
  
  test("should compute its value over many params", () => {
    const sum = on((...values: number[]) => values.reduce((sum, value) => sum + value, 0))
    sum(1, 2, 3)
    expect(sum()).toBe(6)
  })

  test("should compute from signal with initial values", () => {
    const num = on(1)
    const square = on((a: number, b: number) => a + b + num())
    square(100, 10)
    expect(square()).toBe(111)
  })

  test("should compute from signal upstream", () => {
    const num = on(2)
    const square = on(() => num() ** 2)
    expect(square()).toBe(4)
  })
})

import { describe, expect, test } from "bun:test";
import { on, own } from "../src/flash";

describe('Reducers Signals', () => {
  test("should react to signal upstream with previous value", () => {
    const num = on(0)
    const sum = on((prev = own(0)) => prev + num())
    expect(sum()).toBe(0)
    num(1)
    expect(sum()).toBe(1)
    num(2)
    expect(sum()).toBe(3)
    num(5)
    expect(sum()).toBe(8)
  })

  test("reduces over many", () => {
    const a = on(0)
    const b = on(0)
    const reduced = on((state: 'a' | 'b' | undefined = own()) => {
      if (a.on()) {
        state = 'a' as const
      }
      if (b.on()) {
        state = 'b' as const
      }
      return state
    })

    expect(reduced()).toBeUndefined()

    a(1)
    expect(reduced()).toBe('a')

    b(1)
    expect(reduced()).toBe('b')
    
    a(2)
    expect(reduced()).toBe('a')
  })
})
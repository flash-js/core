
import { describe, expect, test } from "bun:test";
import { SignalContext } from '../src/SignalContext.js'

describe('SignalContext', () => {
  test('static contexts have state', () => {
    const context = new SignalContext(0)
    expect(context.state).toEqual({ value: 0 })
    expect(context.compute).toBe(undefined)
  })

  test('computed contexts have computed state', () => {
    const context = new SignalContext(() => 2)
    expect(context.state).toEqual({})
    expect(context.compute()).toBe(2)
  })

  test('can add/remove sources', () => {
    const sourceA = new SignalContext(0)
    const sourceB = new SignalContext(0)

    const context = new SignalContext(0)

    expect(context.sourceRefs.length).toBe(0)
    
    context.addSource(sourceA)
    expect(context.sourceRefs.length).toBe(1)
    expect(context.sourceRefs[0].deref()).toBe(sourceA)

    context.addSource(sourceB)
    expect(context.sourceRefs.length).toBe(2)
    expect(context.sourceRefs[0].deref()).toBe(sourceA)
    expect(context.sourceRefs[1].deref()).toBe(sourceB)

    context.removeSource(sourceA)
    expect(context.sourceRefs.length).toBe(1)
    expect(context.sourceRefs[0].deref()).toBe(sourceB)

    context.removeSource(sourceB)
    expect(context.sourceRefs.length).toBe(0)
  })

  test('can add/remove targets', () => {
    const targetA = new SignalContext(0)
    const targetB = new SignalContext(0)

    const context = new SignalContext(0)

    expect(context.targetRefs.length).toBe(0)
    
    context.addTarget(targetA)
    expect(context.targetRefs.length).toBe(1)
    expect(context.targetRefs[0].deref()).toBe(targetA)

    context.addTarget(targetB)
    expect(context.targetRefs.length).toBe(2)
    expect(context.targetRefs[0].deref()).toBe(targetA)
    expect(context.targetRefs[1].deref()).toBe(targetB)

    context.removeTarget(targetA)
    expect(context.targetRefs.length).toBe(1)
    expect(context.targetRefs[0].deref()).toBe(targetB)

    context.removeTarget(targetB)
    expect(context.targetRefs.length).toBe(0)
  })
})
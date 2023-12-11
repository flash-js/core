import { SignalContext } from "./SignalContext"

let CURRENT_SIGNAL_CONTEXT = null

export const on = (init) => {
  const context = new SignalContext(init)

  const signal = (...params) => {
    // Get signal state
    if (params.length === 0) {
      // Initialize computed signal
      if (!('value' in context.state) && context.compute != null) {
        executeSignalContext(context, params)
      }
      // Register context as a source to the current execution context
      if (CURRENT_SIGNAL_CONTEXT != null) {
        context.sourceFor(CURRENT_SIGNAL_CONTEXT)
      }
      // Return signal value
      return context.state.value
    }
    // Static signal
    if (context.compute == null) {
      for (const param of params) {
        context.state.value = param
        // Invoke all target signals
        executeSignalContextTargets(context)
      }
    }
    // Computed signal
    else {
      executeSignalContext(context, params)
    }
    // Always return signal
    return context.state.value
  }

  signal.off = () => {
    context.disconnect()
  }

  signal.peak = () => {
    return context.state.value
  }

  // Initialize signal
  signal()

  return signal
}

export const self = (initialValue) => {
  return CURRENT_SIGNAL_CONTEXT.state.value ?? initialValue
}

/**
 * Computes a signal context's value using it's compute function and caches 
 * the value in the context state.
 * 
 * It removes itself from it's current signal graph (targets/sources) before 
 * computing, and sets the SIGNAL_EXECUTION_CONTEXT to the current signal 
 * in order to re-instate it into the a signal graph during compute. 
 * 
 * @param {SignalContext} context – A signal context to execute
 * @param  {any[]} params – Parameters to pass to the signal's compute
 */
const executeSignalContext = (context, params = []) => {
  // Unsubscribe from existing upstream signals
  context.disconnectSources()
  // Cache signal current context
  const previousSignalContext = CURRENT_SIGNAL_CONTEXT
  // Set signal context
  CURRENT_SIGNAL_CONTEXT = context
  // Compute new state
  context.state.value = context.compute(...params)
  // Reset signal context to cache
  CURRENT_SIGNAL_CONTEXT = previousSignalContext 
  // Invoke all target signals
  executeSignalContextTargets(context)
}

const executeSignalContextTargets = (context) => {
  // Allocate all targets into a duplicate array because targetRefs will be
  // mutated in place during execution:
  const targets = []
  for (let i = 0; i < context.targetRefs.length; ++i) {
    const ref = context.targetRefs[i]
    const target = ref.deref()
    if (target == null) {
      context.targetRefs.splice(i--, 1)
      continue
    }
    targets.push(target)
  }

  // Execute all targets:
  for (const target of targets) {
    executeSignalContext(target)
  }
}
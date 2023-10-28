import { SignalContext } from "./SignalContext"

let trackers = []

let CURRENT_SIGNAL_CONTEXT = null

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
  context.sources.forEach(sourceContext => {
    context.removeSource(sourceContext)
    sourceContext.removeTarget(context)
  })
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
  context.targets.forEach(target => executeSignalContext(target, [target.state.value]))
}

const registerSourceToCurrentSignalContext = (context) => {
  if (CURRENT_SIGNAL_CONTEXT != null) {
    context.addTarget(CURRENT_SIGNAL_CONTEXT)
    CURRENT_SIGNAL_CONTEXT.addSource(context)
  }
}

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
      registerSourceToCurrentSignalContext(context)
      // Return signal value
      return context.state.value
    }
    // Root signal
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
    return signal
  }

  signal.peak = () => {
    return context.state.value
  }

  return signal
}

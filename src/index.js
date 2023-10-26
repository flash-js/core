let trackers = []

let SIGNAL_EXECUTION_CONTEXT = null

export const on = (init) => {
  const state = typeof init === 'function' ? { compute: init } : { value: init }
  // TODO: Move all source/target data to the execution context along with the
  // methods to add/remove. Include the value and compute method in the context
  // as well. We can then insert the signal's execution context into the global
  // constant (SIGNAL_EXECUTION_CONTEXT) instead of the signal itself.
  // During computation of each signal, we'll have all the methods necessary
  // to install the context into a context dependency graph. This way the signal
  // remains as a public interface, while the internal execution context remains
  // private and separate from the signal's public API. The context will be a
  // internal interface which the signal's methods have privileged access to.
  // Debugging info can be tracked within the context graph, and other APIs can
  // expose this debugging information (including error stack traces).
  const executionContext = {
    sourceSignals: [],
    targetSignals: [],
  }
  const sourceSignals = []
  const targetSignals = []

  /**
   * Evaluates the signal's value based on it's compute function.
   * 
   * It removes itself from it's current signal graph (targets/sources) before 
   * computing, and sets the SIGNAL_EXECUTION_CONTEXT to the current signal 
   * in order to re-instate it into the a signal graph during compute. 
   * 
   * @param  {any[]} params parameters to pass to the signal's compute
   */
  const execute = (params = []) => {
    // Unsubscribe from existing upstream signals
    sourceSignals.forEach(source => {
      signal.removeSource(source)
      source.removeTarget(signal)
    })
    // Cache execution context
    const previousExecutingSignal = SIGNAL_EXECUTION_CONTEXT
    // Set execution context
    SIGNAL_EXECUTION_CONTEXT = signal
    // Compute new state
    state.value = state.compute(...params)
    // Reset execution context to cache
    SIGNAL_EXECUTION_CONTEXT = previousExecutingSignal 
    // Invoke all target signals
    targetSignals.forEach(target => target(target.peak()))
  }

  const signal = (...params) => {
    // Get signal state
    if (params.length === 0) {
      if (SIGNAL_EXECUTION_CONTEXT != null) {
        signal.addTarget(SIGNAL_EXECUTION_CONTEXT)
        SIGNAL_EXECUTION_CONTEXT.addSource(signal)
      }
      if (!('value' in state) && state.compute != null) {
        execute(params)
      }
      return state.value
    }
    // Root signal
    if (state.compute == null) {
      for (const param of params) {
        state.value = param
        // Invoke all target signals
        targetSignals.forEach(target => target(target.peak()))
      }
    }
    // Computed signal
    else {
      execute(params)
    }
    // Always return signal
    return signal
  }

  signal.addSource = (source) => {
    if (!sourceSignals.includes(source)) {
      sourceSignals.push(source)
    }
    return signal
  }
  signal.removeSource = (source) => {
    const index = sourceSignals.indexOf(source)
    if (index !== -1) { 
      sourceSignals.splice(index, 1)
    }
  }

  signal.addTarget = (target) => {
    if (!targetSignals.includes(target)) {
      targetSignals.push(target)
    }
    return signal
  }

  signal.removeTarget = (target) => {
    const index = targetSignals.indexOf(target)
    if (index !== -1) { 
      targetSignals.splice(index, 1)
    }
  }

  signal.peak = () => {
    return state.value
  }


  return signal
}

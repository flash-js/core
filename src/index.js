let trackers = []

let SIGNAL_EXECUTION_CONTEXT = null

/**
 * Evaluates the signal's value based on it's compute function.
 * 
 * It removes itself from it's current signal graph (targets/sources) before 
 * computing, and sets the SIGNAL_EXECUTION_CONTEXT to the current signal 
 * in order to re-instate it into the a signal graph during compute. 
 * 
 * @param {SignalExecutionContext} context – A signal context to execute
 * @param  {any[]} params – Parameters to pass to the signal's compute
 */
const execute = (context, params = []) => {
  // Unsubscribe from existing upstream signals
  context.sources.forEach(sourceContext => {
    context.removeSource(sourceContext)
    sourceContext.removeTarget(context)
  })
  // Cache execution context
  const previousExecutingSignal = SIGNAL_EXECUTION_CONTEXT
  // Set execution context
  SIGNAL_EXECUTION_CONTEXT = context
  // Compute new state
  context.value = context.compute(...params)
  // Reset execution context to cache
  SIGNAL_EXECUTION_CONTEXT = previousExecutingSignal 
  // Invoke all target signals
  context.targets.forEach(target => execute(target, [target.value]))
}

export const on = (init) => {
  const context = {
    sources: [],
    targets: [],
    compute: typeof init === 'function' ? init : undefined,
    // An absent value entry determines whether a value is set because undefined
    // is a valid value.
    ...(typeof init === 'function' ? {} : { value: init }),
    addSource(source) {
      if (!this.sources.includes(source)) {
        this.sources.push(source)
      }
      return signal
    },
    removeSource(source) {
      const index = this.sources.indexOf(source)
      if (index !== -1) { 
        this.sources.splice(index, 1)
      }
    },
    addTarget(target) {
      if (!this.targets.includes(target)) {
        this.targets.push(target)
      }
      return signal
    },
    removeTarget(target) {
      const index = this.targets.indexOf(target)
      if (index !== -1) { 
        this.targets.splice(index, 1)
      }
    }
  }

  const signal = (...params) => {
    // Get signal state
    if (params.length === 0) {
      if (SIGNAL_EXECUTION_CONTEXT != null) {
        context.addTarget(SIGNAL_EXECUTION_CONTEXT)
        SIGNAL_EXECUTION_CONTEXT.addSource(context)
      }
      if (!('value' in context) && context.compute != null) {
        execute(context, params)
      }
      return context.value
    }
    // Root signal
    if (context.compute == null) {
      for (const param of params) {
        context.value = param
        // Invoke all target signals
        context.targets.forEach(target => execute(target, [target.value]))
      }
    }
    // Computed signal
    else {
      execute(context, params)
    }
    // Always return signal
    return signal
  }

  signal.peak = () => {
    return context.value
  }

  return signal
}

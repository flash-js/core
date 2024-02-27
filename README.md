<p align="center">
  <img alt="Flash Logo" src="./assets/logo.png" />
</p>
<p align="center">Functional-reactive state management.</p>

---

# Flash

Flash is a JavaScript library for managing state using functional signals.

- **Real Reactivity:** Flash introduces the simplest implementation of a signals. A signal is just a function which can react to other functions. This gives you a declarative-style to state management and leaving you with less control-flow overhead.
- **Minimal API:** Flash accomplishes so much with so little. It exports a few functions, and encourages you to extend the API with your own custom "circuits".
- **Pure JavaScript:** No need to compile or build. Flash is written in vanilla JS, and should work out of the box in modern run-times.

## Index

- [Installation](#install)
- [Quick Start](#quick-start)
- [Contributing](#contributing)

## <a name="install"></a>Installation


The Flash core library is available as a package on NPM for use with a module bundler or in a Node application:


```sh
# NPM
npm install @flash.js/core

# Yarn
yarn add @flash.js/core
```

## <a name="quick-start"></a>Quick Start

Flash state is stored in _signals_. Signals are just functions which react to other functions being invoked. This allows for a FRP (functional-reactive programming) approach to programming and state management.

Flash's API is very minimal, yet gives you all the tools you need to develop and manage complex state for you application. We'll be going over each exported function from the library.

### Static Signals 

The `on` function creates/returns signals.

```js
import { on } from '@flash.js/core'

const name = on()
```

This creates a new signal called `name` with an undefined value.

The signal is a function. We can update the signal's value by invoking it:

```js
name('Barry')
```

We can access the signal's value by invoking it with no parameters:

```js
name() // Returns 'Barry'
```

### Computed Signals

A signal can be defined with a compute function:

```js
const message = on(() => `Hello ${name()}`)
```

This compute function will invoke immediately and it's return value is the value
of the signal:

```js
message() // 'Hello Barry'
```

This signal depends on the `name` signal. We call this dependency a source signal for `message`. When `name` changes its value, the `message` signal will re-compute:

```js
name('Allen')
message() // Hello Allen
```

This is the reactivity part of our state management.

### Effects

A signal may be used solely to produce side-effects:

```js
on(() => {
  console.log(message())
})
```

We call these signals "effect signals". In this example, we're printing `message` to the console whenever it is updated.

We may want to destroy a effect, for that we have a cleanup method:

```js
const logMessageEffect = on(() => {
  console.log(message())
})

// Later we can cleanup/disable the effect:
logMessageEffect.off()
```

The `off` method is not limited to effects; it can be used to disable any signal.

### Reducers

A computed signal can reduce over other signals by referencing itself, or it's current value using `own`:

```js
import { on, own } from '@flash.js/core'

// Define a source signal:
const num = on(0)

// Create our reducer:
const sum = on((accumulator = own(0)) => accumulator + num())

// Update num:
num(1)
num(2)
num(3)

// Sum should be the sum of 1 + 2 + 3 = 6:
sum() // Returns 6
```

The `own` function returns the signal's current value from within the compute function. It can be passed an optional default value for the first invocation of the signal's compute function.

### Caching

A computed signal will not cache a value in memory because it can be derived by it's compute function. We call these kinds of signals "dynamic" signals as apposed to "static" signals. 

```js
const static = on(23)

// Returns the cached value, 23;
static()

const computed = on(() => 123)

// Invokes and returns the compute function's return value, 23:
computed() 
```

However, a computed signal can by a static signal and cache its value when it implements `own`:

```js
const computed = on((value = own(23)) => value)

// Returns the cache return value, 23:
computed()
```

This means reducers have a memory foot-print because they leverage `own`. This makes since because we need to hold a value in memory to reduce over it on each iteration of the computed value over time.

## <a name="contributing"></a>Contributing

Contributing guide is coming soon.
### License

Flash is <a href="./LICENSE">MIT licensed</a>
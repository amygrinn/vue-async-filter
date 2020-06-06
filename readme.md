# Vue Async Filter

[![Build Status](https://travis-ci.org/tylergrinn/vue-async-filter.svg?branch=master)](https://travis-ci.org/tylergrinn/vue-async-filter)

This mixin allows you to use promises and observables in your vue templates. This is meant to emulate angular's async pipe.

## [DEMO](http://vue-async-filter.surge.sh)

## Installation

```
yarn add -D @tygr/vue-async-filter
```
Or
```
npm install --save-dev @tygr/vue-async-filter
```

It's recommended that you include it on a per-component basis:

```js
import { AsyncFilterMixin } from '@tygr/vue-async-filter'

export default {
  mixins: [AsyncFilterMixin]
}
```

You may also register the mixin globally:

```js
import Vue from 'vue'

import { AsyncFilterMixin } from '@tygr/vue-async-filter'


Vue.mixin(AsyncFilterMixin)
```

## Usage

The async filter requires a unique 'key' parameter
  - keys are scoped to the component
  - This is to prevent duplication on rerender, since all filters are re-evaluated each time the component renders

The async filter returns null while waiting for the first value. You can use the `||` operator to pass in a fallback value

Filters can only be used in mustache syntax currently. If you wish to use asynchronous data in a directive, use the $async function
  - First parameter is the asynchronous datum, the second parameter is the key

All observables are unsubscribed from in the `beforeDestroy` hook of the vue component they are used in.

```html
<template>
  <div>
    <h1>{{ interval | async('interval') }}</h1>
    <h1>{{ getTimeoutPromise('Promise has resolved') | async('timeout-promise') || 'loading...' }}</h1>
    <h1 v-for="factor in $async(factors, 'factors')">
      {{ getIntervalWithFactor(factor) | async('interval-factor-' + factor) }}
    </h1>
  </div>
</template>
```
```js
import { interval } from 'rxjs'
import { map } from 'rxjs/operators'

import { AsyncFilterMixin } from '@tygr/vue-async-filter'

export default {
  mixins: [AsyncFilterMixin],
  data: () => ({
    interval: interval(1000),
    factors: new Promise(resolve => setTimeout(
      () => resolve([6, 7, 8, 9]),
      2000
    ))
  }),
  methods: {
    getIntervalWithFactor(factor) {
      return this.interval.pipe(
        map(val => factor * val)
      )
    },
    getTimeoutPromise(msg) {
      return new Promise(resolve => {
        setTimeout(
          () => resolve(msg),
          2000
        )
      })
    }
  }
}
```

## Benefits over [vue-rx](https://github.com/vuejs/vue-rx)

* Support for promises
* Runtime creation of observables
  - [vue-rx](https://github.com/vuejs/vue-rx) forces you to declare all observables at compile time. With the async filter, you can use functions that return an observable or promise. This is useful in v-for loops.
* Smaller build (based on [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer))
  - [vue-rx](https://github.com/vuejs/vue-rx): 3.06 KB gzipped
  - `@tygr/vue-async-filter`: 511 B gzipped

## Detriments

* No vue-dev-tools support (yet)

## Development

```
yarn build
```

The 'vue' package in the root node_modules cannot be linked to the test project, so instead you must install the tarball that is created by `yarn build` manually:

```
cd test
yarn remove @tygr/vue-async-filter
yarn cache clean
yarn add -D ../tygr-vue-async-filter-v0.0.1-beta.tgz
```

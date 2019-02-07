import Vue, { VueConstructor, ComponentOptions } from 'vue'

import { Observable } from 'rxjs/internal/Observable'
import { Subscription } from 'rxjs/internal/Subscription'

declare module 'vue/types/vue' {
  interface Vue {
    _observers: object
    _subscription: Subscription
  }
}

declare module 'vue' {
  interface VueConstructor {
    util: {
      defineReactive: (
        obj: object,
        key: string,
        val: any,
        customSetter?: (val: any) => void,
        shallow?: boolean,
      ) => void,
    }
  }
}

const addAsyncDatum = (asyncDatum: Observable<any> | Promise<any>, key: string, vm: Vue) => {
  if (!key) {
    throw new Error(`Async filter requires a 'key' string parameter, none supplied`)
  }

  if (vm._observers[key] === undefined) {
    Vue.util.defineReactive(vm._observers, key, null)

    if (asyncDatum instanceof Promise) {
      asyncDatum.then(val => vm._observers[key] = val)
    } else if (asyncDatum.subscribe !== undefined) {
      vm._subscription.add(
        asyncDatum.subscribe(val => vm._observers[key] = val),
      )
    } else {
      throw new Error(`Async filter: Datum with key '${key}' is not a promise or an observable`)
    }
  }

  return vm._observers[key]
}

export const AsyncFilterMixin: VueConstructor | ComponentOptions<Vue> = {
  beforeCreate() {
    if (!this.$options.filters) {
      this.$options.filters = {}
    }

    this._observers = {}
    this._subscription = new Subscription()

    this.$options.filters.async = (asyncDatum: Observable<any> | Promise<any>, key: string) => {
      return addAsyncDatum(asyncDatum, key, this)
    }
  },
  methods: {
    $async(asyncDatum: Observable<any> | Promise<any>, key: string) {
      return addAsyncDatum(asyncDatum, key, this)
    },
  },
  beforeDestroy() {
    this._subscription.unsubscribe()
  },
}

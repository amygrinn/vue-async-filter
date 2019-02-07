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

export const AsyncFilterMixin: VueConstructor | ComponentOptions<Vue> = {
  beforeCreate() {
    if (!this.$options.filters) {
      this.$options.filters = {}
    }

    this._observers = {}
    this._subscription = new Subscription()

    this.$options.filters.async = (asyncDatum: Observable<any> | Promise<any>, key: string) => {

      if (!key) {
        throw new Error(`Async filter requires a 'key' string parameter, none supplied`)
      }

      if (this._observers[key] === undefined) {
        Vue.util.defineReactive(this._observers, key, null)

        if (asyncDatum instanceof Promise) {
          asyncDatum.then(val => this._observers[key] = val)
        } else if (asyncDatum.subscribe !== undefined) {
          this._subscription.add(
            asyncDatum.subscribe(val => this._observers[key] = val),
          )
        } else {
          throw new Error(`Async filter: Datum with key '${key}' is not a promise or an observable`)
        }
      }

      return this._observers[key]
    }
  },
  beforeDestroy() {
    this._subscription.unsubscribe()
  },
}

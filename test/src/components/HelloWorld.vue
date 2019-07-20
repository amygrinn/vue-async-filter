<template>
  <div class="hello">
    
    <h1 data-cy="observable">
      {{ interval | async('interval') }}
    </h1>

    <h1 data-cy="promise">
      {{ getTimeoutPromise('Promise has resolved!') | async('timeout-promise') || 'loading...' }}
    </h1>

    <div data-cy="function">
      <div 
        v-for="factor in $async(factors, 'factors')"
        :key="factor">
        <input :placeholder="getIntervalWithFactor(factor) | async('factor-' + factor)">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

import { AsyncFilterMixin } from '@tygr/vue-async-filter';

export default Vue.extend({
  mixins: [AsyncFilterMixin],
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data: () => ({
    interval: interval(1000),
    factors: new Promise((resolve) => setTimeout(() => resolve([6, 7, 8, 9]), 1000)),
    factorsKey: 'factors',
  }),
  methods: {
    getIntervalWithFactor(factor: number) {
      return this.interval.pipe(
        map((val: number) => factor * val),
      );
    },
    getTimeoutPromise(msg: string) {
      return new Promise((resolve) => {
        setTimeout(
          () => resolve(msg),
          2000,
        );
      });
    },
  },
  filters: {
    negatize(val: number) { return -val; },
  },
});
</script>

<style lang="scss">
input {
  margin: 40px 0 0;
}
</style>

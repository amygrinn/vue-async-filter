<template>
  <div class="hello">
    <h1>{{ interval | async('interval') }}</h1>
    <h1>{{ getTimeoutPromise('Promise has resolved!') | async('timeout-promise') || 'loading...' }}</h1>
    <h1 v-for="factor in $async(factors, 'factors')" :key="factor">
      {{ getIntervalWithFactor(factor) | async('factor-' + factor) | negatize }}
    </h1>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<template>
  <div id="app">
    <CounterInput v-model="cnt">
      Current value of cnt2 is {{ cnt2 }}
      <template #warning>STILL BETA</template>
    </CounterInput>
    <hr />
    {{ cnt }} / {{ cnt2 }}
    <button @click="cnt += 1">+</button>
    <button @click="cnt -= 1">-</button>
    <button data-testid="reset" v-if="cnt < 0" @click="cnt = 0">
      Back to 0
    </button>
    <hr />
    <button @click="cnt2 += 1">inc2</button>
    <button @click="cnt2 -= 1">dec2</button>
  </div>
</template>

<script>
import CounterInput from "./components/CounterInput.vue";

import Vue from "vue";

export default {
  name: "App",
  components: {
    CounterInput,
  },
  props: {
    initialValue: {
      default: 0,
      type: Number,
    },
  },
  watch: {
    initialValue: {
      immediate: true,
      handler(newValue) {
        this.cnt = newValue;
      },
    },
    cnt() {
      Vue.nextTick(() => {
        this.cnt2 = 0;
      });
    },
  },
  data() {
    return { cnt: 0, cnt2: 0 };
  },
  methods: {
    handleKeyPress(e) {
      if (e.key === "-") {
        this.cnt -= 1;
      }
      if (e.key === "+") {
        this.cnt += 1;
      }
    },
  },
  mounted() {
    document.addEventListener("keyup", this.handleKeyPress);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.handleKeyPress);
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

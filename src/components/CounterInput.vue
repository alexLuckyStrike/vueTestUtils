<template>
  <div>
    <p>Enter new value:</p>
    <input
      :value="currentValue"
      @input="$emit('currentValue', $event.target.value)"
    />
    <hr />
    By the way,
    <slot></slot>
    <hr />
    <slot name="warning"></slot>
  </div>
</template>

<script>
export default {
  name: "CounterInput",
  props: {
    currentValue: {
      type: Number,
      required: true,
    },
    // otherValue: {
    //   type: Number,
    //   required: false,
    // },
  },
  model: {
    prop: "currentValue",
    event: "change",
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

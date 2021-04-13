<template>
  <b-alert
    variant="danger"
    class="error-alert"
    v-bind:show="!!error"
    v-html="render(error)"
  ></b-alert>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    error: {
      type: String
    }
  },
  methods: {
    render: (text: string) => {
      return `<span> ${text} </span>`;
    }
  }
});
</script>
<style lang="scss" scoped>
.error-alert {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>

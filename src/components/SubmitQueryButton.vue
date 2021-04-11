<template>
  <b-button
    @click="onClick()"
    id="submit-query"
    class="mt-2"
    variant="primary"
    v-bind:disabled="loading || disabled"
  >
    <div class="loading-wrapper" :class="{ show: loading, hide: !loading }">
      <b-icon-three-dots animation="cylon"></b-icon-three-dots>
    </div>
    <span class="text-wrapper" :class="{ show: !loading, hide: loading }">
      Assess Item Quality
    </span>
  </b-button>
</template>

<script lang="ts">
import Vue from "vue";
import { BIconThreeDots } from "bootstrap-vue";

export default Vue.extend({
  components: {
    BIconThreeDots
  },
  props: {
    onClick: {
      type: Function,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false
    }
  }
});
</script>
<style lang="scss">
button {
  position: relative;
  .loading-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}

.show {
  opacity: 1;
}
.hide {
  opacity: 0;
}
</style>

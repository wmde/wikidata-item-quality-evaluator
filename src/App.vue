<template>
  <div id="app">
    <b-container class="mt-4 mb-4">
      <img
        class="logo mb-2"
        src="https://upload.wikimedia.org/wikipedia/commons/6/66/Wikidata-logo-en.svg"
      />
      <h1>Itemset Quality Tool</h1>
      <router-view />
    </b-container>
  </div>
</template>
<style lang="scss" scoped>
img.logo {
  width: 150px;
  float: right;
}
</style>
<script lang="ts">
import Vue from "vue";
import "@/assets/styles.scss";
export default Vue.extend({});
</script>

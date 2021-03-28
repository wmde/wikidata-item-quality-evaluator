<template>
  <div id="app">
    <b-container class="mt-4 mb-4">
      <img
        class="logo mb-2"
        src="https://upload.wikimedia.org/wikipedia/commons/6/66/Wikidata-logo-en.svg"
      />
      <h1>Item Quality Evaluator Tool</h1>
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
import CodeMirror from "codemirror";
import "@/assets/styles.scss";

/**
 * Attach CodeMirror to the window instance to support the wikidata-query-gui library
 * Init an empty object on the window for the wikidata-query-gui to attach itself onto
 *  */
window.CodeMirror = CodeMirror;
window.wikibase = {};

export default Vue.extend({});
</script>

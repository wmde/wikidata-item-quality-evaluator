<template>
  <div id="app">
    <b-container class="mt-4 mb-4">
      <b-row align-v="center" class="mb-4 mx-0">
        <img
          class="logo mr-2"
          src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Wikidata-logo_S.svg"
        />
        <h1 class="mb-0">Item Quality Evaluator Tool</h1>
      </b-row>
      <router-view />
      <footer class="mt-5">
        <span>Made by the Wikimedia Deutschland Wikidata team.</span>
        <p>
          Licensed under
          <a
            href="https://github.com/wmde/wikidata-item-quality-evaluator/blob/main/LICENSE"
            target="_blank"
            >BSD 3-Clause License</a
          >.
          <a
            href="https://github.com/wmde/wikidata-item-quality-evaluator"
            target="_blank"
            >View Source</a
          >.
          <a
            href="https://phabricator.wikimedia.org/tag/item_quality_evaluator/"
            target="_blank"
            >Report an issue</a
          >.
        </p>
      </footer>
    </b-container>
  </div>
</template>
<style lang="scss" scoped>
img.logo {
  height: 2rem;
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

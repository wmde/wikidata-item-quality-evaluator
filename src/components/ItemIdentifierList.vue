<template>
  <div class="mt-4">
    <h2>For which items should the average score be calculated?</h2>
    <b-card class="m-4">
      <b-textarea />
      <p>One item-identifier (like Q1234) on each line</p>
      <b-button @click="getRevisions" class="mt-2">
        Assess Item Quality
      </b-button>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  async getRevisions() {
    const response = await fetch(
      "https://www.wikidata.org/w/api.php?action=query&format=json&prop=revisions&titles=Q64|Q96"
    );

    const data = await response.json();
    console.log(data);

    return data;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

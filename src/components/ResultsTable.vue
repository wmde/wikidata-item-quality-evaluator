<template>
  <b-table striped hover :items="results" :fields="fields" caption-top>
    <template #table-caption>Overview of items and scores</template>
    <template #cell(label)="data">
      <a
        v-bind:href="'https://www.wikidata.org/wiki/' + data.item.title"
        target="_blank"
        >{{ data.value || data.item.title }}</a
      >
    </template>
  </b-table>
</template>
<script lang="ts">
import { Vue } from "vue-property-decorator";
export default Vue.extend({
  props: {
    results: Array
  },
  data() {
    return {
      fields: [
        {
          key: "label",
          sortable: true
        },
        {
          key: "score",
          sortable: true,
          formatter: (value: number) => value && value.toFixed(2)
        }
      ]
    };
  }
});
</script>

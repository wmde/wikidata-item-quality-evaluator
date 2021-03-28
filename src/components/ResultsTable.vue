<template>
  <b-table
    class="results-list"
    striped
    hover
    :items="results"
    :fields="fields"
    caption-top
  >
    <template #cell(label)="data">
      <a
        v-bind:href="'https://www.wikidata.org/wiki/' + data.item.title"
        target="_blank"
        >{{ generateLabel(data) }})</a
      >
    </template>
  </b-table>
</template>
<style lang="scss">
.results-list thead {
  position: sticky;
  top: 0;
  background-color: white;
  box-shadow: 0 1px 0 0 #dee2e6; /* Border bottom */
}
button.not-collapsed {
  border-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-color: #dee2e6;
}
</style>
<script lang="ts">
import { Vue } from "vue-property-decorator";
import store from "@/store";

interface ResultItem {
  value: string;
  item: {
    title: string;
  };
  score: number;
}
export default Vue.extend({
  computed: {
    results() {
      return store.state.results;
    }
  },
  data() {
    return {
      sortBy: "score",
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
  },
  methods: {
    generateLabel(data: ResultItem) {
      if (data.value) {
        return `${data.value} (${data.item.title}`;
      }
      return data.item.title;
    }
  }
});
</script>

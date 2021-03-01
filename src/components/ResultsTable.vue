<template>
  <div>
    <b-button v-b-toggle.collapse-2 block variant="secondary"
      >Overview of Items and scores
      <b-icon-triangle-fill rotate="180" scale="0.5"></b-icon-triangle-fill
    ></b-button>
    <b-collapse id="collapse-2">
      <b-table
        striped
        hover
        :items="results"
        :fields="fields"
        :sort-by="sortBy"
        caption-top
      >
        <template #cell(label)="data">
          <a
            v-bind:href="'https://www.wikidata.org/wiki/' + data.item.title"
            target="_blank"
            >{{ data.value || data.item.title }}</a
          >
        </template>
      </b-table>
    </b-collapse>
  </div>
</template>
<style lang="scss" scoped>
button.not-collapsed svg {
  transform: rotate(180deg);
}
</style>
<script lang="ts">
import { Vue } from "vue-property-decorator";
import { BIconTriangleFill } from "bootstrap-vue";
import store from "@/store";

export default Vue.extend({
  computed: {
    results() {
      return store.state.results;
    }
  },
  components: {
    BIconTriangleFill
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
  }
});
</script>

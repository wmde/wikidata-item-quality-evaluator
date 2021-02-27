<template>
  <div class="about">
    <router-link to="/"
      ><b-button variant="light" class="mb-4 mt-2"
        >← Refine item selection</b-button
      ></router-link
    >
    <p>
      Average quality score based on the {{ validResults.length }} item{{
        validResults.length > 1 ? `s` : ``
      }}
      selected:
    </p>
    <p class="missing" v-if="unprocessedItems.length">
      <b-icon-exclamation-triangle-fill
        variant="alert"
      ></b-icon-exclamation-triangle-fill>
      {{ unprocessedItems.length }} Identifier{{
        unprocessedItems.length > 1 ? `s` : ``
      }}
      can not be processed:
      {{ unprocessedItems.join(", ") }}
    </p>
    <p>
      <span class="total-score">{{ totalAverageScore }}</span> Scores can go
      from 1 to 5
    </p>
    <ResultsTable v-bind:results="validResults" />
    <b-button @click="convertToCSV(validResults)" variant="primary" class="mb-4"
      >➥ Download as CSV</b-button
    >
    <p>
      The quality scores are created by ORES, a machine learning tool.
      <a href="https://ores.wikimedia.org/" target="_blank"
        >Learn more about how it works</a
      >
    </p>
  </div>
</template>
<style lang="scss" scoped>
.missing {
  color: var(--red);
}
.total-score {
  font-size: 2rem;
  font-weight: 600;
}
</style>
<script lang="ts">
import Vue from "vue";
import store from "@/store";
import ResultsTable from "@/components/ResultsTable.vue";
import { BIconExclamationTriangleFill } from "bootstrap-vue";

export default Vue.extend({
  components: {
    ResultsTable,
    BIconExclamationTriangleFill
  },
  computed: {
    validResults() {
      return store.getters.validResults;
    },
    unprocessedItems() {
      return store.state.unprocessedItems;
    },
    totalAverageScore() {
      return store.getters.totalAverageScore.toFixed(2);
    }
  },
  methods: {
    convertToCSV(arr: any, delimiter = ",") {
      const csv = arr
        .map((v: any) =>
          v
            .map((x: any) => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x))
            .join(delimiter)
        )
        .join("\n");
    }
  }
});
</script>

<template>
  <div class="about">
    <router-link to="/"><b-button>refine item selection</b-button></router-link>
    <p>Average quality score based on the 234 items selected:</p>
    <p class="missing" v-if="missingResults.length">
      {{ missingResults.length }} Identifier can not be processed:
      {{ missingResults.map(result => result.title).join(", ") }}
    </p>
    <p>
      <span class="lead">{{ totalAverageScore }}</span> Scores can go from 1 to
      5
    </p>
    <ResultsTable v-bind:results="validResults" />
    <b-button @click="convertToCSV(validResults)">Download as CSV</b-button>
    <p>
      The quality scores are created by ORES, a machine learning tool.
      <a href="">Learn more about how it works</a>
    </p>
  </div>
</template>
<style lang="scss" scoped>
.missing {
  color: red;
}
</style>
<script lang="ts">
import Vue from "vue";
import store from "@/store";
import ResultsTable from "@/components/ResultsTable";

export default Vue.extend({
  components: {
    ResultsTable
  },
  computed: {
    validResults() {
      return store.getters.validResults;
    },
    missingResults() {
      return store.getters.missingResults;
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

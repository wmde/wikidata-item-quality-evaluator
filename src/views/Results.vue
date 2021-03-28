<template>
  <div class="about">
    <router-link to="/"
      ><b-button variant="light" class="mb-4 mt-2"
        >← Refine Item selection</b-button
      ></router-link
    >
    <p>
      Average quality score based on the {{ results.length }} Item{{
        results.length > 1 ? `s` : ``
      }}
      selected:
    </p>
    <p class="error" v-if="unprocessedItems.length">
      <b-icon-exclamation-triangle-fill
        variant="alert"
      ></b-icon-exclamation-triangle-fill>
      {{ unprocessedItems.length }} Identifier{{
        unprocessedItems.length > 1 ? `s` : ``
      }}
      can not be processed:
      {{ unprocessedItems.join(", ") }}
    </p>
    <p class="error" v-if="missingItems.length">
      <b-icon-exclamation-triangle-fill
        variant="alert"
      ></b-icon-exclamation-triangle-fill>
      {{ missingItems.length }} Identifier{{
        missingItems.length > 1 ? `s` : ``
      }}
      could not be found:
      {{ missingItems.join(", ") }}
    </p>
    <p>
      <span class="total-score">{{ totalAverageScore }}</span> Scores can go
      from 1 (worst quality) to 5 (best quality)
    </p>
    <b-row align-v="end" align-h="between" class="mt-4">
      <b-col sm="auto" order-sm="2" class="mb-3">
        <CSVGenerator />
      </b-col>
      <b-col order-sm="1" class="mb-3">
        <strong>
          Score{{ results.length > 1 ? `s` : `` }} for
          {{ results.length }} Item{{ results.length > 1 ? `s` : `` }}
        </strong>
      </b-col>
    </b-row>
    <ResultsTable />
    <p>
      The quality scores are created by ORES, a machine learning tool.
      <a href="https://ores.wikimedia.org/" target="_blank"
        >Learn more about how it works</a
      >
    </p>
  </div>
</template>
<style lang="scss" scoped>
.error {
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
import CSVGenerator from "@/components/CSVGenerator.vue";
import { BIconExclamationTriangleFill } from "bootstrap-vue";

export default Vue.extend({
  components: {
    ResultsTable,
    CSVGenerator,
    BIconExclamationTriangleFill
  },
  beforeRouteEnter(to, from, next) {
    // Navigate home if entering /results without making a query
    next(vm => {
      if (!vm.$store.state.userHasQueried) {
        vm.$router.replace("/");
      }
    });
  },
  computed: {
    results() {
      return store.state.results;
    },
    unprocessedItems() {
      return store.state.unprocessedItems;
    },
    missingItems() {
      return store.state.missingItems;
    },
    totalAverageScore() {
      return store.getters.totalAverageScore.toFixed(2);
    }
  }
});
</script>

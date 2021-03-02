<template>
  <b-button @click="convertToCSV(results)" variant="light" class="mb-4 mt-4"
    ><b-icon-download class="mr-1"></b-icon-download> Download as CSV</b-button
  >
</template>
<script lang="ts">
import Vue from "vue";
import store from "@/store";
import Papa from "papaparse";
import { BIconDownload } from "bootstrap-vue";

export default Vue.extend({
  components: {
    BIconDownload
  },
  computed: {
    results() {
      return store.state.results;
    }
  },
  methods: {
    convertToCSV() {
      const results = this.results.map(result => ({
        "Item label": result.label,
        "Item QID": result.title,
        "Weighted ORES Score": result.score,
        "Probability A": result.probability.A,
        "Probability B": result.probability.B,
        "Probability C": result.probability.C,
        "Probability D": result.probability.D,
        "Probability E": result.probability.E
      }));

      const csv = Papa.unparse(results);
      const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      let csvURL = null;

      // For IE support
      if (navigator.msSaveBlob) {
        csvURL = navigator.msSaveBlob(csvData, "download.csv");
      } else {
        csvURL = window.URL.createObjectURL(csvData);
      }

      const tempLink = document.createElement("a");
      tempLink.href = csvURL as string;
      tempLink.setAttribute(
        "download",
        `ItemQualityToolExport-${new Date().getTime()}.csv`
      );
      tempLink.click();
    }
  }
});
</script>

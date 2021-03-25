<template>
  <b-button @click="convertToCSV(results)" variant="secondary"
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
        "Item ID": result.title,
        "Weighted ORES Score": result.score.toFixed(2)
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

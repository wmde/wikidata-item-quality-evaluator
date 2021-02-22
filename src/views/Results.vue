<template>
  <div class="about">
    <b-button>refine item selection</b-button>
    <p>Average quality score based on the 234 items selected:</p>
    <p><span class="lead">4,31</span> Scores can go from 1 to 5</p>
    <b-table striped hover :items="items" :fields="fields" caption-top>
      <template #table-caption>Overview of items and scores</template>
    </b-table>
    <b-button>Download as CSV</b-button>
    <p>
      The quality scores are created by ORES, a machine learning tool.
      <a href="">Learn more about how it works</a>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        {
          key: "label",
          sortable: true
        },
        {
          key: "score",
          sortable: true
        }
      ],
      items: [
        { label: 40, score: "Dickerson" },
        { label: 21, score: "Larsen" },
        { label: 89, score: "Geneva" },
        { label: 38, score: "Jami" }
      ]
    };
  }
};
</script>

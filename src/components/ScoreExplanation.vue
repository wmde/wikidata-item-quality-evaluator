<template>
  <div>
    <a v-b-modal.modal-1>How does this work?</a>
    <b-modal
      id="modal-1"
      title="How does this work?"
      centered
      :hide-footer="true"
    >
      <p>
        The Item Quality Evaluator retrieves a quality score for each requested
        Item and also calculates the avarage score of all Items requested.
      </p>
      <p>
        <strong>What does the score measure?</strong>
        <br />
        The score estimates the quality of the Wikidata Item. It takes into account
        various features of the Item to determine its quality. These include the
        number of statements, the number of labels in different languages and the
        percentage of referenced statements.
      </p>
      <p>
        <strong>What does the score not measure?</strong>
        <br />
        <ul>
        <li>It cannot determine if the data is "true"</li>
        <li>It cannot estimate if the content should be included on Wikidata </li>
        <li>It cannot decide if the Item information is “good”. For instance, The Item “famine” (Q168247) 
        can have a high score if it has references and delivers complete information, while “Kitten” (Q147)
        can score low if it lacks references and statements</li>
      </ul>
      </p>
      <p>
        <strong>How is the score calculated</strong>
        <br />
        We trained the quality algorithm by giving it Items that were scored to
        belong in one of 5 quality categories. Now, if the algorithm is given a new
        Item, it estimates the the likelyhood that a given Item falls in each of
        the 5 possible quality categories. To get one score for an Item, we
        weight each category by its likelyhood and calculate an average of the
        weighted scores, which is the score for a single Item.
      </p>
      <p>
        From several single-item-scores, we calculate the avarage score of all
        the Items that you requested.
      </p>
      <p>
        <strong>Where can I find more information?</strong>
        <br />
        This tool is documented and the source code is available on
        <a
          href="https://github.com/wmde/wikidata-item-quality-evaluator"
          target="_blank"
          >GitHub</a
        >.
        <br />
        You can read more about quality score calculation in Wikidata
        <a
          href="https://wikitech.wikimedia.org/wiki/Machine_Learning/LiftWing"
          target="_blank"
          >here</a
        >.
      </p></b-modal
    >
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>
<style lang="scss" scoped>
a[role="button"] {
  color: #36c;
  text-decoration: none;
  &:hover {
    color: #24478f;
    text-decoration: underline;
  }
}
</style>

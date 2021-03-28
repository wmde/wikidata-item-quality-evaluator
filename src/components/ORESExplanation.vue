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
        Item and also calculates the average score of all Items requested.
      </p>
      <p>
        <strong>What does the score measure?</strong>
        <br />
        The score estimates the quality of the Wikidata Item. It can not
        estimate if the content should be included on Wikidata or if what the
        Item is about is "good": The Item "famine" (Q168247) can have a high
        score if it is well sourced and delivers complete information, while
        Kitten (Q147) can score low if it lacks sources and statements.
      </p>
      <p>
        <strong>How is the score calculated</strong>
        <br />
        We trained the ORES Algorithm by giving it items that we scored to
        belong in one of 5 categories. Now, if the algorithm is given an Item,
        it estimates the likelyhood that a given Item falls in each of the 5
        possible quality categories. To get one score for an item, we how does
        weighting work?. The average score for the whole item we present is the
        mean of these scores.
      </p>
      <p>
        <strong>Where can I find more information?</strong>
        <br />
        This tool is documented at somewikilink. Its source code is on platform.
        <br />
        If you want to know more about ORES read wikilink.
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

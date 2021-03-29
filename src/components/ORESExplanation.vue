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
        item and also calculates the avarage score of all items requested.
      </p>
      <p>
        <strong>What does the score measure?</strong>
        <br />
        The score estimates the quality of the Wikidata item. It can not
        estimate if the content should be included on Wikidata or if what the
        item is about is “good”: The item “famine” (Q168247) can have a high
        score if it has references and delivers complete information, while
        “Kitten” (Q147) can score low if it lacks references and statements.
      </p>
      <p>
        <strong>How is the score calculated</strong>
        <br />
        We trained the ORES Algorithm by giving it items that we scored to
        belong in one of 5 quality categories. Now, if the algorithm is given an
        item, it estimates the the likelyhood that a given item falls in each of
        the 5 possible quality categories. To get one score for an item, we
        weight each category by its likelyhood and calculate an average of the
        weighted scores, which is the score for a single item.
      </p>
      <p>
        From several single-item-scores, we calculate the avarage score of all
        the items that you requested.
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
        You can read more about
        <a href="https://www.mediawiki.org/wiki/ORES" target="_blank">ORES</a>
        in Wikidata in
        <a
          href="https://blog.wikimedia.de/2016/01/02/teaching-machines-to-make-your-life-easier-quality-work-on-wikidata/"
          target="_blank"
          >this blog post</a
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

<template>
  <div>
    <p>
      Gets the quality scores of Wikidata Items and calculates their average
      value.
      <br />
      <ScoreExplanation />
    </p>
    <div class="mt-4">
      <h2 class="mb-4">
        For which Items should the average score be calculated?
      </h2>
      <b-tabs
        v-model="activeItemsInputTab"
        content-class="bg-light p-4 border-bottom border-left border-right relative"
      >
        <b-tab title="Item list" lazy>
          <ItemIdentifierList />
        </b-tab>
        <b-tab title="SPARQL" lazy>
          <SPARQLEditor />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import ItemIdentifierList from "@/components/ItemIdentifierList.vue"; // @ is an alias to /src
import SPARQLEditor from "@/components/SPARQLEditor.vue";
import ScoreExplanation from "@/components/ScoreExplanation.vue";

const ACTIVE_TAB_KEY = "wikidata.itemQuality.ui.activeItemsInputTab";

export default Vue.extend({
  components: {
    ItemIdentifierList,
    SPARQLEditor,
    ScoreExplanation
  },
  data() {
    return {
      activeItemsInputTab: Number(localStorage[ACTIVE_TAB_KEY])
    };
  },
  watch: {
    activeItemsInputTab(newActiveTab) {
      localStorage[ACTIVE_TAB_KEY] = newActiveTab;
    }
  }
});
</script>
<style lang="scss">
.nav-tabs .nav-link.active {
  background-color: var(--light);
  border-bottom-color: var(--light);
}
</style>

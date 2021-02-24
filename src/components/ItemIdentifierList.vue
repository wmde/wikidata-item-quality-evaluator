<template>
  <div class="mt-4">
    <h2>For which items should the average score be calculated?</h2>
    <b-card class="mt-4">
      <b-textarea v-model="itemList" />
      <p>One item-identifier (like Q1234) on each line</p>
      <b-row align-h="end" no-gutters>
        <b-button
          @click="getRevisions(itemList)"
          class="mt-2"
          variant="primary"
        >
          Assess Item Quality
        </b-button>
      </b-row>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import ArticleQualityService from "@/ArticleQualityService";
import store from "@/store";

export default Vue.extend({
  data() {
    return {
      itemList: `Q67
      Q1235`
    };
  },
  computed: {
    results() {
      return store.state.results;
    }
  },
  methods: {
    async getRevisions(itemList: string) {
      const aq = new ArticleQualityService();

      // Trim the items to remove any whitespace
      const articleQualityResults = await aq.calculateArticleQuality(
        itemList.split("\n").map(item => item.trim())
      );

      store.commit("updateResults", Object.values(articleQualityResults));
      this.$router.push({ path: "/results" });
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
textarea {
  min-height: 140px;
}
</style>

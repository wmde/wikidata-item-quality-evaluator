<template>
  <div class="mt-4">
    <h2>For which items should the average score be calculated?</h2>
    <b-card class="mt-4">
      <b-textarea
        @keydown="onKeyDown"
        @paste="onPaste"
        v-model="itemList"
        v-bind:readonly="loading"
      />
      <p>One item-identifier (like Q1234) on each line</p>
      <b-row align-h="end" no-gutters>
        <b-button
          @click="getRevisions(itemList)"
          class="mt-2"
          variant="primary"
          v-bind:disabled="loading"
        >
          <b-icon-three-dots
            v-if="loading"
            animation="cylon"
          ></b-icon-three-dots>
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
import { BIconThreeDots } from "bootstrap-vue";

const AlphaNumericAndNewlineRegex = /[^a-zA-Z0-9\n]/;

export default Vue.extend({
  data() {
    return {
      itemList: ``
    };
  },
  components: {
    BIconThreeDots
  },
  mounted() {
    if (localStorage.itemList) {
      this.itemList = localStorage.itemList;
    }
  },
  watch: {
    itemList(newItemList) {
      localStorage.itemList = newItemList;
    }
  },
  computed: {
    results() {
      return store.state.results;
    },
    loading() {
      return store.state.loading;
    }
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      // Prevent non-alphanumeric characters
      if (AlphaNumericAndNewlineRegex.test(event.key)) {
        event.preventDefault();
      }
    },
    onPaste(event: ClipboardEvent) {
      // Format pasted text
      event.preventDefault();
      const clipboardData = event.clipboardData?.getData("text/plain") || "";

      const newText = clipboardData
        .replace(/\s\s+/g, ` `) // Replace multiple whitespaces with one
        .replace(/\s/g, `\n`) // Replace whitespaces with blank lines
        .replace(/\n\n/g, `\n`) // Remove blank lines
        .replace(AlphaNumericAndNewlineRegex, ""); // Remove non-alphanumeric characters

      const target = event.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const currentValue = this.itemList;

      const textBefore = currentValue.substring(0, start);
      const textAfter = currentValue.substring(end, currentValue.length);

      const mergedText = textBefore + newText + textAfter;

      this.itemList = mergedText;
    },
    async getRevisions(itemList: string) {
      const aq = new ArticleQualityService();
      store.commit("setLoading", true);
      try {
        // Clean up any whitespaces
        const cleanedItemList = itemList
          .replace(/^\s*[\r\n]/gm, "")
          .split("\n");

        // Remove last item if it's a blank line
        if (cleanedItemList[cleanedItemList.length - 1] == "") {
          cleanedItemList.pop();
        }
        // Trim the items to remove any whitespace
        const articleQuality = await aq.calculateArticleQuality(
          cleanedItemList
        );
        store.commit("updateResults", articleQuality);

        this.$router.push({ path: "/results" });
      } catch (e) {
        store.commit("setError", true);
      }
      store.commit("setLoading", false);
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

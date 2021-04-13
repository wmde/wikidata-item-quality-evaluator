<template>
  <div>
    <b-textarea
      class="rounded-0"
      @keydown="onKeyDown"
      @paste="onPaste"
      v-model="itemList"
      v-bind:readonly="loading"
    />
    <v-error-message :error="error"> </v-error-message>
    <p class="mt-2">One Item-identifier (like Q1234) on each line</p>
    <b-row align-h="end" no-gutters>
      <v-submit-query-button
        :loading="loading"
        :disabled="!itemList"
        :onClick="getRevisions"
      >
      </v-submit-query-button>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import ArticleQualityService from "@/ArticleQualityService";
import store from "@/store";
import SubmitQueryButton from "./SubmitQueryButton.vue";
import ErrorMessage from "./ErrorMessage.vue";

const AlphaNumericAndNewlineRegex = /[^a-zA-Z0-9\n]/;
const ITEM_LIST_KEY = "wikidata.itemQuality.ui.itemList";

export default Vue.extend({
  data() {
    return {
      itemList: localStorage[ITEM_LIST_KEY] || "",
      error: ""
    };
  },
  components: {
    "v-submit-query-button": SubmitQueryButton,
    "v-error-message": ErrorMessage
  },
  watch: {
    itemList(newItemList) {
      localStorage[ITEM_LIST_KEY] = newItemList;
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
    async getRevisions() {
      const itemList = this.itemList;
      const aq = new ArticleQualityService();
      store.commit("setLoading", true);
      try {
        // Clean up any whitespaces
        const cleanedItemList = itemList
          .replace(/^\s*[\r\n]/gm, "")
          .replaceAll("q", "Q") // Capitalise Q
          .split("\n");

        // Remove last item if it's a blank line
        if (cleanedItemList[cleanedItemList.length - 1] == "") {
          cleanedItemList.pop();
        }
        // Trim the Items to remove any whitespace
        const articleQuality = await aq.calculateArticleQuality(
          cleanedItemList
        );
        store.commit("updateResults", articleQuality);

        this.$router.push({ path: "/results" });
      } catch (e) {
        console.error(e);
        this.error = e.description;
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

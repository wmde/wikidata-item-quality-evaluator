<template>
  <div>
    <div class="border">
      <textarea></textarea>
    </div>
    <p class="mt-2">
      You can also prepare your SPARQL query in the
      <a href="https://query.wikidata.org" target="_blank">QueryService</a> and
      copy it here
    </p>
    <b-row align-h="end" no-gutters>
      <b-button
        @click="getRevisions()"
        class="mt-2"
        id="get-results"
        variant="primary"
        v-bind:disabled="loading"
      >
        <b-icon-three-dots v-if="loading" animation="cylon"></b-icon-three-dots>
        Assess Item Quality
      </b-button>
    </b-row>
  </div>
</template>

<script>
import ArticleQualityService from "@/ArticleQualityService";
import { BIconThreeDots } from "bootstrap-vue";
import store from "@/store";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/sparql/sparql.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/display/placeholder.js";
import "codemirror/addon/display/fullscreen.js";
import "codemirror/addon/hint/show-hint.css";
import "wikidata-query-gui/wikibase/queryService/ui/i18n/getMessage.js";
import "wikidata-query-gui/wikibase/queryService/ui/editor/hint/Sparql.js";
import "wikidata-query-gui/wikibase/queryService/ui/editor/hint/Rdf.js";
import "wikidata-query-gui/wikibase/queryService/ui/editor/tooltip/Rdf.js";
import "wikidata-query-gui/wikibase/queryService/ui/editor/Editor.js";
import "wikidata-query-gui/wikibase/queryService/api/Wikibase.js";
import "wikidata-query-gui/wikibase/queryService/RdfNamespaces.js";
import "wikidata-query-gui/wikibase/queryService/ui/editor/Editor.js";
import "wikidata-query-gui/wikibase/queryService/RdfNamespaces.js";
import "wikidata-query-gui/wikibase/queryService/api/Sparql.js";

const SPARQL_EDITOR_KEY = "wikibase.queryService.ui.Editor";

export default {
  components: {
    BIconThreeDots
  },
  mounted: function() {
    this.editor = new window.wikibase.queryService.ui.editor.Editor();
    this.service = new window.wikibase.queryService.api.Sparql();
    this.editor.fromTextArea(this.$el.querySelector("textarea"));
    this.editor.setValue(localStorage.getItem(SPARQL_EDITOR_KEY));
    setTimeout(() => this.editor.refresh(), 200);
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
    async getRevisions() {
      const value = this.editor.getValue();
      store.commit("setLoading", true);

      try {
        const response = await this.service.query(value);
        const results = response.results.bindings;

        const itemKey = Object.entries(results[0])
          .map(([key, value]) => value.type === "uri" && key)
          .filter(Boolean)[0];

        const list = Object.values(results).map(result => {
          const res = result[itemKey].value.split("/");
          return res[res.length - 1];
        });

        const aq = new ArticleQualityService();
        const articleQuality = await aq.calculateArticleQuality(list);
        store.commit("updateResults", articleQuality);
        store.commit("setLoading", false);

        this.$router.push({ path: "/results" });
      } catch (e) {
        // console.log("ERROR", this.service.getError());
        store.commit("setLoading", false);
        if (e.status === 400) {
          store.commit(
            "setError",
            "There was a problem parsing your query. Please check your query is valid and try again"
          );
        } else {
          store.commit("setError", true);
        }
      }
    }
  }
};
</script>

<style lang="scss">
// Colors for CodeMirror from wikidata-query-gui
$wmui-color-base70: #c8ccd1; // = HSB 213°, 4%, 82%

$wmui-color-accent30: #2a4b8d; // = HSB 220°, 70%, 55%
$wmui-color-base30: #72777d; // = HSB 210°, 9%, 49%; WCAG 2.0 level AA at 4.52:1 contrast ratio on `#fff`
$wmui-color-red30: #b32424; // = HSB 360°, 80%, 70%
$wmui-color-yellow30: #ac6600; // = HSB 36°, 100%, 67%
$wmui-color-green30: #14866d; // = HSB 167°, 85%, 53%

$codemirror-color-atom: $wmui-color-accent30;
$codemirror-color-builtin: $wmui-color-red30;
$codemirror-color-comment: $wmui-color-base30;
$codemirror-color-keyword: $codemirror-color-builtin;
$codemirror-color-string: $wmui-color-yellow30;
$codemirror-color-variable-2: $wmui-color-green30;

.panel {
  border: 1px solid $wmui-color-base70;
  background: white;
  border-radius: 4px;
}

.CodeMirror {
  .cm-atom {
    color: $codemirror-color-atom;
  }

  .cm-bracket {
    color: inherit;
  }

  .cm-builtin {
    color: $codemirror-color-builtin;
  }

  .cm-comment {
    color: $codemirror-color-comment;
  }

  .cm-keyword {
    color: $codemirror-color-keyword;
  }

  .cm-operator {
    color: inherit;
  }

  .cm-string {
    color: $codemirror-color-string;
  }

  .cm-variable-2 {
    color: $codemirror-color-variable-2;
  }

  &-scroll {
    min-height: 320px;
  }

  &-hints {
    direction: ltr;
  }

  &-hint {
    max-width: 19em;
  }
}
</style>

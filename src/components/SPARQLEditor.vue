<template>
  <div>
    <div class="border">
      <textarea></textarea>
    </div>
    <v-error-message :error="error"> </v-error-message>
    <p class="mt-2">
      You can also prepare your SPARQL query in the
      <a href="https://query.wikidata.org" target="_blank">QueryService</a> and
      copy it here
    </p>
    <b-row align-h="end" no-gutters>
      <v-submit-query-button
        :loading="loading"
        :onClick="getRevisions"
        :disabled="!editorHasValue"
      ></v-submit-query-button>
    </b-row>
  </div>
</template>

<script>
import ArticleQualityService from "@/ArticleQualityService";
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
import SubmitQueryButton from "./SubmitQueryButton.vue";
import ErrorMessage from "./ErrorMessage.vue";

const SPARQL_EDITOR_KEY = "wikibase.queryService.ui.Editor";

export default {
  components: {
    "v-submit-query-button": SubmitQueryButton,
    "v-error-message": ErrorMessage
  },
  data: function() {
    return {
      editorHasValue: !!localStorage.getItem(SPARQL_EDITOR_KEY),
      error: null
    };
  },
  mounted: function() {
    this.editor = new window.wikibase.queryService.ui.editor.Editor();
    this.service = new window.wikibase.queryService.api.Sparql();

    // Wait for editor to initialize
    setTimeout(() => {
      this.editor._editor.on("change", () => {
        const value = this.editor.getValue();
        this.editor.storeValue(value);
        this.editorHasValue = !!value;
      });
    }, 10);

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
        store.commit("setLoading", false);

        const sparqlError = this.service.getError();
        if (sparqlError) {
          this.handleSparqlError(sparqlError);
          return;
        }

        console.log(e);
        this.error = e.description;
      }
    },
    handleSparqlError(e) {
      const codes = this.service.ERROR_CODES;

      let errorMessagePrefix = "";
      switch (e.code) {
        case codes.TIMEOUT:
          errorMessagePrefix = "Query timeout limit reached. ";
          break;
        case codes.MALFORMED:
          errorMessagePrefix = "Query is malformed. ";
          break;
        case codes.SERVER:
          errorMessagePrefix = "Server error. ";
          break;
        default:
          errorMessagePrefix = "Unknown error. ";
          break;
      }
      this.error = errorMessagePrefix + e.message;
      this.editor.highlightError(e.debug);
      this.service._error = null;
    }
  }
};
</script>

<style lang="scss">
// Colors for CodeMirror from wikidata-query-gui
$wmui-color-base70: #c8ccd1; // = HSB 213°, 4%, 82%
$wmui-color-base100: #fff;

$wmui-color-accent30: #2a4b8d; // = HSB 220°, 70%, 55%
$wmui-color-base30: #72777d; // = HSB 210°, 9%, 49%; WCAG 2.0 level AA at 4.52:1 contrast ratio on `#fff`
$wmui-color-red30: #b32424; // = HSB 360°, 80%, 70%
$wmui-color-red50: #d33;
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

  .error-line {
    border-bottom: 2px dotted $wmui-color-red50;
  }

  .error-character {
    background: $wmui-color-red50;
    color: $wmui-color-base100;
  }
}
</style>

<template>
  <div>
    <p>
      This tool calculates the average quality score of several Wikidata Items.
    </p>
    <ItemIdentifierList />
    <b-alert variant="danger" v-bind:show="error"
      >An error occurred while processing your request</b-alert
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ItemIdentifierList from "@/components/ItemIdentifierList.vue"; // @ is an alias to /src
import store from "@/store";

@Component({
  components: {
    ItemIdentifierList
  },
  computed: {
    error() {
      return store.state.error;
    }
  }
})
export default class ItemInput extends Vue {}
</script>

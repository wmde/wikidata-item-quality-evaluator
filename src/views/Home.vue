<template>
  <div class="home">
    <p>
      This tool calculates the average quality score of several Wikidata Items.
    </p>
    <ItemIdentifierList />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ItemIdentifierList from "@/components/ItemIdentifierList.vue"; // @ is an alias to /src

@Component({
  components: {
    ItemIdentifierList
  }
})
export default class Home extends Vue {}
</script>

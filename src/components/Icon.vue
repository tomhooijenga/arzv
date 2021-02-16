<template>
  <div v-html="html"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: String
  },

  computed: {
    html (): string {
      return require(`@/assets/icons/${this.name}.svg`)
    }
  }
})
</script>

<style scoped lang="scss">
div {
  line-height: 1;
  height: 1em;
  width: 1em;

  &::v-deep(svg) {
    fill: currentColor;
    height: 1em;
    width: 1em;
    max-width: unset;
    display: block;
  }
}
</style>

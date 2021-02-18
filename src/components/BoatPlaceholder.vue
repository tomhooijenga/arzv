<template>
  <div class="uk-card uk-card-default uk-card-small">
    <div class="uk-card-header">
      <h3 class="uk-card-title skeleton-text" :style="{width: `${width()}%`}">&nbsp;</h3>
    </div>
    <div class="uk-card-body">
      <div class="uk-margin-small-bottom">&nbsp;</div>
      <div>&nbsp;</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    width () {
      const max = 75
      const min = 30
      return Math.floor(Math.random() * (max - min) + min)
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/theme";

.uk-card-title {
  width: 70%;
}
</style>

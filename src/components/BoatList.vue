<template>
  <div class="boats uk-margin-top">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
})
</script>

<style lang="scss" scoped>
.boats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, auto));
  grid-auto-rows: minmax(min-content, max-content);
  grid-gap: 20px;
}
</style>

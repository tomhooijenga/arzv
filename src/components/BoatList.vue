<template>
  <div class="boats">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
})
</script>

<style lang="scss">
.boats {
  display: grid;
  margin: 0 -0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, auto));
  grid-auto-rows: minmax(min-content, max-content);
}
</style>

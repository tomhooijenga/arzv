<template>
  <section :class="{show: show, full: full}"
           class="bottom-sheet">
    <div :class="{'uk-background-primary': full, 'uk-light': full, 'uk-box-shadow-small': full}"
         class="header">
      <div class="uk-container uk-flex"
           @click="$emit(full ? 'close' : 'open')">
        <div class="uk-padding-small uk-padding-remove-horizontal uk-text-truncate uk-width-1-1">
          <slot name="title"></slot> &nbsp;
        </div>
        <span v-if="full" class="uk-margin-auto-vertical">&times;</span>
      </div>
    </div>

    <slot></slot>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    show: Boolean,
    full: Boolean
  }
})
</script>

<style lang="scss" scoped>
.bottom-sheet {
  position: fixed;
  z-index: 1;
  width: 100%;
  bottom: 0;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(100%);
  transition: transform .2s ease-in-out, height .2s ease-in-out;
  overscroll-behavior: none;
}

.show {
  transform: translateY(0);
}

.full {
  height: 100%;
  overflow-y: auto;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1;
  cursor: pointer;
}
</style>

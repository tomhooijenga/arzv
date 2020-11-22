<template>
  <section :class="{show: show, full: full}"
           class="bottom-sheet">
    <div :class="{'uk-background-primary': full, 'uk-box-shadow-small': full}"
         class="header">
      <div class="uk-container uk-flex"
           @click="$emit(full ? 'close' : 'open')">
        <div class="uk-padding-small uk-padding-remove-horizontal uk-text-truncate uk-width-1-1">
          <slot name="title"></slot> &nbsp;
        </div>
        <icon class="icon uk-margin-auto-vertical" :name="full ? 'expand_more' : 'expand_less'" />
      </div>
    </div>

    <slot></slot>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from './Icon.vue'

export default defineComponent({
  props: {
    show: Boolean,
    full: Boolean
  },

  components: {
    Icon
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
  transition: all 0.2s ease-in-out;
  overscroll-behavior: none;
}

.show {
  transform: translateY(0);
}

.full {
  height: 100%;
  overflow-y: auto;

  .header {
    color: white;
  }
}

.header {
  position: sticky;
  top: 0;
  z-index: 1;
  cursor: pointer;
}

.icon {
  font-size: 2rem;
}
</style>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="show"
           class="uk-modal uk-open uk-flex"
           @click.self="$emit('close')">
        <div class="uk-modal-dialog uk-margin-auto-vertical uk-modal-body">
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    show: Boolean
  },

  emits: ['close']
})
</script>

<style lang="scss">
.uk-modal {
  opacity: initial;

  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity 0.2s ease-in-out;
  }

  &.fade-enter-from,
  &.fade-leave-to {
    opacity: 0;
  }
}
</style>

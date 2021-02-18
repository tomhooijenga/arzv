<template>
  <transition mode="out-in" name="fade" appear>
    <span v-if="loading"
          class="uk-flex uk-flex-middle uk-flex-center">
      <span class="icon skeleton-text"></span>
      <span class="skeleton-text">
        <slot name="skeleton"></slot>
      </span>
    </span>
    <span v-else
          class="uk-flex uk-flex-middle uk-flex-center">
      <icon :name="icon" class="icon"/>
      <slot></slot>
    </span>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  components: {
    Icon
  },
  props: {
    icon: String,
    loading: Boolean
  }
})
</script>

<style lang="scss" scoped>
.icon {
  font-size: 1.5rem;
  width: 1em;
  height: 1em;
  margin-right: 0.25rem;
}
</style>

<template>
  <div>
    <div class="uk-flex"
         @click="openToggle = !openToggle">
      <div class="uk-text-truncate uk-width-1-1">
        <slot name="header" ></slot>
      </div>
      <icon class="uk-margin-auto-vertical" :name="openToggle ? 'expand_less' : 'expand_more'"/>
    </div>

    <slot v-if="openToggle" name="content"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  components: {
    Icon
  },
  props: {
    isOpen: Boolean
  },

  setup (props) {
    const openToggle = ref(props.isOpen)

    watch(() => props.isOpen, () => {
      openToggle.value = props.isOpen
    })

    return {
      openToggle
    }
  }
})
</script>

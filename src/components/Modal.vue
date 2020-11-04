<template>
  {{ show }}
  <div v-if="show"
       class="uk-modal uk-open uk-flex"
       @click.self="$emit('close')">
    <div class="uk-modal-dialog uk-margin-auto-vertical uk-modal-body">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    show: Boolean
  }
})
</script>

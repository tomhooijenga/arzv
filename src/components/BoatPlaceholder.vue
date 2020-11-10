<template>
  <div class="uk-card uk-card-default uk-card-small">
    <div class="uk-card-header">
      <h3 class="uk-card-title" :style="{width: `${width()}%`}">&nbsp;</h3>
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
.uk-card-title {
  width: 70%;
  overflow: hidden;
  background: #e5e5e5;
  border-radius: 500px;
  position: relative;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0));
    animation: shimmer 2s infinite;
    content: '';
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>

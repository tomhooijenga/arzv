<template>
  <div class="uk-flex">
    <span class="uk-margin-small-right">{{ state.min }}</span>
    <div class="slider uk-margin-auto-vertical uk-width-1-1">
      <input v-model.number="state.min"
             class="uk-range"
             :min="min"
             :max="max"
             :step="step"
             type="range"/>
      <input v-model.number="state.max"
             class="uk-range"
             :min="min"
             :max="max"
             :step="step"
             type="range"/>
    </div>
    <span class="uk-margin-small-left">{{ state.max }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, toRaw } from 'vue'

export default defineComponent({
  props: ['min', 'max', 'step', 'value'],

  emits: ['update'],

  setup (props, { emit }) {
    const state = reactive({
      min: props.value ? props.value.min : props.min,
      max: props.value ? props.value.max : props.max
    })

    watch(
      () => state.min,
      (value) => {
        state.max = Math.max(value, state.max)
      }
    )

    watch(
      () => state.max,
      (value) => {
        state.min = Math.min(state.min, value)
      }
    )

    watch(state, () => {
      emit('update', { ...toRaw(state) })
    })

    return {
      state
    }
  }
})
</script>

<style lang="scss" scoped>

.slider {
  @mixin track() {
    background: none;
  }

  @mixin thumb() {
    pointer-events: auto
  }

  position: relative;
  background: #ebebeb;
  height: 3px;
  border-radius: 500px;

  .uk-range {
    &::-webkit-slider-runnable-track,
    &::-webkit-slider-thumb, & {
      -webkit-appearance: none
    }

    position: absolute;
    pointer-events: none;

    &::-webkit-slider-runnable-track {
      @include track
    }

    &::-moz-range-track {
      @include track
    }

    &::-webkit-slider-thumb {
      @include thumb
    }

    &::-moz-range-thumb {
      @include thumb
    }
  }
}
</style>

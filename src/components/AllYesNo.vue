<template>
  <label v-for="{label, value} of values"
         :key="label"
         class="uk-margin-small-right">
    <input class="uk-radio"
           type="radio"
           :value="value"
           v-model="val"
           :disabled="filter && filterCount(value) === 0"/>
    {{ label }} {{ filter ? `(${filterCount(value)})` : ''}}
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { filter } from '@/lib/filter'

export default defineComponent({
  props: ['modelValue', 'boats', 'filters', 'filter'],
  emits: ['update:modelValue'],
  data () {
    return {
      values: [
        { label: 'Alle', value: null },
        { label: 'Ja', value: true },
        { label: 'Nee', value: false }
      ]
    }
  },
  computed: {
    val: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    filterCount (value: boolean | null): number {
      return filter(this.boats, {
        ...this.filters,
        [this.filter]: value
      }).length
    }
  }
})
</script>

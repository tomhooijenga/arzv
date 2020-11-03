<template>
  <div class="uk-container">
    <filterses @filter="updateList" :filters="filters"></filterses>
    <date />
    <div class="boats">
      <boat v-for="boat in boats"
            :key="boat.name"
            :boat="boat"
            :selected="selected.has(boat)"
            @click="boat.id && toggle(boat)"/>
    </div>
  </div>
</template>

<script lang="ts">
import 'uikit/dist/css/uikit.css'
import { reactive, ref } from 'vue'
import { Boat, boats as boatsList } from './boats'
import boat from './components/Boat.vue'
import filters from './components/Filters.vue'
import { filter } from '@/filter'

export default {
  components: {
    boat,
    // can't have shit in detroit
    filterses: filters
  },
  setup () {
    const filters = reactive<{ }>({
      type: '1x',
      use: null,
      weight: null
    })
    const boats = ref<Boat[]>(boatsList)

    function updateList (newFilters: { }) {
      Object.assign(filters, newFilters)
      boats.value = filter(boatsList, newFilters)
    }

    const selected = reactive<Set<Boat>>(new Set())
    function toggle (boat: Boat) {
      if (selected.has(boat)) {
        selected.delete(boat)
      } else {
        selected.add(boat)
      }
    }

    return {
      filters,
      boats,
      selected,
      updateList,
      toggle
    }
  }
}
</script>

<style lang="scss">
.boats {
  display: grid;
  margin: 0 -0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, auto));
}
</style>

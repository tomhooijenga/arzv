<template>
  <div class="uk-container">
    <filterses @filter="updateList" :filters="filters"></filterses>
    <login v-if="!token"></login>
    <date v-else @reservation="updateActiveReservations" />
    <div class="boats">
      <boat v-for="boat in boats"
            :key="boat.name"
            :boat="boat"
            :selected="selected.has(boat)"
            :reserved="isReserved(boat)"
            @click="boat.id && !isReserved(boat) && toggle(boat)"/>
    </div>
  </div>
</template>

<script lang="ts">
import 'uikit/dist/css/uikit.css'
import { onMounted, reactive, ref, watch } from 'vue'
import { Boat, boats as boatsList } from './boats'
import boat from '@/components/Boat.vue'
import filters from '@/components/Filters.vue'
import login from '@/components/Login.vue'
import date from '@/components/Date.vue'
import { filter } from '@/filter'
import { getReservations, Reservation } from '@/arzv'
import useLocalStorage from '@/use-local-storage'

export default {
  components: {
    boat,
    // can't have shit in detroit
    filterses: filters,
    date,
    login
  },
  setup () {
    const filters = reactive<{ }>({
      type: null,
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

    const reservations = ref<Reservation[]>([])
    const reservedBoats = ref<Set<Boat>>(new Set())
    const userReservation = ref<null | { start: Date; end: Date }>(null)
    const token = useLocalStorage<string>('token')

    function updateActiveReservations (newUserReservation: null | { start: Date; end: Date }) {
      userReservation.value = newUserReservation

      if (newUserReservation === null) {
        reservedBoats.value = new Set()
      } else {
        const { start: userStart, end: userEnd } = newUserReservation
        reservedBoats.value = new Set(
          reservations
            .value
            .filter(({ start, end }) => {
              if (start >= userStart && start <= userEnd) {
                return true
              }
              return end >= userStart && end <= userEnd
            })
            .map(({ boat }) => boat)
        )
      }

      console.log(reservedBoats.value)
    }

    function isReserved (boat: Boat) {
      if (userReservation.value === null) {
        return false
      }

      return reservedBoats.value.has(boat)
    }

    onMounted(async () => {
      if (token) {
        reservations.value = await getReservations(token.value)
      }
    })

    watch(
      () => token.value,
      async () => {
        reservations.value = await getReservations(token.value)
      }
    )

    // todo: show active reservation
    // todo: name & instruction filter
    // todo: add reservation
    // todo: cancel reservation

    return {
      filters,
      boats,
      selected,
      updateList,
      toggle,
      token,
      isReserved,
      updateActiveReservations
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

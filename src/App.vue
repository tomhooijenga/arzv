<template>
  <div class="uk-container">
    <filterses @filter="updateList" :filters="filters"></filterses>
  </div>
  <login v-if="!token" @authenticate="t => token = t"></login>
  <date v-else @reservation="updateActiveReservations" />

  <div class="uk-container">
    <div class="boats">
      <boat v-for="boat in boats"
            :key="boat.name"
            :boat="boat"
            :selected="selected.has(boat)"
            :reservation="reservation(boat)"
            @click="boat.id && !reservation(boat) && toggle(boat)"/>
    </div>
  </div>
</template>

<script lang="ts">
import 'uikit/dist/css/uikit.css'
import { onMounted, reactive, ref, watch, toRaw } from 'vue'
import { Boat, boats as boatsList } from './boats'
import boat from '@/components/Boat.vue'
import filters from '@/components/Filters.vue'
import login from '@/components/Login.vue'
import date from '@/components/Date.vue'
import { filter } from '@/filter'
import { checkToken, getReservations, Reservation } from '@/arzv'
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
    const reservedBoats = ref<Map<Boat, Reservation>>(new Map<Boat, Reservation>())
    const userReservation = ref<null | { start: Date; end: Date }>(null)
    const token = useLocalStorage<string>('token')

    function updateActiveReservations (newUserReservation: null | { start: Date; end: Date }) {
      userReservation.value = newUserReservation

      if (newUserReservation === null) {
        reservedBoats.value = new Map()
      } else {
        const { start: userStart, end: userEnd } = newUserReservation
        reservedBoats.value = new Map(
          reservations
            .value
            .filter(({ start, end }) => {
              if (start >= userStart && start <= userEnd) {
                return true
              }
              return end >= userStart && end <= userEnd
            })
            .map((reservation) => [reservation.boat, reservation])
        )
      }
    }

    function reservation (boat: Boat) {
      if (userReservation.value === null) {
        return null
      }

      return reservedBoats.value.get(boat)
    }

    onMounted(async () => {
      if (token) {
        const valid = await checkToken(token.value)
        if (valid) {
          reservations.value = await getReservations(token.value)
        } else {
          token.value = ''
        }
      }
    })

    watch(
      () => token.value,
      async (to) => {
        if (to) {
          reservations.value = await getReservations(token.value)
        }
      }
    )

    // todo: check token
    // todo: show active reservation
    // todo: cancel reservation
    // todo: name & instruction filter
    // todo: add reservation

    return {
      filters,
      boats,
      selected,
      updateList,
      toggle,
      token,
      reservation,
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

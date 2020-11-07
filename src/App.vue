<template>
  <div class="uk-container">
    <filterses @filter="updateList" :filters="filters"></filterses>
  </div>
  <login v-if="!auth" @authenticate="setAuthentication"></login>
  <date v-else
        @reservation="updateActiveReservations"
        :auth="auth"
        :reservations="reservations"/>

  <div class="uk-container">
    <boat-list>
      <boat v-for="boat in boats"
            :key="boat.name"
            :boat="boat"
            :selected="selected.has(boat)"
            :reservation="boatReservation(boat)"
            @click="boat.id && !boatReservation(boat) && toggle(boat)"/>
    </boat-list>
  </div>

  <reserve :boats="Array.from(selected)"
           :reservation="userReservation"
           :auth="auth"
           v-if="auth"
           @unselect="boat => selected.delete(boat)"
           @reserve="onReserve"/>
</template>

<script lang="ts">
import 'uikit/dist/css/uikit.css'
import { onMounted, reactive, ref, watch } from 'vue'
import { Boat, boats as boatsList } from './boats'
import { filter } from '@/filter'
import { Auth, checkToken, getOwnReservations, getReservations, Reservation } from '@/arzv'
import useLocalStorage from '@/use-local-storage'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import date from '@/components/Date.vue'
import filters from '@/components/Filters.vue'
import login from '@/components/Login.vue'
import reserve from '@/components/Reserve.vue'

export default {
  components: {
    boat,
    boatList,
    date,
    // can't have shit in detroit
    filterses: filters,
    login,
    reserve
  },
  setup () {
    const initialFilters = useLocalStorage('filters')
    const filters = reactive<{ }>(initialFilters.value)
    const boats = ref<Boat[]>(boatsList)

    function updateList (newFilters: { }) {
      Object.assign(filters, newFilters)
      boats.value = filter(boatsList, newFilters)
    }

    if (!initialFilters.value) {
      initialFilters.value = {
        type: null,
        use: null,
        weight: null
      }
    } else {
      updateList(initialFilters.value)
    }

    const selected = reactive<Set<Boat>>(new Set())
    function toggle (boat: Boat) {
      if (selected.has(boat)) {
        selected.delete(boat)
      } else {
        selected.add(boat)
      }
    }

    const auth = useLocalStorage<Auth>('auth')
    function setAuthentication (newAuth: { token: string; id: string }) {
      auth.value = newAuth
    }

    const reservations = ref<Reservation[]>([])
    const reservedBoats = ref<Map<Boat, Reservation>>(new Map<Boat, Reservation>())
    const userReservation = ref<null | { start: Date; end: Date }>(null)

    function updateActiveReservations (newUserReservation: { start: Date; end: Date }) {
      userReservation.value = newUserReservation

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

    function boatReservation (boat: Boat) {
      if (userReservation.value === null) {
        return null
      }

      return reservedBoats.value.get(boat)
    }

    onMounted(async () => {
      if (auth.value) {
        const valid = await checkToken(auth.value)
        if (valid) {
          reservations.value = await getReservations(auth.value)
        } else {
          // auth.value = null
        }
      }
    })

    watch(auth, async (newAuth) => {
      if (newAuth) {
        reservations.value = await getReservations(newAuth)
      }
    })

    async function onReserve () {
      selected.clear()
      reservations.value = await getReservations(auth.value)
      updateActiveReservations(userReservation.value!)
    }

    // v todo: check token
    // v todo: show active reservation
    // v todo: cancel reservation
    // todo: name & instruction filter
    // v todo: add reservation
    // todo: dynamic boats

    return {
      filters,
      boats,
      selected,
      updateList,
      toggle,
      auth,
      setAuthentication,
      reservations,
      userReservation,
      boatReservation,
      updateActiveReservations,
      onReserve
    }
  }
}
</script>

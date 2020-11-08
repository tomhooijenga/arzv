<template>
  <login :show="!auth"></login>
  <div class="uk-container">
    <filterses></filterses>
  </div>
  <date />

  <div class="uk-container">
    <boat-list>
      <boat v-for="boat in activeBoats"
            :key="boat.name"
            :boat="boat"
            :selected="selected.has(boat)"
            :reservation="boatReservation(boat.name)"
            @click="boat.id && !boatReservation(boat) && toggle(boat)"/>
    </boat-list>
  </div>

  <reserve :boats="Array.from(selected)"
           @unselect="boat => selected.delete(boat)"
           @reserve="selected.clear()"/>
</template>

<script lang="ts">
import 'uikit/dist/css/uikit.css'
import { onMounted, reactive, watch, computed } from 'vue'
import { filter } from '@/filter'
import { checkToken } from '@/arzv'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import date from '@/components/Date.vue'
import filters from '@/components/Filters.vue'
import login from '@/components/Login.vue'
import reserve from '@/components/Reserve.vue'
import { Auth, Boat } from '@/types'
import { useAuth } from '@/effects/use-auth'
import { useFilters } from '@/effects/use-filters'
import { useBoats } from '@/effects/use-boats'
import { useReservations } from '@/effects/use-reservations'

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
    const { auth, setAuth } = useAuth()
    const { filters } = useFilters()
    const { boats, loadBoats } = useBoats()
    const { reservations, reservationDate, loadReservations } = useReservations()

    watch(auth, (to: Auth) => {
      if (to) {
        loadBoats(to)
        loadReservations(to)
      }
    })

    onMounted(async () => {
      let valid = false

      if (auth.value) {
        valid = await checkToken(auth.value)
      }

      if (!valid) {
        setAuth(null)
      } else {
        loadBoats(auth.value)
        loadReservations(auth.value)
      }
    })

    const activeBoats = computed(() => {
      return filter(boats.value, filters)
    })

    const selected = reactive<Set<Boat>>(new Set())
    function toggle (boat: Boat) {
      if (selected.has(boat)) {
        selected.delete(boat)
      } else {
        selected.add(boat)
      }
    }

    const reservedBoats = computed(() => {
      if (!reservationDate.value) {
        return new Map()
      }

      const { start: userStart, end: userEnd } = reservationDate.value

      return new Map(
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
    })

    function boatReservation (boat: string) {
      return reservedBoats.value.get(boat)
    }

    // v todo: check token
    // v todo: show active reservation
    // v todo: cancel reservation
    // v todo: name & instruction filter
    // v todo: add reservation
    // v todo: dynamic boats
    // v todo: timezones fuckery
    // todo: move to server
    // todo: mobile + bottom sheet

    return {
      filters,
      activeBoats,
      selected,
      toggle,
      auth,
      reservations,
      boatReservation
    }
  }
}
</script>

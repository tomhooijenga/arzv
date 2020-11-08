<template>
  <login :show="!auth"></login>
  <div class="uk-container">
    <filterses></filterses>
  </div>
  <date @reservation="updateActiveReservations"
        :reservations="reservations"/>

  <div class="uk-container">
    <boat-list>
      <boat v-for="boat in activeBoats"
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
import { onMounted, reactive, ref, watch, computed } from 'vue'
import { filter } from '@/filter'
import { checkToken, getReservations } from '@/arzv'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import date from '@/components/Date.vue'
import filters from '@/components/Filters.vue'
import login from '@/components/Login.vue'
import reserve from '@/components/Reserve.vue'
import { Auth, Boat, Reservation } from '@/types'
import { useAuth } from '@/effects/use-auth'
import { useFilters } from '@/effects/use-filters'
import { useBoats } from '@/effects/use-boats'

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

    watch(auth, (to: Auth) => {
      if (to) {
        loadBoats(to)
      }
    })

    onMounted(() => {
      if (auth.value) {
        loadBoats(auth.value)
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
          setAuth(null)
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
      reservations.value = await getReservations(auth.value!)
      updateActiveReservations(userReservation.value!)
    }

    // v todo: check token
    // v todo: show active reservation
    // v todo: cancel reservation
    // v todo: name & instruction filter
    // v todo: add reservation
    // v todo: dynamic boats
    // todo: timezones fuckery
    // todo: move to server
    // todo: mobile + bottom sheet

    return {
      filters,
      activeBoats,
      selected,
      toggle,
      auth,
      reservations,
      userReservation,
      boatReservation,
      updateActiveReservations,
      onReserve
    }
  }
}
</script>

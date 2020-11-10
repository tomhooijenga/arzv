<template>
  <login :show="!auth"></login>
  <div class="uk-container">
    <filterses></filterses>
  </div>
  <date/>

  <div class="uk-container">
    <transition name="fade" mode="out-in">
      <boat-list :key="activeBoats.length">
        <template v-if="boats.length === 0">
          <boat-placeholder v-for="n in 10"
                            :key="n"/>
        </template>
        <boat v-for="boat in activeBoats"
              :key="boat.name"
              :boat="boat"
              :reservation="boatReservation(boat.name)"
              :selected="selected.has(boat)"
              :disabled="!boat.id || boatReservation(boat.name)"
              @click="boat.id && !boatReservation(boat.name) && toggle(boat)"/>
      </boat-list>
    </transition>
  </div>

  <reserve :boats="Array.from(selected)"
           @reserve="selected.clear()"
           @unselect="boat => selected.delete(boat)"/>
</template>

<script lang="ts">
import 'uikit/dist/css/uikit.css'
import { computed, onMounted, reactive, watch } from 'vue'
import { filter } from '@/filter'
import { checkToken } from '@/arzv'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import boatPlaceholder from '@/components/BoatPlaceholder.vue'
import date from '@/components/Date.vue'
import filters from '@/components/Filters.vue'
import login from '@/components/Login.vue'
import reserve from '@/components/Reserve.vue'
import { Auth, Boat } from '@/types'
import { useAuth } from '@/effects/use-auth'
import { useFilters } from '@/effects/use-filters'
import { useBoats } from '@/effects/use-boats'
import { useReservations } from '@/effects/use-reservations'
import { areIntervalsOverlapping } from 'date-fns'

export default {
  components: {
    boat,
    boatList,
    boatPlaceholder,
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

      return new Map(
        reservations
          .value
          .filter((reservation) => areIntervalsOverlapping(reservation, reservationDate.value!))
          .map((reservation) => [reservation.boat, reservation])
      )
    })

    function boatReservation (boat: string) {
      return reservedBoats.value.get(boat)
    }

    const activeBoats = computed(() => {
      let active = filter(boats.value, filters)

      // reserved filter depends on the active reservations
      if (filters.reserved !== null) {
        active = active.filter((boat) => {
          return reservedBoats.value.has(boat.name) === filters.reserved
        })
      }

      return active
    })

    return {
      filters,
      boats,
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0
}
</style>

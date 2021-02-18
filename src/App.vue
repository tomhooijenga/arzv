<template>
  <login :show="!auth"></login>
  <weather />
  <date/>
  <div class="uk-container">
    <filters />
  </div>
  <div class="uk-container">
    <transition name="fade" mode="out-in">
      <section v-if="!loading && activeBoats.length === 0"
               class="uk-padding-large uk-margin-large-top uk-flex uk-flex-center">
        <icon name="search" class="uk-heading-large uk-margin-right uk-margin-remove-bottom"></icon>
        <div>
          <p class="uk-text-meta">Er zijn geen resultaten met deze filters. </p>
          <button @click="clearFilters"
                  type="button"
                  class="uk-button uk-button-default">
            Filters wissen
          </button>
        </div>
      </section>
      <boat-list v-else :key="activeBoats.length">
        <template v-if="loading">
          <boat-placeholder v-for="n in 10"
                            :key="n"/>
        </template>
        <boat v-for="boat in activeBoats"
              :key="boat.name"
              :boat="boat"
              :reservation="boatReservation(boat.name)"
              :selected="selected.has(boat)"
              :disabled="!boat.id || !!boatReservation(boat.name)"
              :icon="selected.has(boat) ? 'remove' : 'add'"
              @click="boat.id && !boatReservation(boat.name) && toggle(boat)"/>
      </boat-list>
    </transition>
  </div>

  <reserve :boats="Array.from(selected)"
           @reserve="selected.clear()"
           @unselect="boat => selected.delete(boat)"/>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { filter } from '@/lib/filter'
import { checkToken } from '@/lib/arzv'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import boatPlaceholder from '@/components/BoatPlaceholder.vue'
import date from '@/components/Date.vue'
import filters from '@/components/Filters.vue'
import login from '@/components/Login.vue'
import reserve from '@/components/Reserve.vue'
import weather from '@/components/Weather.vue'
import { Auth, Boat } from '@/types'
import { useAuth } from '@/effects/use-auth'
import { useFilters } from '@/effects/use-filters'
import { useBoats } from '@/effects/use-boats'
import { useReservations } from '@/effects/use-reservations'
import { useWeather } from '@/effects/use-weather'
import { areIntervalsOverlapping } from 'date-fns'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  components: {
    Icon,
    boat,
    boatList,
    boatPlaceholder,
    date,
    filters,
    login,
    reserve,
    weather
  },
  setup () {
    const { auth, setAuth } = useAuth()
    const { filters, clearFilters } = useFilters()
    const { boats, loadBoats } = useBoats()
    const { reservations, reservationDate, loadReservations, loadOwnReservations, pollReservations } = useReservations()
    const { loadWeather, pollWeather } = useWeather()

    const loading = ref(true)

    function load (auth: Auth): void {
      loadBoats(auth).then(() => {
        loading.value = false
      })
      loadReservations(auth)
      loadOwnReservations(auth)
      loadWeather()

      pollReservations(auth)
      pollWeather()
    }

    watch(auth, (to: Auth) => {
      if (to) {
        load(to)
      }
    })

    onMounted(async () => {
      let valid = false

      if (auth.value) {
        valid = await checkToken(auth.value)
      }

      if (valid) {
        load(auth.value)
      } else {
        setAuth(null)
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
      loading,
      activeBoats,
      selected,
      toggle,
      auth,
      reservations,
      boatReservation,
      clearFilters
    }
  }
})
</script>

<style lang="scss">
@import '@/assets/uikit';
@import '@/assets/global';
</style>

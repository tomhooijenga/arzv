<template>
  <div class="uk-container">
    <h1 class="uk-margin-top uk-margin">Jouw reserveringen</h1>

    <transition name="fade" mode="out-in">
      <section v-if="loadingOwnReservations">
        <span class="uk-h3 uk-margin skeleton-text">woensdag 28 april</span>
        <boat-list class="uk-margin-bottom">
          <boat-placeholder />
        </boat-list>
      </section>

      <section v-else-if="Object.keys(ownGrouped).length">
        <template v-for="({date, items}) in ownGrouped"
                  :key="date">
          <h3 class="uk-margin">{{ $formatDate(date, 'eeee d MMMM') }}</h3>
          <boat-list class="uk-margin-bottom">
            <boat v-for="reservation in items"
                  :key="reservation.start"
                  :boat="findBoatByName(reservation.boat)"
                  :reservation="reservation"
                  :disabled="cancelling.has(reservation)"
                  icon="clear"
                  @clear="onCancel(reservation)"/>
          </boat-list>
        </template>
      </section>

      <p v-else>
        Je hebt geen actieve reserveringen.
      </p>
    </transition>
  </div>
  <hr/>

  <div class="uk-container">
    <h1 class="uk-margin-top uk-margin">
      Ook op het water

      <span class="uk-button-group">
        <button :class="{'button-group-active': view === 'timeline'}"
                class="uk-button uk-button-default uk-button-small uk-text-large uk-width-1-1"
                @click="view = 'timeline'">
          <icon name="sort"/>
        </button>
        <button :class="{'button-group-active': view === 'list'}"
                class="uk-button uk-button-default uk-button-small uk-text-large uk-width-1-1"
                @click="view = 'list'">
          <icon name="list"/>
        </button>
      </span>
    </h1>
    <div v-if="loadingReservations" class="uk-margin-xlarge-top uk-margin-xlarge-bottom uk-flex">
      <spinner />
    </div>

    <section v-else-if="Object.keys(allGrouped).length"
             v-for="({date, items}) in allGrouped"
             :key="date"
             class=" uk-margin">
      <h3>{{ $formatDate(date, 'eeee d MMMM') }}</h3>
      <div v-if="view === 'list'"
           class="uk-container-xsmall">
        <reservations-list v-if="view === 'list'" :reservations="items"/>
      </div>
      <reservations-timeline v-if="view === 'timeline'" :reservations="items"/>
    </section>

    <p v-else>
      Er zijn geen andere reserveringen.
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { format } from 'date-fns'
import { useAuth } from '@/effects/use-auth'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import reservationsList from '@/components/ReservationsList.vue'
import reservationsTimeline from '@/components/ReservationsTimeline.vue'
import { useBoats } from '@/effects/use-boats'
import { useReservations } from '@/effects/use-reservations'
import { OwnReservation } from '@/types'
import Icon from '@/components/Icon.vue'
import BoatPlaceholder from '@/components/BoatPlaceholder.vue'
import Spinner from '@/components/Spinner.vue'

export default defineComponent({

  components: {
    Spinner,
    BoatPlaceholder,
    Icon,
    reservationsList,
    reservationsTimeline,
    boat,
    boatList
  },

  setup () {
    const { auth } = useAuth()
    const { boats } = useBoats()
    const {
      reservations,
      loadingReservations,
      ownReservations,
      loadingOwnReservations,
      cancelReservation
    } = useReservations()

    function groupByStart<T extends { start: Date }> (list: Array<T>) {
      const groups: { [key: string]: { date: Date; items: T[] } } = {}

      list.forEach((item: T) => {
        const date = format(item.start, 'yyyy-MM-dd')

        groups[date] = groups[date] ?? { date: item.start, items: [] }
        groups[date].items.push(item)
      })

      return groups
    }

    const allGrouped = computed(() => groupByStart(reservations.value))
    const ownGrouped = computed(() => groupByStart(ownReservations.value))

    const cancelling = reactive<Set<OwnReservation>>(new Set())

    async function onCancel (reservation: OwnReservation) {
      cancelling.add(reservation)
      await cancelReservation(auth.value, reservation)
      cancelling.delete(reservation)
    }

    function findBoatByName (name: string) {
      return boats.value.find((boat) => boat.name === name)
    }

    const view = ref<'timeline' | 'list'>('timeline')

    return {
      boats,
      allGrouped,
      ownGrouped,
      loadingReservations,
      loadingOwnReservations,
      onCancel,
      cancelling,
      findBoatByName,
      view
    }
  }
})
</script>

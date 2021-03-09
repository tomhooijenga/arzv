<template>
  <div class="uk-container">
    <h1 class="uk-margin-top uk-margin">Jouw reserveringen</h1>
    <p v-if="!Object.keys(ownGrouped).length">
      Je hebt geen actieve reserveringen.
    </p>
    <template v-for="({date, items}) in ownGrouped"
              :key="date">
      <h3 class="uk-margin">{{ $formatDate(date, 'eeee d MMMM') }}</h3>
      <boat-list class="uk-margin-bottom"
                 v-if="boats.length">
        <boat v-for="reservation in items"
              :key="reservation.start"
              :boat="findBoatByName(reservation.boat)"
              :reservation="reservation"
              icon="clear"
              @clear="onCancel(reservation)"/>
      </boat-list>
    </template>
  </div>
  <hr/>

  <h1 class="uk-container uk-container-expand uk-margin-top uk-margin">Ook op het water</h1>
  <p v-if="!Object.keys(allGrouped).length" class="uk-container uk-container-expand">
    Er zijn geen andere reserveringen.
  </p>
  <section v-for="({date, items}) in allGrouped"
           :key="date"
           class="uk-container uk-container-expand uk-margin">
    <h3>{{ $formatDate(date, 'eeee d MMMM') }}</h3>
<!--    <timeline :reservations="items"/>-->
    <reservations-mobile :reservations="items"/>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { format } from 'date-fns'
import { useAuth } from '@/effects/use-auth'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import timeline from '@/components/Timeline.vue'
import { useBoats } from '@/effects/use-boats'
import { useReservations } from '@/effects/use-reservations'
import { OwnReservation } from '@/types'

export default defineComponent({

  components: {
    boat,
    boatList,
    timeline
  },

  setup () {
    const { auth } = useAuth()
    const { boats } = useBoats()
    const { reservations, ownReservations, cancelReservation } = useReservations()

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

    function onCancel (reservation: OwnReservation) {
      cancelReservation(auth.value, reservation)
    }

    function findBoatByName (name: string) {
      return boats.value.find((boat) => boat.name === name)
    }

    return {
      boats,
      allGrouped,
      ownGrouped,
      onCancel,
      findBoatByName
    }
  }
})
</script>

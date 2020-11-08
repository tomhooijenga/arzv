<template>
  <div class="uk-container">
    <h1 class="uk-margin-top uk-margin">Jouw afschrijvingen</h1>
    <p v-if="!Object.keys(ownGrouped).length">
      Je hebt geen actieve afschrijvingen.
    </p>
    <template v-for="({date, items}) in ownGrouped"
              :key="date">
      <h3 class="uk-margin">{{ format('eeee d MMMM', date) }}</h3>
      <boat-list class="uk-margin-bottom">
        <boat v-for="reservation in items"
              :key="reservation.start"
              :boat="findBoatByName(reservation.boat)"
              :removable="true"
              :reservation="reservation"
              @remove="onCancel(reservation)"/>
      </boat-list>
    </template>
  </div>
  <hr/>
  <h1 class="uk-container uk-margin-top uk-margin">Ook op het water</h1>
  <template v-for="({date, items}) in allGrouped"
            :key="date">
    <h3 class="uk-container uk-margin">{{ format('eeee d MMMM', date) }}</h3>
    <section class="uk-container uk-overflow-auto">
      <table class="uk-table uk-table-divider uk-table-small uk-text-nowrap">
        <tr v-for="reservation in items"
            :key="reservation.start">
          <td>{{ format('p', reservation.start) }} - {{ format('p', reservation.end) }}</td>
          <td class="uk-text-italic">{{ reservation.boat }}</td>
          <td>{{ reservation.person }}</td>
        </tr>
      </table>
    </section>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { format } from 'date-fns'
import { formatWithOptions } from 'date-fns/fp'
import nl from 'date-fns/locale/nl'
import { useAuth } from '@/effects/use-auth'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import { useBoats } from '@/effects/use-boats'
import { useReservations } from '@/effects/use-reservations'
import { OwnReservation } from '@/types'

export default defineComponent({

  components: {
    boat,
    boatList
  },

  setup () {
    const { auth } = useAuth()
    const { boats } = useBoats()
    const { reservations, ownReservations, loadOwnReservations, cancelReservation } = useReservations()

    function groupByStart<T extends { start: Date }> (list: Array<T>) {
      const groups: { [key: string]: { date: Date; items: T[] } } = {}

      list.forEach((item: T) => {
        const date = format(item.start, 'yyyy-MM-dd')

        groups[date] = groups[date] ?? { date: item.start, items: [] }
        groups[date].items.push(item)
      })

      return groups
    }

    onMounted(() => {
      if (auth.value) {
        loadOwnReservations(auth.value)
      }
    })

    const allGrouped = computed(() => groupByStart(reservations.value))
    const ownGrouped = computed(() => groupByStart(ownReservations.value))

    function onCancel (reservation: OwnReservation) {
      cancelReservation(auth.value, reservation)
    }

    function findBoatByName (name: string) {
      return boats.value.find((boat) => boat.name === name)
    }

    return {
      allGrouped,
      ownGrouped,
      onCancel,
      findBoatByName,
      format: formatWithOptions({ locale: nl })
    }
  }
})
</script>

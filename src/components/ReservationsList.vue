<template>
  <div class="uk-container">
    <h1 class="uk-margin-top uk-margin">Jouw afschrijvingen</h1>
    <p v-if="!Object.keys(ownReservations).length">
      Je hebt geen actieve afschrijvingen.
    </p>
    <template v-for="({date, items}) in ownReservations"
              :key="date">
      <h3 class="uk-margin">{{ format('eeee d MMMM', date) }}</h3>
      <boat-list class="uk-margin-bottom">
        <boat v-for="reservation in items"
              :key="reservation.start"
              :boat="reservation.boat"
              :removable="true"
              :reservation="reservation"
              @remove="onCancel(reservation)"/>
      </boat-list>
    </template>
  </div>
  <hr/>
  <h1 class="uk-container uk-margin-top uk-margin">Ook op het water</h1>
  <template v-for="({date, items}) in grouped"
            :key="date">
    <h3 class="uk-container uk-margin">{{ format('eeee d MMMM', date) }}</h3>
    <section class="uk-container uk-overflow-auto">
      <table class="uk-table uk-table-divider uk-table-small uk-text-nowrap">
        <tr v-for="reservation in items"
            :key="reservation.start">
          <td>{{ format('p', reservation.start) }} - {{ format('p', reservation.end) }}</td>
          <td class="uk-text-italic">{{ reservation.boat.name }}</td>
          <td>{{ reservation.person }}</td>
        </tr>
      </table>
    </section>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { format } from 'date-fns'
import { formatWithOptions } from 'date-fns/fp'
import nl from 'date-fns/locale/nl'
import { deleteReservation, getOwnReservations, OwnReservation } from '@/arzv'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'

export default defineComponent({

  props: ['auth', 'reservations'],

  components: {
    boat,
    boatList
  },

  setup (props) {
    function groupByStart<T extends { start: Date }> (list: Array<T>) {
      const groups: { [key: string]: { date: Date; items: T[] } } = {}

      list.forEach((item: T) => {
        const date = format(item.start, 'yyyy-MM-dd')

        groups[date] = groups[date] ?? { date: item.start, items: [] }
        groups[date].items.push(item)
      })

      return groups
    }

    const ownReservations = ref({})

    async function refreshOwn () {
      const own = await getOwnReservations(props.auth)
      ownReservations.value = groupByStart(own)
    }

    onMounted(refreshOwn)

    const grouped = computed(() => {
      return groupByStart(props.reservations)
    })

    async function onCancel (reservation: OwnReservation) {
      await deleteReservation(props.auth, reservation)
      refreshOwn()
    }

    return {
      ownReservations,
      grouped,
      onCancel,
      format: formatWithOptions({ locale: nl })
    }
  }
})
</script>

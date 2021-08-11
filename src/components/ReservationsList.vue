<template>
  <section v-for="{date, items} of starts"
           :key="date + items.length"
           class="uk-flex uk-flex-top">
    <div class="date uk-margin-right uk-margin-small-top">
      {{ $formatDate(date, 'p') }}
    </div>
    <div class="boat-column">
      <div v-for="reservation of items"
           :key="reservation.boat"
           class="boat uk-card uk-card-default uk-margin-small-top uk-padding-small"
           :class="boatClass(reservation)">
        <div class="uk-flex">
          <span class="uk-flex-1 uk-text-truncate">{{ reservation.boat }}</span>
          <span class="uk-flex-none uk-text-muted uk-text-small">
            {{ $formatDate(reservation.start, 'p') }} - {{ $formatDate(reservation.end, 'p') }}
          </span>
        </div>
        <div>{{ reservation.person }}</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { BoatUse, Reservation } from '@/types'
import { format } from 'date-fns'
import { useBoats } from '@/effects/use-boats'

export default defineComponent({

  props: {
    reservations: {
      type: Array as PropType<Reservation[]>,
      default: () => []
    }
  },

  setup (props) {
    const { boats } = useBoats()

    function groupByStart (list: Reservation[]) {
      const groups: { [key: string]: { date: Date; items: Reservation[] } } = {}

      list.forEach((item) => {
        const date = format(item.start, 'HH:mm')

        groups[date] = groups[date] ?? { date: item.start, items: [] }
        groups[date].items.push(item)
      })

      return groups
    }

    const starts = computed(() => groupByStart(props.reservations))

    function boatClass (reservation: Reservation) {
      const boat = boats.value.find((boat) => boat.name === reservation.boat)
      const { use } = boat!

      return {
        'boat-general': use === BoatUse.General,
        'boat-competition': use === BoatUse.Competition,
        'boat-youth': use === BoatUse.Youth
      }
    }

    return {
      starts,
      boatClass
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/theme";

.date {
  position: sticky;
  top: 70px;
}

.boat-column {
  flex: 1;
  min-width: 0;
}

.boat {
  border-left: 1px solid transparent;
}

.boat-general {
  border-left-color: $global-success-background;
}

.boat-competition {
  border-left-color: $global-warning-background;
}

.boat-youth {
  border-left-color: $global-primary-background;
}
</style>

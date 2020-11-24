<template>
  <div class="uk-container uk-container-expand">
    <div class="uk-flex">
      <div class="boats">
        <div class="boat"></div>
        <div v-for="{ boat } of tracks" :key="boat"
             class="boat">
          {{ boat }}
          <hr />
        </div>
      </div>

      <div class="tracks uk-overflow-auto">
        <div class="track track-slots">
          <div v-for="slot of slots"
               :key="slot.start"
               class="slot"
               :style="{ width: offset(slot.start, slot.end) + 'px' }">
            {{format('p', slot.start)}}
          </div>
        </div>

        <div
          v-for="{ boat, items: reservations } of tracks"
          :key="boat"
          class="track"
        >
          <div
            v-if="offset(first.start, reservations[0].start)"
            :style="{ width: offset(first.start, reservations[0].start) + 'px' }"
            class="offset"
          >
            <hr />
          </div>
          <template
            v-for="(reservation, index) of reservations"
            :key="reservation.person"
          >
            <div
              v-if="index > 0 && offset(reservations[index - 1].end, reservation.start)"
              :style="{ width: offset(reservations[index - 1].end, reservation.start) + 'px' }"
              class="offset"
            >
              <hr />
            </div>
            <div :style="{ '--width': offset(reservation.start, reservation.end) + 'px' }" class="person">
              <div class="person-inner">
                {{ reservation.person }}
              </div>
            </div>
          </template>
        </div>

        <div class="track track-slots">
          <div v-for="slot of slots"
               :key="slot.start"
               class="slot"
               :style="{ width: offset(slot.start, slot.end) + 'px' }">
            {{format('p', slot.start)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useReservations } from '@/effects/use-reservations'
import { computed, defineComponent } from 'vue'
import { addMinutes, compareAsc, differenceInMinutes } from 'date-fns'
import { Reservation } from '@/types'
import { formatWithOptions } from 'date-fns/fp'
import nl from 'date-fns/locale/nl'

export default defineComponent({
  setup () {
    const { reservations } = useReservations()

    function groupByBoat<T extends Reservation> (list: Array<T>) {
      const groups: { [key: string]: { boat: string; items: T[] } } = {}

      list.forEach((item: T) => {
        const boat = item.boat

        groups[boat] = groups[boat] ?? { boat: item.boat, items: [] }
        groups[boat].items.push(item)
      })

      Object
        .keys(groups)
        .forEach((key) => {
          groups[key].items.sort(({ start: startA }, { start: startB }) => {
            return compareAsc(startA, startB)
          })
        })

      return groups
    }

    const tracks = computed(() => {
      return groupByBoat(reservations.value)
    })

    const SLOT_WIDTH = 100
    function offset (left: Date, right: Date): number {
      const minutes = differenceInMinutes(right, left)
      return (Math.abs(minutes) / 30) * SLOT_WIDTH
    }

    const first = computed(() => {
      return reservations.value.sort(({ start: startA }, { start: startB }) => {
        return compareAsc(startA, startB)
      })[0]
    })
    const slots = computed(() => {
      const sorted = reservations.value.sort(({ start: startA }, { start: startB }) => {
        return compareAsc(startA, startB)
      })

      if (!sorted.length) {
        return []
      }

      const slots = []
      const last = sorted[sorted.length - 1].end
      let slotStart = sorted[0].start
      let slotEnd = addMinutes(slotStart, 30)

      while (slotEnd <= last) {
        slots.push({
          start: slotStart,
          end: slotEnd
        })

        slotStart = slotEnd
        slotEnd = addMinutes(slotStart, 30)
      }

      return slots
    })

    return {
      tracks,
      first,
      offset,
      slots,
      format: formatWithOptions({ locale: nl })
    }
  }
})
</script>

<style scoped lang="scss">
$track-height: 2rem;
$track-padding: .25rem 0;
$slot-width: 100px;

@mixin slot-guides {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    top: $track-height;
    bottom: $track-height;
    transition: background-color .2s linear;
}

.boats {
  flex: 1 0 auto;
}

.boat {
  flex: none;
  height: $track-height;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: $track-padding;
  padding-right: 0.5rem;
}

.tracks {
  position: relative;
}

.track {
  display: flex;
  flex-direction: row;
  height: $track-height;
  padding: $track-padding;
  padding-left: $slot-width / 2;

  &-slots {
    padding-left: 0;
  }

  &:not(&-slots)::before {
    display: block;
    position: absolute;
    content: '';
    background-color: #e5e5e5;
    margin-top: $track-height / 2;
    left: 0;
    height: 1px;
    width: $slot-width / 2;
    transition: background-color .2s linear;
  }

  &:hover::before {
    background-color: #1e87f0;
  }
}

.slot {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;

  &::after {
    @include slot-guides();
    z-index: -1;
    background-color: #e5e5e5;
  }
}

.offset {
  display: flex;
  flex: none;
  box-sizing: border-box;

  hr {
    flex: 1;
    margin: auto;
    transition: border-color .2s linear;

    .track:hover & {
      border-color: #1e87f0;
    }
  }
}

.person {
  flex: none;
  display: flex;
  box-sizing: border-box;
  width: var(--width);

  &-inner {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
  }

  &:hover {
    &::before,
    &::after {
      @include slot-guides();
      background-color: #1e87f0;
    }

    &::after {
      margin-left: var(--width)
    }
  }
}
</style>

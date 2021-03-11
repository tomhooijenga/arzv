<template>
  <div class="uk-flex">
    <div class="boats">
      <div class="boat"></div>
      <div v-for="{ boat } of tracks" :key="boat"
           class="boat">
        {{ boat }}
        <hr/>
      </div>
    </div>

    <div class="tracks uk-overflow-auto">
      <div class="track track-slots">
        <div v-for="slot of slots"
             :key="slot"
             class="slot">
          {{ slot }}
        </div>
      </div>
      <div
        v-for="{ boat, items: reservations } of tracks"
        :key="boat"
        class="track"
      >
        <div
          v-if="offset(first.start, reservations[0].start)"
          :style="{ '--slots': offset(first.start, reservations[0].start) }"
          class="offset"
        >
          <hr/>
        </div>
        <template
          v-for="(reservation, index) of reservations"
          :key="reservation.person"
        >
          <div
            v-if="index > 0 && offset(reservations[index - 1].end, reservation.start)"
            :style="{ '--slots': offset(reservations[index - 1].end, reservation.start) }"
            class="offset"
          >
            <hr/>
          </div>
          <div :style="{ '--slots': offset(reservation.start, reservation.end) }" class="person">
            <div class="person-inner uk-text-truncate" :title="reservation.person">
              {{ reservation.person }}
            </div>
          </div>
        </template>
      </div>

      <div class="track track-slots">
        <div v-for="slot of slots"
             :key="slot"
             class="slot">
          {{ slot }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { compareAsc, differenceInMinutes, max, min } from 'date-fns'
import { Reservation } from '@/types'
import { slotsRange } from '@/lib/time-slots'

export default defineComponent({

  props: {
    reservations: {
      type: Array as PropType<Reservation[]>,
      default: []
    }
  },

  setup (props) {
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

    const tracks = computed(() => groupByBoat(props.reservations))

    function offset (left: Date, right: Date): number {
      const minutes = differenceInMinutes(right, left)
      return Math.ceil(Math.abs(minutes) / 30)
    }

    const first = computed(() => {
      return [...props.reservations].sort(({ start: startA }, { start: startB }) => {
        return compareAsc(startA, startB)
      })[0]
    })

    const slots = computed<string[]>(() => {
      const first = min(props.reservations.map(({ start }) => start))
      const last = max(props.reservations.map(({ end }) => end))
      return slotsRange(first, last)
    })

    return {
      tracks,
      first,
      offset,
      slots
    }
  }
})
</script>

<style scoped lang="scss">
@import "@/assets/theme";

$track-height: 2rem;
$track-padding: .25rem;
$slot-width: 100px;
$guide-color: $global-border;
$guide-color-hover: $global-primary-background;
$guide-width: 1px;

@mixin slot-guides {
  content: '';
  display: block;
  position: absolute;
  width: $guide-width;
  top: $track-height;
  bottom: $track-height;
  transition: all .2s linear;
}

.boats {
  white-space: nowrap;
}

.boat {
  height: $track-height;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: $track-padding 0.5rem $track-padding 0;
}

.tracks {
  position: relative;
}

.track {
  display: flex;
  width: max-content;
  height: $track-height;
  padding: $track-padding 0 $track-padding ($slot-width / 2);

  &-slots {
    padding-left: 0;
  }

  &:not(&-slots)::before {
    display: block;
    position: absolute;
    content: '';
    background-color: $guide-color;
    margin-top: calc(#{$track-height / 2} - 0.5px);
    left: 0;
    height: 1px;
    width: $slot-width / 2;
    transition: background-color .2s linear;
  }

  &:hover::before {
    background-color: $guide-color-hover;
  }
}

.slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $slot-width;

  &::after {
    @include slot-guides();
    z-index: -1;
    background-color: $guide-color;
  }
}

.offset {
  display: flex;
  box-sizing: border-box;
  width: calc(var(--slots) * #{$slot-width});

  hr {
    flex: 1;
    margin: auto;
    transition: border-color .2s linear;

    .track:hover & {
      border-color: $guide-color-hover;
    }
  }
}

.person {
  width: calc(var(--slots) * #{$slot-width});

  &-inner {
    background: $global-muted-background;
    margin: 0 0.125rem;
    padding: 0 0.125rem;
    line-height: $track-height;
    text-align: center;
  }

  &-sticky {
    position: sticky;
    left: 0;
  }

  &::before,
  &::after {
    @include slot-guides();
    background-color: $guide-color-hover;
    opacity: 0;
  }

  &::after {
    margin-left: calc(var(--slots) * #{$slot-width});
  }

  &:hover {
    &::before,
    &::after {
      opacity: 1;
    }
  }
}
</style>

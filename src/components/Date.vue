<template>
  <div class="uk-section uk-section-muted uk-margin-small-bottom uk-form-stacked">
    <div class="uk-container">
      <div class="uk-button-group uk-width-1-1">
        <button v-for="{label, value} of days"
                :key="label + value"
                :class="{'button-group-active': state.day === value}"
                class="uk-button uk-button-default uk-width-1-1"
                type="button"
                @click="state.day = value">
          {{ label }}
        </button>
      </div>

      <div class="uk-flex uk-margin-small">
        <div class="uk-width-1-2">
          <label class="uk-form-label">van</label>
          <select v-model="state.start"
                  class="uk-select">
            <option v-for="time in starts"
                    :key="time">
              {{ time }}
            </option>
          </select>
        </div>

        <div class="uk-width-1-2">
          <label class="uk-form-label">tot</label>
          <select v-model="state.end"
                  class="uk-select">
            <option v-for="time in ends"
                    :key="time">
              {{ time }}
            </option>
          </select>
        </div>
      </div>
      <hr/>
      <div class="uk-flex uk-margin">
        <button class="uk-button uk-button-link uk-margin-auto"
                type="button"
                @click="state.showReservations = true">
          Bekijk {{ reservations.length }} reserveringen
        </button>
      </div>
    </div>
  </div>

  <bottom-sheet :full="true"
                :show="state.showReservations"
                @close="state.showReservations = false">
    <template v-slot:title>
      Reserveringen
    </template>
    <template v-slot>
      <reservations-sheet/>
    </template>
  </bottom-sheet>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { addDays, parse, setHours, startOfDay, startOfHour } from 'date-fns'
import formatLocale from '@/lib/date-format'
import bottomSheet from '@/components/BottomSheet.vue'
import reservationsSheet from '@/components/ReservationsSheet.vue'
import { useReservations } from '@/effects/use-reservations'
import { slotsRange } from '@/lib/time-slots'

export default defineComponent({

  components: {
    bottomSheet,
    reservationsSheet
  },

  setup () {
    const { setReservationDate, reservations } = useReservations()

    const now = new Date()
    const THIRD_DAY_START = startOfHour(setHours(now, 22))
    const DEFAULT_DAY = 1

    const state = reactive({
      day: DEFAULT_DAY,
      start: '08:00',
      end: '09:00',
      showReservations: false
    })

    const days = computed(() => {
      const options = [
        { label: 'vandaag', value: 0 },
        { label: 'morgen', value: 1 }
      ]

      if (now >= THIRD_DAY_START) {
        options.push({
          label: formatLocale(addDays(now, 2), 'EEEE'),
          value: 2
        })
      }

      return options
    })

    const starts = computed(() => {
      const start = state.day === 0 ? now : startOfDay(now)
      const end = setHours(startOfDay(now), 23)
      return slotsRange(start, end)
    })

    watch(starts, () => {
      state.start = starts.value.includes(state.start) ? state.start : starts.value[0]
    })

    const ends = computed(() => {
      return [
        ...starts.value.slice(starts.value.indexOf(state.start) + 1),
        '23:30'
      ]
    })

    watch(ends, () => {
      state.end = ends.value.includes(state.end) ? state.end : ends.value[0]
    })

    setReservationDate({
      start: parse(state.start, 'HH:mm', addDays(now, DEFAULT_DAY)),
      end: parse(state.end, 'HH:mm', addDays(now, DEFAULT_DAY))
    })
    watch(state, () => {
      const day = addDays(now, state.day)

      setReservationDate({
        start: parse(state.start, 'HH:mm', day),
        end: parse(state.end, 'HH:mm', day)
      })
    })

    return {
      state,
      days,
      starts,
      ends,
      reservations
    }
  }
})
</script>

<style lang="scss" scoped>
  .uk-button-group > .uk-button {
    padding-left: 0;
    padding-right: 0;
  }
</style>

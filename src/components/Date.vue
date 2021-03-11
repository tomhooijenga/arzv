<template>
  <div class="uk-section uk-section-muted uk-margin-small-bottom uk-form-stacked">
    <div class="uk-container">
      <div class="uk-button-group uk-width-1-1">
        <button :class="{'button-group-active': state.day === state.today}"
                class="uk-button uk-button-default uk-width-1-1"
                type="button"
                @click="state.day = state.today">
          Vandaag
        </button>
        <button :class="{'button-group-active': state.day === state.tomorrow}"
                class="uk-button uk-button-default uk-width-1-1"
                type="button"
                @click="state.day = state.tomorrow">
          Morgen
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

        <div class=" uk-width-1-2">
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
import { addDays, format, setHours, startOfDay } from 'date-fns'
import bottomSheet from '@/components/BottomSheet.vue'
import reservationsSheet from '@/components/ReservationsSheet.vue'
import { useReservations } from '@/effects/use-reservations'
import { slotsRange } from '@/lib/time-slots'

const dateFormat = 'yyyy-MM-dd'

export default defineComponent({

  components: {
    bottomSheet,
    reservationsSheet
  },

  setup () {
    const { setReservationDate, reservations } = useReservations()

    const now = new Date()
    const state = reactive({
      day: '',
      start: '08:00',
      end: '09:00',
      today: format(now, dateFormat),
      tomorrow: format(addDays(now, 1), dateFormat),
      showReservations: false
    })

    state.day = state.tomorrow

    const starts = computed(() => {
      const now = new Date()
      const start = state.day === state.today ? now : startOfDay(now)
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
      start: new Date(`${state.day} ${state.start}`),
      end: new Date(`${state.day} ${state.end}`)
    })
    watch(state, () => {
      setReservationDate({
        start: new Date(`${state.day} ${state.start}`),
        end: new Date(`${state.day} ${state.end}`)
      })
    })

    return {
      state,
      starts,
      ends,
      reservations
    }
  }
})
</script>

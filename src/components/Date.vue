<template>
  <div class="uk-section uk-section-muted uk-margin-small uk-form-stacked">
    <div class="uk-container">
      <div class="uk-button-group uk-width-1-1">
        <label :class="{'uk-background-default': state.day === state.today}"
               class="uk-button uk-button-default uk-width-1-1">
          <input v-model="state.day" :value="state.today" class="uk-hidden" name="start-day" type="radio"/>
          Vandaag
        </label>
        <label :class="{'uk-background-default': state.day === state.tomorrow}"
               class="uk-button uk-button-default uk-width-1-1">
          <input v-model="state.day" :value="state.tomorrow" class="uk-hidden" name="start-day" type="radio"/>
          Morgen
        </label>
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

  <bottom-sheet :full="state.showReservations"
                :show="state.showReservations"
                @close="state.showReservations = false">
    <template v-slot:title>
      Reserveringen
    </template>
    <template v-slot>
      <reservations-list />
    </template>
  </bottom-sheet>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { addDays, format, getHours, getMinutes } from 'date-fns'
import bottomSheet from '@/components/BottomSheet.vue'
import reservationsList from '@/components/ReservationsList.vue'
import { useReservations } from '@/effects/use-reservations'

const dateFormat = 'yyyy-MM-dd'

export default defineComponent({

  components: {
    bottomSheet,
    reservationsList
  },

  setup () {
    const { setReservationDate, reservations } = useReservations()

    const now = new Date()
    const state = reactive({
      day: '',
      start: '08:00',
      end: '08:30',
      today: format(now, dateFormat),
      tomorrow: format(addDays(now, 1), dateFormat),
      showReservations: false
    })

    state.day = state.tomorrow

    const starts = computed(() => {
      let hour = 0
      const _starts = []
      if (state.day === state.today) {
        hour = getHours(now)

        if (getMinutes(now) < 30) {
          _starts.push(`${hour.toString().padStart(2, '0')}:30`)
        }

        hour += 1
      }

      for (let i = hour; i <= 22; i++) {
        _starts.push(`${i.toString().padStart(2, '0')}:00`)
        _starts.push(`${i.toString().padStart(2, '0')}:30`)
      }

      // 23:30 is only for ends
      _starts.push('23:00')

      return _starts
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

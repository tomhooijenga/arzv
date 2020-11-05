<template>
  <div class="uk-background-muted uk-padding uk-margin uk-form-stacked">
    <div class="uk-container">
      <div class="uk-button-group uk-width-1-1">
        <label :class="{'uk-background-muted': state.day === state.today}"
               class="uk-button uk-button-default uk-width-1-1">
          <input v-model="state.day" :value="state.today" class="uk-hidden" name="start-day" type="radio"/>
          Vandaag
        </label>
        <label :class="{'uk-background-muted': state.day === state.tomorrow}"
               class="uk-button uk-button-default uk-width-1-1">
          <input v-model="state.day" :value="state.tomorrow" class="uk-hidden" name="start-day" type="radio"/>
          Morgen
        </label>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label">van</label>
        <select v-model="state.start"
                class="uk-select">
          <option v-for="time in starts"
                  :key="time">
            {{ time }}
          </option>
        </select>
      </div>

      <div>
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { addDays, format, getHours, getMinutes } from 'date-fns'

const dateFormat = 'yyyy-MM-dd'

export default defineComponent({

  emits: ['reservation'],

  setup (_, { emit }) {
    const now = new Date()
    const state = reactive({
      day: '',
      start: '',
      end: '',
      today: format(now, dateFormat),
      tomorrow: format(addDays(now, 1), dateFormat)
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

      for (let i = hour; i <= 23; i++) {
        _starts.push(`${i.toString().padStart(2, '0')}:00`)
        _starts.push(`${i.toString().padStart(2, '0')}:30`)
      }

      return _starts
    })

    state.start = starts.value[0]
    watch(
      () => starts.value,
      () => {
        state.start = starts.value.includes(state.start) ? state.start : starts.value[0]
      }
    )

    const ends = computed(() => {
      return starts.value.slice(starts.value.indexOf(state.start) + 1)
    })

    watch(
      () => ends.value,
      () => {
        state.end = ends.value.includes(state.end) ? state.end : ends.value[0]
      }
    )

    watch(
      () => state,
      () => {
        console.log(state.day, state.start, state.end)
        if (state.day && state.start && state.end) {
          emit('reservation', {
            start: new Date(`${state.day} ${state.start}`),
            end: new Date(`${state.day} ${state.end}`)
          })
        } else {
          emit('reservation', null)
        }
      },
      {
        deep: true
      })

    return {
      state,
      starts,
      ends
    }
  }
})
</script>

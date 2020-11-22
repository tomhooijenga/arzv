<template>
  <bottom-sheet :show="boats.length > 0"
                :full="state.full"
                @open="state.full = true"
                @close="state.full = false">
    <template v-slot:title>
      {{ title }}
    </template>

    <template v-slot>
      <div class="uk-container uk-margin-bottom">
        <boat-list>
          <boat v-for="boat in boats"
                :key="boat.name"
                :boat="boat"
                :selected="true"
                icon="clear"
                @clear="unselectBoat(boat)"/>
        </boat-list>

        <p class="uk-text-center" v-if="!state.valid">
          Deze reservering kan nu niet gemaakt worden. Controleer of de boot bezet is.
        </p>
        <button :disabled="!state.valid"
                class="uk-button uk-button-primary uk-display-block uk-margin-top uk-margin-bottom uk-margin-auto"
                type="button"
                @click="create">
          {{ boats.length === 1 ? '1 boot' : `${boats.length} boten` }} reserveren
        </button>
        <p class="uk-text-center uk-text-meta" v-if="reservationDate">
          {{ format('eeee d MMMM', reservationDate.start) }} van {{ format('HH:mm', reservationDate.start) }} tot {{ format('HH:mm', reservationDate.end) }}
        </p>
        <p class="uk-text-center uk-text-meta" v-if="hasCompetition">
          Wedstrijdboten mogen alleen gebruikt worden met toestemming van de wedstrijdcommissie.
        </p>
        <p class="uk-text-center uk-text-meta" v-if="hasYouth">
          Jeugdboten mogen alleen buiten de jeugd bloktijden gebruikt worden.
        </p>
      </div>
      <div v-if="state.loading"
         class="uk-overlay-default uk-position-cover uk-flex">
        <spinner />
      </div>
    </template>
  </bottom-sheet>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch, computed } from 'vue'
import { checkReservation } from '@/arzv'
import bottomSheet from '@/components/BottomSheet.vue'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import spinner from '@/components/Spinner.vue'
import { formatWithOptions } from 'date-fns/fp'
import nl from 'date-fns/locale/nl'
import { Boat, BoatUse } from '@/types'
import { useAuth } from '@/effects/use-auth'
import { useReservations } from '@/effects/use-reservations'

export default defineComponent({
  props: {
    boats: {
      type: Array as PropType<Boat[]>,
      required: true
    }
  },

  emits: ['unselect', 'reserve'],

  components: {
    bottomSheet,
    boat,
    boatList,
    spinner
  },

  setup (props, { emit }) {
    const { auth } = useAuth()
    const { reservationDate, makeReservation } = useReservations()

    const state = reactive({
      full: false,
      valid: true,
      loading: false
    })

    watch(
      [auth, reservationDate, () => state.full, () => props.boats.length],
      async () => {
        if (auth.value && reservationDate.value && state.full && props.boats.length) {
          state.valid = await checkReservation(auth.value, props.boats, reservationDate.value)
        }
      }
    )

    const title = computed(() => {
      const boats = props.boats

      if (boats.length === 0) {
        return ' '
      }
      if (boats.length === 1) {
        return boats[0].name
      }
      if (boats.length === 2) {
        return `${boats[0].name} en ${boats[1].name}`
      }
      return `${boats[0].name}, ${boats[1].name} en ${boats.length - 2} ${boats.length - 2 === 1 ? 'andere' : 'anderen'}`
    })

    const hasCompetition = computed(() => props.boats.some(({ use }) => use === BoatUse.Competition))
    const hasYouth = computed(() => props.boats.some(({ use }) => use === BoatUse.Youth))

    function unselectBoat (boat: Boat): void {
      emit('unselect', boat)

      // Close if it was the last boat
      if (props.boats.length - 1 === 0) {
        state.full = false
      }
    }

    async function create () {
      if (!reservationDate.value) {
        return
      }

      try {
        state.loading = true
        await makeReservation(auth.value, props.boats, reservationDate.value)
        emit('reserve')
      } finally {
        state.loading = false
      }
    }

    return {
      state,
      title,
      hasCompetition,
      hasYouth,
      unselectBoat,
      create,
      reservationDate,
      format: formatWithOptions({ locale: nl })
    }
  }
})
</script>

<style lang="scss" scoped>
.bottom-sheet {
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  bottom: 0;
  transform: translateY(100%);
  transition: transform .2s ease-in-out, height .2s ease-in-out;
  height: 54px;
  overscroll-behavior: none;
}

.show {
  transform: translateY(0);
}

.full {
  height: 100vh;
  overflow-y: auto;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>

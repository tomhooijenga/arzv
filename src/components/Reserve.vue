<template>
  <bottom-sheet :show="boats.length > 0"
                :full="state.full"
                @open="state.full = true"
                @close="state.full = false">
    <template v-slot:title>
      {{ title }}
    </template>

    <template v-slot>
      <div class="uk-container">
        <boat-list>
          <boat v-for="boat in boats"
                :key="boat.name"
                :boat="boat"
                :selected="true"
                :removable="true"
                @remove="unselectBoat(boat)"/>
        </boat-list>

        <button :disabled="!state.valid"
                class="uk-button uk-button-primary uk-display-block uk-margin-top uk-margin-bottom uk-margin-auto"
                type="button"
                @click="create">
          {{ boats.length === 1 ? '1 boot' : `${boats.length} boten` }} afschrijven
        </button>
        <p class="uk-text-center uk-text-meta">
          {{ format('eeee d MMMM', reservation.start) }} van {{ format('HH:mm', reservation.start) }} tot {{ format('HH:mm', reservation.end) }}
        </p>
      </div>
    </template>
  </bottom-sheet>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch, computed } from 'vue'
import { Auth, checkReservation, createReservation, Reservation } from '@/arzv'
import { Boat } from '@/boats'
import bottomSheet from '@/components/BottomSheet.vue'
import boat from '@/components/Boat.vue'
import boatList from '@/components/BoatList.vue'
import { formatWithOptions } from 'date-fns/fp'
import nl from 'date-fns/locale/nl'

export default defineComponent({
  props: {
    boats: {
      type: Array as PropType<Boat[]>,
      required: true
    },
    auth: {
      type: Object as PropType<Auth>,
      required: true
    },
    reservation: Object as PropType<Reservation>
  },

  emits: ['unselect', 'reserve'],

  components: {
    bottomSheet,
    boat,
    boatList
  },

  setup (props, { emit }) {
    const state = reactive({
      full: false,
      valid: true
    })

    watch(
      [() => state.full, () => props.auth, () => props.boats, () => props.reservation],
      async () => {
        if (state.full && props.auth && props.boats && props.reservation) {
          state.valid = await checkReservation(props.auth, props.boats, props.reservation)
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

    function unselectBoat (boat: Boat): void {
      emit('unselect', boat)

      // Close if it was the last boat
      if (props.boats.length - 1 === 0) {
        state.full = false
      }
    }

    async function create () {
      if (props.reservation) {
        await createReservation(props.auth, props.boats, props.reservation)
        emit('reserve')
      }
    }

    return {
      state,
      title,
      unselectBoat,
      create,
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

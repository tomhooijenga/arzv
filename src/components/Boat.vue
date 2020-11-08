<template>
  <div class="uk-card uk-card-default uk-card-small" :class="{selected: selected, 'uk-text-muted': !boat.id}">
    <div class="uk-card-header">
      <h3 class="uk-card-title uk-flex" :class="{'uk-text-muted': !boat.id}">
        <span class="uk-width-1-1 uk-text-truncate">{{ boat.name }}</span>
        <span class="close"
              v-if="removable"
              @click="$emit('remove')">
          &times;
        </span>
      </h3>
    </div>
    <div class=" uk-card-body">
      <div class="uk-flex uk-flex-between uk-margin-small-bottom">
        <span class="uk-text-bold">{{ boat.type }}</span>
        <hr class="uk-divider-vertical uk-height-auto uk-border-pill" />
        <span :class="enabled(boat.scull) ? 'uk-text-primary' : ''">
          {{ boat.scull }}
        </span>
        <span :class="enabled(boat.sweep) ? 'uk-text-primary' : ''">
          {{ boat.sweep }}
        </span>
        <span :class="enabled(boat.steer) ? 'uk-text-primary' : ''">
          {{ boat.steer }}
        </span>
      </div>
      <div class="uk-flex uk-flex-between">
        <span :class="useClass()">{{ boat.use }}</span>
        <span v-if="boat.weight">{{ boat.weight}} kg</span>
        <span v-else>Geen</span>
      </div>
      <div v-if="reservation" class="uk-margin-small-top">
        Afgeschreven {{ formatTime(reservation.start) }} - {{ formatTime(reservation.end) }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { format } from 'date-fns'

export default defineComponent({
  props: {
    boat: Object,
    selected: Boolean,
    reservation: Object,
    removable: Boolean
  },

  emits: ['remove'],

  methods: {
    enabled (permission) {
      return !permission.includes('-')
    },
    useClass () {
      const { id, use } = this.boat

      return {
        'uk-text-danger': !id,
        'uk-text-success': use === 'Algemeen',
        'uk-text-primary': use === 'Wedstrijd',
        'uk-text-warning': use === 'Jeugd'
      }
    },
    formatTime (date) {
      return format(date, 'HH:mm')
    }
  }
})
</script>

<style lang="scss" scoped>
.uk-card {
  border: 1px solid transparent;
  transition: border .2s ease-in-out;
}

.selected {
  border-color: #32d296;
}

.close {
  text-shadow: 0 1px 0 #fff;
}
</style>

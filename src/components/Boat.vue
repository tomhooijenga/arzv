<template>
  <div class="uk-card uk-card-default uk-card-small" :class="{selected: selected, 'uk-text-muted': disabled}">
    <div class="uk-card-header">
      <h3 class="uk-card-title uk-flex" :class="{'uk-text-muted': disabled}">
        <span class="uk-width-1-1 uk-text-truncate">{{ boat.name }}</span>
        <icon :name="icon"
              class="icon uk-margin-auto-vertical"
              v-if="icon"
              @click="$emit(icon)" />
      </h3>
    </div>
    <div class=" uk-card-body">
      <div class="uk-flex uk-flex-between uk-margin-small-bottom">
        <span class="uk-text-bold">{{ boat.type }}</span>
        <hr class="uk-divider-vertical"/>
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
        <span v-if="boat.weight">{{ boat.weight }} kg</span>
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
import { BoatUse } from '@/types'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  props: {
    boat: Object,
    selected: Boolean,
    disabled: Boolean,
    reservation: Object,
    icon: String
  },

  emits: ['remove'],

  components: {
    Icon
  },

  methods: {
    enabled (permission) {
      return !permission.includes('-')
    },
    useClass () {
      const {
        id,
        use
      } = this.boat

      return {
        'uk-text-danger': !id,
        'uk-text-success': use === BoatUse.General,
        'uk-text-primary': use === BoatUse.Competition,
        'uk-text-warning': use === BoatUse.Youth
      }
    },
    formatTime (date) {
      return format(date, 'HH:mm')
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/theme";

.uk-card {
  border: 1px solid transparent;
  transition: border .2s ease-in-out;
}

.uk-divider-vertical {
  margin: 0 20px;
  height: auto;
}

.selected {
  border-color: $global-success-background;
}

.icon {
  cursor: pointer;
}
</style>

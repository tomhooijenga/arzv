<template>
  <div :class="{selected: selected, 'uk-text-muted': disabled}" class="uk-card uk-card-default uk-card-small">
    <div class="uk-card-header">
      <h3 :class="{'uk-text-muted': disabled}" class="uk-card-title uk-flex">
        <span class="uk-width-1-1 uk-text-truncate">{{ boat.name }}</span>
        <icon :name="isFavorite(boat) ? 'favorite' : 'favorite_border'"
              class="icon uk-margin-auto-vertical uk-margin-small-right uk-text-small"
              @click.stop="toggleFavorite(boat)"/>
        <icon v-if="icon"
              :name="icon"
              class="icon uk-margin-auto-vertical"
              @click="$emit(icon)"/>
      </h3>
    </div>
    <div class=" uk-card-body">
      <div class="uk-flex uk-flex-between uk-margin-small-bottom">
        <span class="uk-text-bold">{{ boat.type.join(' / ') }}</span>
        <hr class="uk-divider-vertical"/>
        <span :class="{'uk-text-primary': enabled(boat.scull)}">
          {{ boat.scull }}
        </span>
        <span :class="{'uk-text-primary': enabled(boat.sweep)}">
          {{ boat.sweep }}
        </span>
        <span :class="{'uk-text-primary': enabled(boat.steer)}">
          {{ boat.steer }}
        </span>
      </div>
      <div class="uk-flex uk-flex-between">
        <span :class="useClass()">{{ boat.use }}</span>
        <span v-if="boat.weight">{{ boat.weight }} kg</span>
        <span v-else>Geen</span>
      </div>
      <div v-if="reservation" class="uk-margin-small-top">
        Afgeschreven {{ $formatDate(reservation.start, 'p') }} - {{ $formatDate(reservation.end, 'p') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Boat, BoatUse } from '@/types'
import Icon from '@/components/Icon.vue'
import { useBoats } from '@/effects/use-boats'

export default defineComponent({
  props: {
    boat: {
      type: Object as PropType<Boat>,
      required: true
    },
    selected: Boolean,
    disabled: Boolean,
    reservation: Object,
    icon: String
  },

  emits: ['remove'],

  components: {
    Icon
  },

  setup (props) {
    const { toggleFavorite, isFavorite } = useBoats()

    function enabled (permission: string): boolean {
      return !permission.includes('-')
    }

    function useClass () {
      const { id, use } = props.boat

      return {
        'uk-text-danger': !id,
        'uk-text-success': use === BoatUse.General,
        'uk-text-primary': use === BoatUse.Competition,
        'uk-text-warning': use === BoatUse.Youth
      }
    }

    return {
      enabled,
      useClass,
      toggleFavorite,
      isFavorite
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

<template>
  <div class="uk-card uk-card-default" :class="{selected: selected, 'uk-text-muted': !boat.id}">
    <div class="uk-card-header">
      <h3 class="uk-card-title" :class="{'uk-text-muted': !boat.id}">{{ boat.name }}</h3>
    </div>
    <div class=" uk-card-body">
      <div class="uk-flex uk-flex-between uk-margin-bottom">
        <span class="uk-text-bold">{{ boat.type }}</span>
        <hr class="uk-divider-vertical uk-height-auto" />
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
        <span :class="useClass('text')">{{ boat.use }}</span>
        <span v-if="boat.weight">{{ boat.weight}}kg</span>
        <span v-else>Geen</span>
      </div>
      <div v-if="reservation" class="uk-margin-top">
        Afgeschreven van {{reservation.start}} tot {{reservation.end}}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    boat: Object,
    selected: Boolean,
    reservation: Object
  },
  methods: {
    enabled (permission) {
      return !permission.includes('-')
    },
    useClass (prop) {
      const { id, use } = this.boat

      return {
        [`uk-${prop}-danger`]: !id,
        [`uk-${prop}-success`]: use === 'Algemeen',
        [`uk-${prop}-primary`]: use === 'Wedstrijd',
        [`uk-${prop}-warning`]: use === 'Jeugd'
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.uk-card {
  margin: 0.5rem;
  border: 1px solid transparent;
  transition: border .2s ease-in-out;
}

.selected {
  border-color: #32d296;
}

.uk-card-title {
  white-space: nowrap;
  overflow: auto;
}
</style>

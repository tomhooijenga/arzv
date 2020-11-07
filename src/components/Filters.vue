<template>
  <div class="uk-flex uk-margin-small-top uk-overflow-auto">
    <button class="uk-button uk-button-primary"
            type="button"
            @click="showModal = true">
      Filter&hellip;
    </button>
    <hr class="uk-divider-vertical"/>
      <button v-for="(value, filter) in activeFilters"
              :key="filter"
              class="uk-button uk-button-default uk-border-pill uk-margin-right"
              type="button"
              @click="removeFilter(filter)"
      >
        {{ format(filter, value) }}
        <span class="close">🗙</span>
      </button>

    <button v-if="filters.minWeight && filters.maxWeight"
            class="uk-button uk-button-default uk-border-pill uk-margin-right"
            type="button"
            @click="removeFilter('minWeight'); removeFilter('maxWeight')"
    >
      {{ filters.minWeight }} - {{filters.maxWeight}} kg
      <span class="close">🗙</span>
    </button>
  </div>

  <modal :show="showModal"
         @close="showModal = false">

    <div class="uk-form-stacked">
      <div class="uk-margin">
        <label class="uk-form-label" for="type">Type</label>
        <select id="type"
                v-model="newFilters.type"
                class="uk-select">
          <option :value="null">Alle</option>
          <option v-for="type in types"
                  :key="type">
            {{type}}
          </option>
        </select>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label" for="use">Gebruik</label>
        <select id="use"
                v-model="newFilters.use"
                class="uk-select">
          <option :value="null">Alle</option>
          <option v-for="use in uses"
                  :key="use">
            {{use}}
          </option>
        </select>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label">Gewicht</label>
        <div class="uk-flex">
          <span class="uk-margin-small-right">{{ newFilters.minWeight }}</span>
          <div class="weight-range uk-margin-auto-vertical uk-width-1-1">
            <input v-model="newFilters.minWeight"
                   class="uk-range"
                   max="100"
                   min="50"
                   step="5"
                   type="range"/>
            <input v-model="newFilters.maxWeight"
                   class="uk-range"
                   max="100"
                   min="50"
                   step="5"
                   type="range"/>
          </div>
          <span class="uk-margin-small-left">{{ newFilters.maxWeight }}</span>
        </div>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label" for="name">Naam</label>
        <input id="name"
               v-model="newFilters.name"
               class="uk-input"
               type="text"/>
      </div>

      <div class="uk-margin">
        <span class="uk-form-label">Instructie toegestaan</span>
        <label class="uk-margin-small-right">
          <input v-model="newFilters.instruction"
                 class="uk-radio"
                 type="radio"
                 :value="null"/>
          Alle
        </label>
        <label class="uk-margin-small-right">
          <input v-model="newFilters.instruction"
                 class="uk-radio"
                 type="radio"
                 :value="true"/>
          Ja
        </label>
        <label class="uk-margin-small-right">
          <input v-model="newFilters.instruction"
                 class="uk-radio"
                 type="radio"
                 :value="false"/>
          Nee
        </label>
      </div>

    </div>
    <button class="uk-button uk-button-primary" type="button" @click="commitFilters">Filter</button>
    <button class="uk-button uk-button-default uk-margin-left" type="button" @click="showModal = false">Annuleer</button>
  </modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import { Boat, boats } from '@/boats'
import modal from '@/components/Modal.vue'

function pluck (prop: keyof Boat) {
  return Array.from(new Set(boats.map(boat => boat[prop])))
}

const types = (pluck('type') as string[]).sort((a, b) => a.localeCompare(b))
const uses = pluck('use')

export default defineComponent({
  props: ['filters'],

  emits: ['filter'],

  components: {
    modal
  },

  setup (props, { emit }) {
    const showModal = ref<boolean>(false)
    const newFilters = reactive({ ...props.filters })
    const activeFilters = computed(() => {
      return Object.fromEntries(
        Object.entries(props.filters).filter(([filter, value]) => {
          if (filter === 'minWeight' || filter === 'maxWeight') {
            return false
          }
          return value !== null && value !== ''
        })
      )
    })

    watch(() => newFilters.minWeight, () => {
      newFilters.maxWeight = Math.max(newFilters.minWeight, newFilters.maxWeight)
    })

    watch(() => newFilters.maxWeight, () => {
      newFilters.minWeight = Math.min(newFilters.minWeight, newFilters.maxWeight)
    })

    function removeFilter (filter: string) {
      newFilters[filter] = null
      emit('filter', newFilters)
    }

    function commitFilters () {
      emit('filter', newFilters)
      showModal.value = false
    }

    const filterFormats: {
      [key: string]: (value: string) => string;
    } = {
      name: value => `"${value}"`,
      instruction: value => value ? 'Instructie' : 'Geen instructie'
    }

    function format (filter: string, value: string): string {
      if (filterFormats[filter]) {
        return filterFormats[filter](value)
      }
      return value
    }

    return {
      uses,
      types,
      showModal,
      newFilters,
      activeFilters,
      format,
      removeFilter,
      commitFilters
    }
  }
})
</script>

<style lang="scss">
.uk-divider-vertical {
  margin: 0 20px;
  height: auto;
}

.uk-border-pill {
  display: flex;
  align-items: center;
  padding-right: 0;

  .close {
    font-size: 120%;
    text-shadow: 0 1px 0 #fff;
    padding: 0 10px;
  }
}

.weight-range {
  @mixin track() {
    background: none;
  }

  @mixin thumb() {
    pointer-events: auto
  }

  position: relative;
  background: #ebebeb;
  height: 3px;
  border-radius: 500px;

  .uk-range {
    &::-webkit-slider-runnable-track,
    &::-webkit-slider-thumb, & {
      -webkit-appearance: none
    }

    position: absolute;
    pointer-events: none;

    &::-webkit-slider-runnable-track { @include track }
    &::-moz-range-track { @include track }

    &::-webkit-slider-thumb { @include thumb }
    &::-moz-range-thumb { @include thumb }
  }
}
</style>

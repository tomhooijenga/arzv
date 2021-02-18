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
            class="uk-button uk-button-default uk-border-pill uk-margin-right uk-text-nowrap"
            type="button"
            @click="removeFilter(filter)"
    >
      {{ format(filter, value) }}
      <icon class="clear" name="clear"></icon>
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
            {{ type }}
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
            {{ use }}
          </option>
        </select>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label">Gewicht</label>
        <double-range-slider @update="newFilters.weight = $event"
                             :value="newFilters.weight"
                             :min="weight.min"
                             :max="weight.max"
                             step="5"/>
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

      <div class="uk-margin">
        <span class="uk-form-label">Gereserveerde boten</span>
        <label class="uk-margin-small-right">
          <input v-model="newFilters.reserved"
                 class="uk-radio"
                 type="radio"
                 :value="null"/>
          Alle
        </label>
        <label class="uk-margin-small-right">
          <input v-model="newFilters.reserved"
                 class="uk-radio"
                 type="radio"
                 :value="true"/>
          Ja
        </label>

        <label class="uk-margin-small-right">
          <input v-model="newFilters.reserved"
                 class="uk-radio"
                 type="radio"
                 :value="false"/>
          Nee
        </label>
      </div>
    </div>
    <button class="uk-button uk-button-primary" type="button" @click="commitFilters">Filter</button>
    <button class="uk-button uk-button-default uk-margin-left" type="button" @click="showModal = false">Annuleer
    </button>
  </modal>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import DoubleRangeSlider from '@/components/DoubleRangeSlider.vue'
import Icon from '@/components/Icon.vue'
import Modal from '@/components/Modal.vue'
import { useFilters } from '@/effects/use-filters'
import { useBoats } from '@/effects/use-boats'
import { isEmpty } from '@/lib/filter'
import { Filters } from '@/types'

function pluck<T, K extends keyof T> (items: T[], prop: K): T[K][] {
  return Array.from(new Set(items.map((item) => item[prop])))
}

export default defineComponent({
  components: {
    DoubleRangeSlider,
    Icon,
    Modal
  },

  setup () {
    const showModal = ref<boolean>(false)

    const { filters, setFilters } = useFilters()
    const newFilters = reactive({ ...filters })
    const activeFilters = computed(() => {
      return Object.fromEntries(
        Object
          .entries(filters)
          .filter(([, value]) => !isEmpty(value))
      )
    })

    watch(filters, () => {
      Object.assign(newFilters, filters)
    })

    function removeFilter (filter: keyof Filters) {
      newFilters[filter] = null
      setFilters(newFilters)
    }

    function commitFilters () {
      setFilters(newFilters)
      showModal.value = false
    }

    const filterFormats: { [key: string]: (value: never) => string } = {
      name: (value: string) => `"${value}"`,
      weight: ({ min, max }: { min: number, max: number }) => `${min} - ${max} kg`,
      instruction: (value: boolean) => value ? 'Instructie' : 'Geen instructie',
      reserved: (value: boolean) => value ? 'Gereserveerd' : 'Niet gereserveerd'
    }

    function format (filter: string, value: never): string {
      return filter in filterFormats ? filterFormats[filter](value) : `${value}`
    }

    const { boats } = useBoats()
    const weights = computed(() => {
      return pluck(boats.value, 'weight').filter((weight) => weight !== null) as number[]
    })
    const minWeight = computed(() => Math.min(...weights.value))
    const maxWeight = computed(() => Math.max(...weights.value))

    const types = computed(() => {
      return pluck(boats.value, 'type').sort((a, b) => a.localeCompare(b))
    })
    const uses = computed(() => pluck(boats.value, 'use'))

    return {
      uses,
      types,
      weight: reactive({
        min: minWeight,
        max: maxWeight
      }),
      showModal,
      filters,
      newFilters,
      activeFilters,
      format,
      removeFilter,
      commitFilters
    }
  }
})
</script>

<style lang="scss" scoped>
.uk-divider-vertical {
  margin: 0 20px;
  height: auto;
}

.uk-border-pill {
  display: flex;
  align-items: center;
  padding-right: 0;
}

.clear {
  padding: 0 10px;
  cursor: pointer;
}
</style>

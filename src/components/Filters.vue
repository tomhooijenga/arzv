<template>
  <div class="uk-flex uk-margin-top uk-overflow-auto">
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
        {{ value }}
        <span class="close">🗙</span>
      </button>
  </div>
  <hr/>
  <div v-if="showModal"
       class="uk-modal uk-open uk-flex"
       @click.self="showModal = false">
    <div class="uk-modal-dialog uk-margin-auto-vertical uk-modal-body">
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
          <label class="uk-form-label" for="use">Gewicht</label>
          <div class="uk-flex">
            <input id="weight"
                   v-model="newFilters.weight"
                   class="uk-range"
                   max="100"
                   min="50"
                   step="5"
                   type="range"/>
            <span>{{ newFilters.weight || 'geen' }}</span>
          </div>
        </div>
      </div>
      <button class="uk-button uk-button-primary" type="button" @click="commitFilters">Filter</button>
      <button class="uk-button uk-button-default uk-margin-left" type="button" @click="showModal = false">Annuleer</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { Boat, boats } from '@/boats'

function pluck (prop: keyof Boat) {
  return Array.from(new Set(boats.map(boat => boat[prop])))
}

const types = (pluck('type') as string[]).sort((a, b) => a.localeCompare(b))
const uses = pluck('use')

export default defineComponent({
  props: ['filters'],

  setup (props, { emit }) {
    const showModal = ref<boolean>(false)
    const newFilters = reactive({ ...props.filters })
    const activeFilters = computed(() => {
      return Object.fromEntries(
        Object.entries(props.filters).filter(([, value]) => value !== null)
      )
    })

    function removeFilter (filter: string) {
      newFilters[filter] = null
      emit('filter', newFilters)
    }

    function commitFilters () {
      emit('filter', newFilters)
      showModal.value = false
    }

    return {
      uses,
      types,
      showModal,
      newFilters,
      activeFilters,
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
</style>

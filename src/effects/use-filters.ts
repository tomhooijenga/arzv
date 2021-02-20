import { reactive, watch } from 'vue'
import { Filters } from '@/types'

const EMPTY: Filters = {
  type: null,
  use: null,
  weight: null,
  instruction: null,
  name: '',
  reserved: null,
  favorite: null
}

const filters = reactive<Filters>({ ...EMPTY })

function setFilters (to: Filters) {
  Object.assign(filters, to)
}

function clearFilters () {
  setFilters(EMPTY)
}

try {
  const initialFilters = localStorage.getItem('filters')
  if (initialFilters) {
    setFilters(JSON.parse(initialFilters))
  }
} catch (e) {
  // nah
}

watch(filters, (to: Filters) => {
  localStorage.setItem('filters', JSON.stringify(to))
})

export function useFilters () {
  return {
    filters,
    setFilters,
    clearFilters
  }
}

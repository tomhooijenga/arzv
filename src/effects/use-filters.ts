import { reactive, watch } from 'vue'
import { Filters } from '@/types'

const filters = reactive<Filters>({
  type: null,
  use: null,
  minWeight: null,
  maxWeight: null,
  instruction: null,
  name: '',
  reserved: null
})

function setFilters (to: Filters) {
  Object.assign(filters, to)
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
    setFilters
  }
}

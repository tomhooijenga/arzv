import search from 'fuzzysearch'
import { Boat, Filters } from '@/types'

type FilterFn = (list: Boat[], value: any) => Boat[]
type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

function filterByValue<K extends keyof Boat> (property: K): FilterFn {
  return function (list, value: Boat[K]): Boat[] {
    return list.filter((boat) => boat[property] === value)
  }
}

const filterFns: {
  [key: string]: FilterFn;
} = {

  type: filterByValue('type'),
  use: filterByValue('use'),
  instruction: filterByValue('instruction'),
  name (list, value: string) {
    return list.filter(({ name }) => {
      return search(value.toLowerCase(), name.toLowerCase())
    })
  },
  weight (list, { min, max }: {min: number, max: number}) {
    return list.filter(({ weight }) => {
      if (weight === null) {
        return true
      }
      return min <= weight && weight <= max
    })
  }
}

export function isEmpty (value: unknown): value is null {
  if (value === null || value === '') {
    return true
  }

  return Array.isArray(value) && value.length === 0
}

function entries<T> (obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>
}

export function filter (boats: Boat[], filters: Filters): Boat[] {
  return entries(filters).reduce((filtered, [name, value]) => {
    if (isEmpty(value)) {
      return filtered
    }

    if (filterFns[name]) {
      return filterFns[name](filtered, value)
    }

    return filtered
  }, boats)
}

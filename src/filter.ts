import search from 'fuzzysearch'
import { Boat, Filters } from '@/types'

type value = string | number;
type filterFn = (list: Boat[], value: value) => Boat[]

function filterByValue (property: keyof Boat): filterFn {
  return function (list, value): Boat[] {
    return list.filter((boat) => boat[property] === value)
  }
}

const filterFns: {
  [key: string]: filterFn;
} = {

  type: filterByValue('type'),
  use: filterByValue('use'),
  instruction: filterByValue('instruction'),
  name (list, value) {
    return list.filter(({ name }) => {
      return search(String(value).toLowerCase(), name.toLowerCase())
    })
  },
  minWeight (list, value) {
    return list.filter(({ weight }) => {
      return weight === null || weight >= value
    })
  },
  maxWeight (list, value) {
    return list.filter(({ weight }) => {
      return weight === null || weight <= value
    })
  }
}

export function filter (boats: Boat[], filters: Filters): Boat[] {
  return Object
    .entries(filters)
    .reduce((filtered, [name, value]) => {
      if (value === null || value === '' || !filterFns[name]) {
        return filtered
      }
      return filterFns[name](filtered, value)
    }, boats)
}

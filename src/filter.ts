import { Boat } from '@/boats'

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

  weight (list, value) {
    return list.filter(({ weight }) => {
      if (weight === null) {
        return true
      }

      value = parseInt(value as string, 10)

      return value - 5 <= weight && weight <= value + 5
    })
  }
}

export function filter (boats: Boat[], filters: { [key: string]: value }): Boat[] {
  return Object
    .entries(filters)
    .reduce((filtered, [name, value]) => {
      if (value === null) {
        return filtered
      }
      return filterFns[name](filtered, value)
    }, boats)
}

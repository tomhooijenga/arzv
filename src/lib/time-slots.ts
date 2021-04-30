import { eachMinuteOfInterval, format } from 'date-fns'

/**
 * Get half-hour slots between start and end.
 */
export function slotsRange (start: Date | number, end: Date | number): string[] {
  return eachMinuteOfInterval({ start, end }, {
    step: 30
  }).map((slot) => format(slot, 'HH:mm'))
}

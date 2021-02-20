import { getHours, getMinutes } from 'date-fns'

function formatSlot (hour: number, half: boolean): string {
  return `${hour.toString().padStart(2, '0')}:${half ? '3' : '0'}0`
}
/**
 * Get half-hour slots between start and end.
 */
export function slotsRange (start: Date, end: Date): string[] {
  const slots: string[] = []

  let startHour = getHours(start)
  const endHour = getHours(end)

  if (getMinutes(start) === 0) {
    slots.push(formatSlot(startHour, false))
  }

  if (getMinutes(start) <= 30) {
    slots.push(formatSlot(startHour, true))
  }

  startHour += 1

  for (let i = startHour; i <= endHour - 1; i++) {
    slots.push(
      formatSlot(i, false),
      formatSlot(i, true)
    )
  }

  slots.push(formatSlot(endHour, false))

  if (getMinutes(end) >= 30) {
    slots.push(formatSlot(endHour, true))
  }

  return slots
}

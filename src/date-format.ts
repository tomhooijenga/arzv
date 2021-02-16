import { format } from 'date-fns'
import nl from 'date-fns/locale/nl'

export default function (date: Date, pattern: string): string {
  return format(date, pattern, {
    locale: nl
  })
}

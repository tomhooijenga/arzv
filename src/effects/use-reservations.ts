import { ref } from 'vue'
import { Auth, Boat, OwnReservation, Reservation, ReservationDate } from '@/types'
import { createReservation, deleteReservation, getOwnReservations, getReservations } from '@/lib/arzv'

const reservations = ref<Reservation[]>([])
const ownReservations = ref<OwnReservation[]>([])
const reservationDate = ref<ReservationDate | null>(null)

async function loadReservations (auth: Auth): Promise<void> {
  reservations.value = await getReservations(auth)
}

async function loadOwnReservations (auth: Auth): Promise<void> {
  ownReservations.value = await getOwnReservations(auth)
}

function setReservationDate (date: ReservationDate) {
  reservationDate.value = date
}

async function makeReservation (auth: Auth, boats: Boat[], date: ReservationDate) {
  await createReservation(auth, boats, date)

  await Promise.all([
    loadReservations(auth),
    loadOwnReservations(auth)
  ])
}

async function cancelReservation (auth: Auth, reservation: OwnReservation) {
  await deleteReservation(auth, reservation)

  await Promise.all([
    loadReservations(auth),
    loadOwnReservations(auth)
  ])
}

function pollReservations (auth: Auth) {
  setInterval(() => {
    loadReservations(auth)
    loadOwnReservations(auth)
  }, 2 * 60 * 1000)
}

export function useReservations () {
  return {
    reservations,
    ownReservations,
    reservationDate,
    setReservationDate,
    loadReservations,
    loadOwnReservations,
    pollReservations,
    makeReservation,
    cancelReservation
  }
}

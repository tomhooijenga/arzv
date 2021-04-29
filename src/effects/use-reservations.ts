import { reactive, toRefs } from 'vue'
import { Auth, Boat, OwnReservation, Reservation, ReservationDate } from '@/types'
import { createReservation, deleteReservation, getOwnReservations, getReservations } from '@/lib/arzv'

const state = reactive<{
  reservations: Reservation[]
  loadingReservations: boolean,
  ownReservations: OwnReservation[],
  loadingOwnReservations: boolean,
  reservationDate: ReservationDate | null
}>({
  reservations: [],
  loadingReservations: true,
  ownReservations: [],
  loadingOwnReservations: true,
  reservationDate: null
})

async function loadReservations (auth: Auth): Promise<void> {
  state.reservations = await getReservations(auth)
  state.loadingReservations = false
}

async function loadOwnReservations (auth: Auth): Promise<void> {
  state.ownReservations = await getOwnReservations(auth)
  state.loadingOwnReservations = false
}

function setReservationDate (date: ReservationDate) {
  state.reservationDate = date
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
    ...toRefs(state),
    setReservationDate,
    loadReservations,
    loadOwnReservations,
    pollReservations,
    makeReservation,
    cancelReservation
  }
}

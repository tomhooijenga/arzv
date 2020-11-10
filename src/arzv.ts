import { Auth, Boat, Reservation, OwnReservation, ReservationDate } from '@/types'

const root = process.env.NODE_ENV === 'development' ? '/api-dev/' : '/api/'

export async function authenticate (username: string, password: string): Promise<{ success: true; id: string; token: string } | { success: false; error: string}> {
  const response = await fetch(root + 'auth', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  return response.json()
}

export async function checkToken (auth: Auth): Promise<boolean> {
  const response = await fetch(root + 'auth/check', {
    headers: {
      authorization: auth.token
    }
  })
  const { valid } = await response.json()
  return valid
}

export async function getReservations (auth: Auth): Promise<Reservation[]> {
  const response = await fetch(root + 'reservations', {
    headers: {
      authorization: auth.token
    }
  })
  const { reservations } = await response.json()
  return reservations.map(({ boat, start, end, person }: { boat: string; start: string; end: string; person: string }) => ({
    start: new Date(start),
    end: new Date(end),
    boat,
    person
  }))
}

export async function getOwnReservations (auth: Auth): Promise<OwnReservation[]> {
  const response = await fetch(root + `reservations/${auth.id}`, {
    headers: {
      authorization: auth.token
    }
  })
  const { reservations } = await response.json()
  return reservations.map(({ id, boat, start, end, person }: { id: string; boat: string; start: string; end: string; person: string }) => ({
    id,
    start: new Date(start),
    end: new Date(end),
    boat,
    person
  }))
}

export async function checkReservation (auth: Auth, boats: Boat[], reservation: { start: Date; end: Date }): Promise<boolean> {
  const response = await fetch(root + 'reservations/check', {
    method: 'POST',
    headers: {
      authorization: auth.token,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      ...reservation,
      boats: boats.map(({ id }) => id)
    })
  })
  const { available } = await response.json()
  return boats.every(({ id }) => available[id!])
}

export async function createReservation (auth: Auth, boats: Boat[], reservation: ReservationDate): Promise<boolean> {
  const response = await fetch(root + 'reservations', {
    method: 'POST',
    headers: {
      authorization: auth.token,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      ...reservation,
      boats: boats.map(({ id }) => id),
      // eslint-disable-next-line
      user_id: auth.id
    })
  })
  const { success } = await response.json()
  return success
}

export async function deleteReservation (auth: Auth, reservation: OwnReservation): Promise<boolean> {
  const response = await fetch(root + 'reservations', {
    method: 'DELETE',
    headers: {
      authorization: auth.token,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      id: reservation.id,
      // eslint-disable-next-line
      user_id: auth.id
    })
  })
  const { success } = await response.json()
  return success
}

export async function getBoats (auth: Auth): Promise<Boat[]> {
  const response = await fetch(root + 'boats', {
    headers: {
      authorization: auth.token
    }
  })
  const { boats } = await response.json()
  return boats
}

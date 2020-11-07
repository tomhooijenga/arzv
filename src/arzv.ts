import { Boat, boats } from '@/boats'

const root = '/.netlify/functions/'

export interface Reservation {
  boat: Boat;
  start: Date;
  end: Date;
  person: string;
}

export interface Auth {
  token: string;

  id: string;
}

export async function authenticate (username: string, password: string): Promise<{ success: true; id: string; token: string } | { success: false; error: string}> {
  const response = await fetch(root + 'authenticate', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  })
  return response.json()
}

export async function checkToken (auth: Auth): Promise<boolean> {
  const response = await fetch(root + 'check-token', {
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
  const json = await response.json()

  return json.reservations.map(({ boat, start, end, person }: { boat: string; start: string; end: string; person: string }) => ({
    start: new Date(start),
    end: new Date(end),
    boat: boats.find(({ name }) => name === boat),
    person
  }))
}

export async function checkReservation (auth: Auth, boats: Boat[], reservation: { start: Date; end: Date }): Promise<boolean> {
  const response = await fetch(root + 'check-reservation', {
    method: 'POST',
    headers: {
      authorization: auth.token
    },
    body: JSON.stringify({
      ...reservation,
      boats: boats.map(({ id }) => id)
    })
  })
  const { available } = await response.json()
  return boats.every(({ id }) => available[id!])
}

export async function createReservation (auth: Auth, boats: Boat[], reservation: { start: Date; end: Date }): Promise<boolean> {
  const response = await fetch(root + 'check-reservation', {
    method: 'POST',
    headers: {
      authorization: auth.token
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

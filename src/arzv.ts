import { Boat, boats } from '@/boats'

const root = '/.netlify/functions/'

export interface Reservation {
  boat: Boat;
  start: Date;
  end: Date;
  person: string;
}

export async function authenticate (username: string, password: string): Promise<{ success: true; token: string } | { success: false; error: string}> {
  const response = await fetch(root + 'authenticate', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  })
  const json = await response.json()

  return json.token
}

export async function checkToken (token: string): Promise<boolean> {
  const response = await fetch(root + 'check-token', {
    headers: {
      authorization: token
    }
  })
  const { valid } = await response.json()

  return valid
}

export async function getReservations (token: string): Promise<Reservation[]> {
  const response = await fetch(root + 'reservations', {
    headers: {
      authorization: token
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

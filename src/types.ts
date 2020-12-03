export interface Reservation {
  boat: string;
  start: Date;
  end: Date;
  person: string;
}

export interface OwnReservation extends Reservation {
  id: string;
  person: '';
}

export interface ReservationDate {
  start: Date;
  end: Date;
}

export interface Auth {
  id: string;
  token: string;
}

export enum BoatUse {
  General= 'Algemeen',
  Competition = 'Wedstrijd',
  Youth = 'Jeugd',
  None = 'Buiten Gebruik'
}

export interface Boat {
  id: string | null;
  name: string;
  type: string;
  use: BoatUse;
  weight: number | null;
  scull: string;
  sweep: string;
  steer: string;
  instruction: boolean;
}

export interface Filters {
  type: string | null;
  use: Boat['use'] | null;
  minWeight: number | null;
  maxWeight: number | null;
  instruction: boolean | null;
  name: string | null;
  reserved: boolean | null;
}

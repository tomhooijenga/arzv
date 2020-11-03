export type Boat = {
  id: string | null;
  name: string;
  type: string;
  use: 'Algemeen' | 'Wedstrijd' | 'Jeugd' | 'Geen';
  weight: number | null;
  scull: string;
  sweep: string;
  steer: string;
};

export const boats: Boat[] = [
  {
    id: '50',
    name: 'Aalscholver',
    type: '2x',
    use: 'Algemeen',
    weight: 80,
    scull: 'S3',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '114',
    name: 'Alk',
    type: '1x',
    use: 'Algemeen',
    weight: 80,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '103',
    name: 'Bakvis',
    type: 'Motor',
    use: 'Wedstrijd',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '116',
    name: 'Barbeel',
    type: '1x',
    use: 'Algemeen',
    weight: 90,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '105',
    name: 'Barracuda',
    type: '1x',
    use: 'Jeugd',
    weight: 50,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '59',
    name: 'Bokje',
    type: 'C1x',
    use: 'Algemeen',
    weight: null,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '23',
    name: 'Brasem',
    type: '1x',
    use: 'Wedstrijd',
    weight: 80,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '54',
    name: 'Buizerd',
    type: '4x+',
    use: 'Algemeen',
    weight: 85,
    scull: 'S3',
    sweep: 'B2',
    steer: 'ST3'
  },
  {
    id: '92',
    name: 'C-Arend',
    type: 'C4x+',
    use: 'Algemeen',
    weight: null,
    scull: 'S1',
    sweep: 'B1',
    steer: 'ST2'
  },
  {
    id: '17',
    name: 'Carassius Ciuratus',
    type: '1x',
    use: 'Wedstrijd',
    weight: 75,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '18',
    name: 'Casarca',
    type: '1x',
    use: 'Wedstrijd',
    weight: 65,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '122',
    name: 'Condor',
    type: '8+',
    use: 'Wedstrijd',
    weight: 85,
    scull: 'S-',
    sweep: 'B3',
    steer: 'ST3'
  },
  {
    id: '110',
    name: 'CoxBox 1',
    type: 'CoxBox',
    use: 'Wedstrijd',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST3'
  },
  {
    id: '111',
    name: 'CoxBox 2',
    type: 'CoxBox',
    use: 'Wedstrijd',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST3'
  },
  {
    id: '112',
    name: 'CoxBox 3',
    type: 'CoxBox',
    use: 'Wedstrijd',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST3'
  },
  {
    id: '123',
    name: 'Coxbox Condor',
    type: 'CoxBox',
    use: 'Wedstrijd',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST3'
  },
  {
    id: '79',
    name: 'de 100 halen',
    type: '4x+',
    use: 'Algemeen',
    weight: 90,
    scull: 'S3',
    sweep: 'B-',
    steer: 'ST3'
  },
  {
    id: '68',
    name: 'Dodaars',
    type: 'C2+',
    use: 'Algemeen',
    weight: null,
    scull: 'S-',
    sweep: 'B1',
    steer: 'ST1'
  },
  {
    id: null,
    name: 'Ergo 1',
    type: 'Ergo',
    use: 'Geen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: null,
    name: 'Ergo 2',
    type: 'Ergo',
    use: 'Geen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: null,
    name: 'Ergo 3',
    type: 'Ergo',
    use: 'Geen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: null,
    name: 'Ergo 4 - Iwan',
    type: 'Ergo',
    use: 'Geen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: null,
    name: 'Ergo 5 - Jorri',
    type: 'Ergo',
    use: 'Geen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: null,
    name: 'Ergo 6 - Boris',
    type: 'Ergo',
    use: 'Geen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '86',
    name: 'Ergo 7 - Pieter',
    type: 'Ergo',
    use: 'Algemeen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '93',
    name: 'Ergo 8',
    type: 'Ergo',
    use: 'Algemeen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: null,
    name: 'Ergo 9',
    type: 'Ergo',
    use: 'Geen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '95',
    name: 'Ergo-10',
    type: 'Ergo',
    use: 'Algemeen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '107',
    name: 'Ergo-11 - Annemarie',
    type: 'Ergo',
    use: 'Algemeen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: null,
    name: 'Ergo-12  ',
    type: 'Ergo',
    use: 'Geen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '33',
    name: 'Eveline',
    type: 'W2x+',
    use: 'Algemeen',
    weight: null,
    scull: 'S1',
    sweep: 'B-',
    steer: 'ST1'
  },
  {
    id: '91',
    name: 'Frodo',
    type: '1x',
    use: 'Algemeen',
    weight: 80,
    scull: 'S3',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '74',
    name: 'Fugo',
    type: '1x',
    use: 'Jeugd',
    weight: 55,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '31',
    name: 'Fuut',
    type: 'Bak',
    use: 'Algemeen',
    weight: null,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '72',
    name: 'Gans',
    type: 'C4+',
    use: 'Algemeen',
    weight: null,
    scull: 'S-',
    sweep: 'B1',
    steer: 'ST2'
  },
  {
    id: '118',
    name: 'Geep',
    type: '1x',
    use: 'Algemeen',
    weight: 75,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '8',
    name: 'Giebel',
    type: '1x',
    use: 'Jeugd',
    weight: 55,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '76',
    name: 'Griend',
    type: '1x',
    use: 'Jeugd',
    weight: 75,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '6',
    name: 'Gudsekop',
    type: 'C4x+',
    use: 'Jeugd',
    weight: 70,
    scull: 'S1',
    sweep: 'B1',
    steer: 'ST2'
  },
  {
    id: '104',
    name: 'Harder',
    type: '1x',
    use: 'Algemeen',
    weight: 75,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '113',
    name: 'Havik',
    type: '2-',
    use: 'Algemeen',
    weight: 85,
    scull: 'S4',
    sweep: 'B3',
    steer: 'ST3'
  },
  {
    id: null,
    name: 'Ibis',
    type: '8+/8x+',
    use: 'Geen',
    weight: 85,
    scull: 'S3',
    sweep: 'B2',
    steer: 'ST3'
  },
  {
    id: '19',
    name: 'Ijsvogel',
    type: '1x',
    use: 'Algemeen',
    weight: 80,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '51',
    name: 'Jager',
    type: '2x',
    use: 'Algemeen',
    weight: 70,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '55',
    name: 'Kiekendief',
    type: '4x+',
    use: 'Algemeen',
    weight: 80,
    scull: 'S3',
    sweep: 'B2',
    steer: 'ST3'
  },
  {
    id: '65',
    name: 'Kievit',
    type: 'C2x',
    use: 'Algemeen',
    weight: null,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '25',
    name: 'Klauwier',
    type: '2x/2-',
    use: 'Wedstrijd',
    weight: 85,
    scull: 'S4',
    sweep: 'B3',
    steer: 'ST-'
  },
  {
    id: '43',
    name: 'Koi',
    type: '1x',
    use: 'Algemeen',
    weight: 90,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '71',
    name: 'Kraanvogel',
    type: 'C4x+',
    use: 'Algemeen',
    weight: null,
    scull: 'S1',
    sweep: 'B-',
    steer: 'ST2'
  },
  {
    id: '35',
    name: 'Kwak',
    type: 'W2x+',
    use: 'Algemeen',
    weight: null,
    scull: 'S1',
    sweep: 'B-',
    steer: 'ST1'
  },
  {
    id: '78',
    name: 'Kwikstaart',
    type: '2x',
    use: 'Algemeen',
    weight: 85,
    scull: 'S3',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '119',
    name: 'Lepelaar',
    type: 'C4x+',
    use: 'Algemeen',
    weight: 95,
    scull: 'S1',
    sweep: 'B-',
    steer: 'ST2'
  },
  {
    id: '88',
    name: 'Meermin',
    type: '1x',
    use: 'Jeugd',
    weight: 65,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '42',
    name: 'Meerval',
    type: '1x',
    use: 'Algemeen',
    weight: 85,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '77',
    name: 'Narwal',
    type: '1x',
    use: 'Jeugd',
    weight: 75,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '109',
    name: 'Oehoe',
    type: '4x+',
    use: 'Wedstrijd',
    weight: 70,
    scull: 'S3',
    sweep: 'B-',
    steer: 'ST3'
  },
  {
    id: '75',
    name: 'Orka',
    type: '1x',
    use: 'Jeugd',
    weight: 75,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '108',
    name: 'Parelduiker',
    type: 'C4x',
    use: 'Algemeen',
    weight: null,
    scull: 'S2',
    sweep: 'B1',
    steer: 'ST2'
  },
  {
    id: '60',
    name: 'Pellikaan',
    type: 'C1x',
    use: 'Algemeen',
    weight: null,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '101',
    name: 'Pelser',
    type: '1x',
    use: 'Algemeen',
    weight: 75,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '117',
    name: 'Poon',
    type: '1x',
    use: 'Algemeen',
    weight: 90,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '52',
    name: 'Putter',
    type: '2x',
    use: 'Algemeen',
    weight: 70,
    scull: 'S3',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '61',
    name: 'Ral',
    type: 'C1x',
    use: 'Algemeen',
    weight: null,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '36',
    name: 'Roerdomp',
    type: 'W2x+',
    use: 'Algemeen',
    weight: null,
    scull: 'S1',
    sweep: 'B-',
    steer: 'ST1'
  },
  {
    id: '13',
    name: 'Ruiter',
    type: '2x',
    use: 'Jeugd',
    weight: 55,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '28',
    name: 'Rus-roeiboot',
    type: '4-',
    use: 'Algemeen',
    weight: 90,
    scull: 'S3',
    sweep: 'B3',
    steer: 'ST-'
  },
  {
    id: '102',
    name: 'Serpeling',
    type: '1x',
    use: 'Algemeen',
    weight: 85,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '27',
    name: 'Slechtvalk',
    type: '4x+',
    use: 'Wedstrijd',
    weight: 90,
    scull: 'S3',
    sweep: 'B-',
    steer: 'ST3'
  },
  {
    id: '24',
    name: 'Smelleken',
    type: '2x',
    use: 'Algemeen',
    weight: 85,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '62',
    name: 'Smient',
    type: 'C1x',
    use: 'Algemeen',
    weight: null,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '26',
    name: 'Sperwer',
    type: '4+',
    use: 'Algemeen',
    weight: 85,
    scull: 'S3',
    sweep: 'B2',
    steer: 'ST3'
  },
  {
    id: '46',
    name: 'Steur',
    type: '1x',
    use: 'Algemeen',
    weight: 95,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '49',
    name: 'Stormvogel',
    type: '2-',
    use: 'Algemeen',
    weight: 80,
    scull: 'S-',
    sweep: 'B3',
    steer: 'ST-'
  },
  {
    id: '100',
    name: 'Suzanne',
    type: '1x',
    use: 'Wedstrijd',
    weight: 80,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '115',
    name: 'Taling',
    type: 'C2x+/C3x',
    use: 'Algemeen',
    weight: null,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST2'
  },
  {
    id: '14',
    name: 'Topper',
    type: '2x',
    use: 'Jeugd',
    weight: 55,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '30',
    name: 'VolM8cht',
    type: '8+',
    use: 'Algemeen',
    weight: 85,
    scull: 'S-',
    sweep: 'B2',
    steer: 'ST3'
  },
  {
    id: '32',
    name: 'Vondeling',
    type: 'W1x+',
    use: 'Algemeen',
    weight: null,
    scull: 'S1',
    sweep: 'B-',
    steer: 'ST1'
  },
  {
    id: '90',
    name: 'Waterhoen',
    type: 'C2x+/C3x',
    use: 'Algemeen',
    weight: null,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST2'
  },
  {
    id: null,
    name: 'Wespendief',
    type: '8+',
    use: 'Geen',
    weight: 95,
    scull: 'S-',
    sweep: 'B3',
    steer: 'ST3'
  },
  {
    id: '97',
    name: 'Wouw',
    type: '4x+/4+',
    use: 'Wedstrijd',
    weight: 85,
    scull: 'S3',
    sweep: 'B3',
    steer: 'ST3'
  },
  {
    id: '69',
    name: 'Zaagbek',
    type: 'C2x+/C3x',
    use: 'Algemeen',
    weight: null,
    scull: 'S2',
    sweep: 'B-',
    steer: 'ST2'
  },
  {
    id: '73',
    name: 'Zwaan',
    type: 'C4x+',
    use: 'Algemeen',
    weight: null,
    scull: 'S1',
    sweep: 'B-',
    steer: 'ST2'
  },
  {
    id: '106',
    name: 'Zwaardvis',
    type: '1x',
    use: 'Jeugd',
    weight: 50,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  },
  {
    id: '120',
    name: 'Zwaluw',
    type: '2x',
    use: 'Wedstrijd',
    weight: 70,
    scull: 'S4',
    sweep: 'B-',
    steer: 'ST3'
  },
  {
    id: null,
    name: 'Zwitserleven',
    type: '1x',
    use: 'Geen',
    weight: 50,
    scull: 'S-',
    sweep: 'B-',
    steer: 'ST-'
  }
]

// TO-DO: If there is 0 stops, show "Direct" instead of "0 stops"
// Types
export type TripType = 'one-way' | 'round-trip' | 'multi-city';

export interface Stop {
  airport: string;
  layoverTime: string;
}

export interface Baggage {
  personalItem: boolean;
  carryOn: boolean;
  checkedBag: boolean;
}

export interface Flight {
  id: string;
  tripType: TripType;
  segments: FlightSegment[];  // 1 for one-way, 2 for round-trip, 2+ for multi-city
  price: number;
  originalPrice?: number;
  isCheapest?: boolean;
  isBest?: boolean;
  isFastest?: boolean;
  dealType?: string;
  baggage: Baggage;
  fareOptions?: FareOption[];
}

export interface FlightSegment {
  airline: string;
  airlineLogo: string;
  departureTime: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalAirport: string;
  duration: string;
  stops: number;
  stopDetails?: Stop[];
  date: string;
}

export interface FareOption {
  name: string;
  priceModifier: number; // multiplier for base price
  benefits: string[];
  checked?: boolean;
}

export interface AirlineFareOptions {
  airline: string;
  options: FareOption[];
}

// Use to map name filter of airline in search form to logo in flight card
export const AIRLINES = [
  { name: 'Air France' },
  { name: 'United Airlines' },
  { name: 'Turkish Airlines' },
  { name: 'Icelandair' },
  { name: 'French Bee' },
  { name: 'Ryanair' },
  { name: 'Lufthansa'},
  { name: 'British Airways' },
];

// Airline-specific fare options
export const AIRLINE_FARE_OPTIONS: { [key: string]: FareOption[] } = {
  'Air France': [
    {
      name: 'Economy',
      priceModifier: 1,
      benefits: [
        '1 personal item',
        'Standard seating',
        'In-flight snacks & beverages',
        'Basic entertainment',
      ],
    },
    {
      name: 'Premium Economy',
      priceModifier: 1.5,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '1 checked bag (50.7 lbs)',
        'Choose your seat',
        'Priority boarding',
        'Flight change allowed',
        'Partial refund if you cancel',
      ],
    },
    {
      name: 'Business',
      priceModifier: 2.5,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '2 checked bags (50.7 lbs each)',
        'Lounge access',
        'Priority boarding',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'Premium meals',
      ],
    },
    {
      name: 'La Première',
      priceModifier: 3.5,
      benefits: [
        '1 personal item',
        '1 carry-on bag',
        'Unlimited checked bags',
        'Lounge access',
        'Concierge service',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'À la carte dining',
      ],
    },
  ],
  'United Airlines': [
    {
      name: 'Economy',
      priceModifier: 1,
      benefits: [
        '1 personal item',
        'Standard seating',
        'In-flight snacks',
        'Basic entertainment',
      ],
    },
    {
      name: 'Economy Plus',
      priceModifier: 1.4,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '1 checked bag (50.7 lbs)',
        'Choose your seat',
        'Priority boarding',
        'Flight change allowed',
        'Partial refund if you cancel',
      ],
    },
    {
      name: 'Business',
      priceModifier: 2.8,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '2 checked bags (50.7 lbs each)',
        'Lounge access',
        'Priority boarding',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'Premium meals',
      ],
    },
    {
      name: 'First',
      priceModifier: 3.8,
      benefits: [
        '1 personal item',
        '1 carry-on bag',
        'Unlimited checked bags',
        'Lounge access',
        'Concierge service',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'À la carte dining',
      ],
    },
  ],
  'Turkish Airlines': [
    {
      name: 'Economy',
      priceModifier: 1,
      benefits: [
        '1 personal item (23 lbs)',
        'Standard seating',
        'In-flight meals',
        'Basic entertainment',
      ],
    },
    {
      name: 'Comfort',
      priceModifier: 1.6,
      benefits: [
        '1 personal item (23 lbs)',
        '1 carry-on bag (22.1 lbs)',
        '1 checked bag (50.7 lbs)',
        'Choose your seat',
        'Priority boarding',
        'Flight change allowed',
        'Partial refund if you cancel',
      ],
    },
    {
      name: 'Business',
      priceModifier: 2.9,
      benefits: [
        '1 personal item (23 lbs)',
        '1 carry-on bag (22.1 lbs)',
        '2 checked bags (70.5 lbs each)',
        'Lounge access',
        'Priority boarding',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'Premium meals',
      ],
    },
    {
      name: 'First',
      priceModifier: 4.0,
      benefits: [
        '1 personal item (23 lbs)',
        '1 carry-on bag',
        'Unlimited checked bags',
        'Lounge access',
        'Concierge service',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'À la carte dining',
      ],
    },
  ],
  'Icelandair': [
    {
      name: 'Light',
      priceModifier: 1,
      benefits: [
        '1 personal item only',
        'Standard seating',
        'In-flight snacks',
      ],
    },
    {
      name: 'Standard',
      priceModifier: 1.3,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '1 checked bag (50.7 lbs)',
        'Choose your seat',
        'Standard boarding',
        'In-flight meals',
      ],
    },
    {
      name: 'Flex',
      priceModifier: 1.7,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '2 checked bags (50.7 lbs each)',
        'Choose your seat',
        'Priority boarding',
        'Flight change allowed',
        'Partial refund if you cancel',
      ],
    },
    {
      name: 'Business',
      priceModifier: 2.8,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '2 checked bags (70.5 lbs each)',
        'Lounge access',
        'Priority boarding',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'Premium meals',
      ],
    },
  ],
  'French Bee': [
    {
      name: 'Economy',
      priceModifier: 1,
      benefits: [
        '1 personal item',
        'Standard seating',
        'In-flight snacks & beverages',
      ],
    },
    {
      name: 'Premium',
      priceModifier: 1.8,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '1 checked bag (50.7 lbs)',
        'Choose your seat',
        'Priority boarding',
        'Flight change allowed',
        'Partial refund if you cancel',
      ],
    },
    {
      name: 'Business',
      priceModifier: 3.0,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '2 checked bags (50.7 lbs each)',
        'Lounge access',
        'Priority boarding',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'À la carte dining',
      ],
    },
  ],
  'Ryanair': [
    {
      name: 'Standard',
      priceModifier: 1,
      benefits: [
        '1 personal item only',
        'Standard seating',
      ],
    },
    {
      name: 'Plus',
      priceModifier: 1.2,
      benefits: [
        '1 personal item',
        '1 carry-on bag (10 lbs)',
        'Priority boarding',
        'Seat selection',
      ],
    },
    {
      name: 'Flex',
      priceModifier: 1.5,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '1 checked bag (50.7 lbs)',
        'Priority boarding',
        'Flight change allowed',
        'Partial refund if you cancel',
      ],
    },
  ],
  'Lufthansa': [
    {
      name: 'Economy',
      priceModifier: 1,
      benefits: [
        '1 personal item',
        'Standard seating',
        'In-flight snacks & beverages',
        'Basic entertainment',
      ],
    },
    {
      name: 'Premium Economy',
      priceModifier: 1.6,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '1 checked bag (50.7 lbs)',
        'Choose your seat',
        'Priority boarding',
        'Flight change allowed',
        'Partial refund if you cancel',
      ],
    },
    {
      name: 'Business',
      priceModifier: 3.0,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '2 checked bags (70.5 lbs each)',
        'Lounge access',
        'Priority boarding',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'Premium meals',
      ],
    },
    {
      name: 'First',
      priceModifier: 4.2,
      benefits: [
        '1 personal item',
        '1 carry-on bag',
        'Unlimited checked bags',
        'Lounge access',
        'Concierge service',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'À la carte dining',
      ],
    },
  ],
  'British Airways': [
    {
      name: 'Euro Economy',
      priceModifier: 1,
      benefits: [
        '1 personal item',
        'Standard seating',
        'In-flight snacks',
      ],
    },
    {
      name: 'Premium Economy',
      priceModifier: 1.5,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '1 checked bag (50.7 lbs)',
        'Choose your seat',
        'Priority boarding',
        'Flight change allowed',
        'Partial refund if you cancel',
      ],
    },
    {
      name: 'Club World',
      priceModifier: 2.9,
      benefits: [
        '1 personal item',
        '1 carry-on bag (22.1 lbs)',
        '2 checked bags (70.5 lbs each)',
        'Lounge access',
        'Priority boarding',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'Premium meals',
      ],
    },
    {
      name: 'First',
      priceModifier: 4.0,
      benefits: [
        '1 personal item',
        '1 carry-on bag',
        'Unlimited checked bags',
        'Lounge access',
        'Concierge service',
        'Free flight changes',
        'Full refund if you cancel',
        'Extra legroom seat',
        'À la carte dining',
      ],
    },
  ],
};


export const MOCK_FLIGHTS: Flight[] = [
  // ROUND-TRIP FLIGHTS (2 segments)
  {
    id: '1',
    tripType: 'round-trip',
    segments: [
      {
        airline: 'Air France',
        airlineLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlxXp1gOplIYNhtDceq5Xm2wjbAUDdFK8sdA&s',
        departureTime: '8:45 PM',
        departureAirport: 'LGA',
        arrivalTime: '9:35 AM',
        arrivalAirport: 'CDG',
        duration: '7h 50m',
        stops: 0,
        date: 'Apr 4',
      },
      {
        airline: 'Air France',
        airlineLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlxXp1gOplIYNhtDceq5Xm2wjbAUDdFK8sdA&s',
        departureTime: '5:50 AM',
        departureAirport: 'CDG',
        arrivalTime: '9:26 AM',
        arrivalAirport: 'LGA',
        duration: '8h 36m',
        stops: 0,
        date: 'Apr 11',
      },
    ],
    price: 826,
    originalPrice: 838,
    isCheapest: true,
    dealType: 'Spring Deal',
    baggage: { personalItem: true, carryOn: true, checkedBag: true },
    fareOptions: AIRLINE_FARE_OPTIONS['Air France'],
  },
  {
    id: '2',
    tripType: 'round-trip',
    segments: [
      {
        airline: 'United Airlines',
        airlineLogo: 'https://brandlogos.net/wp-content/uploads/2025/03/united_airlines_icon-logo_brandlogos.net_54inw.png',
        departureTime: '10:15 AM',
        departureAirport: 'EWR',
        arrivalTime: '11:30 PM',
        arrivalAirport: 'LHR',
        duration: '8h 15m',
        stops: 0,
        date: 'Apr 5',
      },
      {
        airline: 'United Airlines',
        airlineLogo: 'https://brandlogos.net/wp-content/uploads/2025/03/united_airlines_icon-logo_brandlogos.net_54inw.png',
        departureTime: '9:00 AM',
        departureAirport: 'LHR',
        arrivalTime: '12:30 PM',
        arrivalAirport: 'EWR',
        duration: '8h 30m',
        stops: 0,
        date: 'Apr 12',
      },
    ],
    price: 992,
    isBest: true,
    baggage: { personalItem: true, carryOn: true, checkedBag: true },
    fareOptions: AIRLINE_FARE_OPTIONS['United Airlines'],
  },
  {
    id: '3',
    tripType: 'round-trip',
    segments: [
      {
        airline: 'Turkish Airlines',
        airlineLogo: 'https://companieslogo.com/img/orig/THYAO.IS-f22d40e8.png?t=1720244494',
        departureTime: '6:30 PM',
        departureAirport: 'JFK',
        arrivalTime: '12:45 PM',
        arrivalAirport: 'IST',
        duration: '11h 15m',
        stops: 1,
        stopDetails: [{ airport: 'AUH', layoverTime: '2h 30m' }],
        date: 'Apr 6',
      },
      {
        airline: 'Turkish Airlines',
        airlineLogo: 'https://companieslogo.com/img/orig/THYAO.IS-f22d40e8.png?t=1720244494',
        departureTime: '2:00 PM',
        departureAirport: 'IST',
        arrivalTime: '6:30 PM',
        arrivalAirport: 'JFK',
        duration: '11h 30m',
        stops: 1,
        stopDetails: [{ airport: 'AUH', layoverTime: '3h 15m' }],
        date: 'Apr 13',
      },
    ],
    price: 860,
    originalPrice: 910,
    dealType: 'Spring Deal',
    baggage: { personalItem: true, carryOn: true, checkedBag: false },
    fareOptions: AIRLINE_FARE_OPTIONS['Turkish Airlines'],
  },

  // ONE-WAY FLIGHTS (1 segment)
  {
    id: '4',
    tripType: 'one-way',
    segments: [
      {
        airline: 'French Bee',
        airlineLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_sx160fGvFxpc1C2C3MTOMjXuhLiPw44nw&s',
        departureTime: '11:55 PM',
        departureAirport: 'EWR',
        arrivalTime: '1:20 PM',
        arrivalAirport: 'ORY',
        duration: '7h 25m',
        stops: 0,
        date: 'Apr 4',
      },
    ],
    price: 745,
    isFastest: true,
    baggage: { personalItem: true, carryOn: false, checkedBag: false },
    fareOptions: AIRLINE_FARE_OPTIONS['French Bee'],
  },
  {
    id: '5',
    tripType: 'one-way',
    segments: [
      {
        airline: 'Icelandair',
        airlineLogo: 'https://companieslogo.com/img/orig/ICEAIR.IC-c353a846.png?t=1720244492',
        departureTime: '8:00 PM',
        departureAirport: 'JFK',
        arrivalTime: '6:15 AM',
        arrivalAirport: 'KEF',
        duration: '5h 15m',
        stops: 0,
        date: 'Apr 7',
      },
    ],
    price: 890,
    baggage: { personalItem: true, carryOn: true, checkedBag: true },
    fareOptions: AIRLINE_FARE_OPTIONS['Icelandair'],
  },
  {
    id: '6',
    tripType: 'one-way',
    segments: [
      {
        airline: 'Lufthansa',
        airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Lufthansa_Logo_2018_crane.svg',
        departureTime: '4:20 PM',
        departureAirport: 'JFK',
        arrivalTime: '5:50 AM',
        arrivalAirport: 'FRA',
        duration: '7h 30m',
        stops: 0,
        date: 'Apr 8',
      },
    ],
    price: 1050,
    baggage: { personalItem: true, carryOn: true, checkedBag: true },
    fareOptions: AIRLINE_FARE_OPTIONS['Lufthansa'],
  },
  {
    id: '7',
    tripType: 'one-way',
    segments: [
      {
        airline: 'British Airways',
        airlineLogo: 'https://img.icons8.com/color/1200/british-airways.jpg',
        departureTime: '7:30 PM',
        departureAirport: 'JFK',
        arrivalTime: '7:20 AM',
        arrivalAirport: 'LHR',
        duration: '6h 50m',
        stops: 0,
        date: 'Apr 9',
      },
    ],
    price: 1120,
    baggage: { personalItem: true, carryOn: true, checkedBag: false },
    fareOptions: AIRLINE_FARE_OPTIONS['British Airways'],
  },

  // MULTI-CITY FLIGHTS (3+ segments)
  {
    id: '8',
    tripType: 'multi-city',
    segments: [
      {
        airline: 'Air France',
        airlineLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlxXp1gOplIYNhtDceq5Xm2wjbAUDdFK8sdA&s',
        departureTime: '6:00 PM',
        departureAirport: 'JFK',
        arrivalTime: '7:30 AM',
        arrivalAirport: 'CDG',
        duration: '7h 30m',
        stops: 0,
        date: 'Apr 10',
      },
      {
        airline: 'Lufthansa',
        airlineLogo: 'https://www.logo-designer.co/storage/2018/02/2018-new-lufthansa-logo-design-airplane-livery-2.png',
        departureTime: '10:00 AM',
        departureAirport: 'CDG',
        arrivalTime: '11:30 AM',
        arrivalAirport: 'FRA',
        duration: '1h 30m',
        stops: 0,
        date: 'Apr 15',
      },
      {
        airline: 'United Airlines',
        airlineLogo: 'https://brandlogos.net/wp-content/uploads/2025/03/united_airlines_icon-logo_brandlogos.net_54inw.png',
        departureTime: '1:00 PM',
        departureAirport: 'FRA',
        arrivalTime: '4:30 PM',
        arrivalAirport: 'JFK',
        duration: '9h 30m',
        stops: 0,
        date: 'Apr 20',
      },
    ],
    price: 1850,
    originalPrice: 2100,
    dealType: 'Multi-City Deal',
    baggage: { personalItem: true, carryOn: true, checkedBag: true },
    fareOptions: AIRLINE_FARE_OPTIONS['Air France'],
  }
];
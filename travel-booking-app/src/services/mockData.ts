// TO-DO: If there is 0 stops, show "Direct" instead of "0 stops"
// Types
export type TripType = 'one-way' | 'round-trip' | 'multi-city';


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
  date: string;
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

export const MOCK_FLIGHTS: Flight[] = [
  // ROUND-TRIP FLIGHTS (2 segments)
  {
    id: '1',
    tripType: 'round-trip',
    segments: [
      {
        airline: 'Air France',
        airlineLogo: 'https://airhex.com/images/airline-logos/air-france.png',
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
        airlineLogo: 'https://airhex.com/images/airline-logos/air-france.png',
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
  },
  {
    id: '2',
    tripType: 'round-trip',
    segments: [
      {
        airline: 'United Airlines',
        airlineLogo: 'https://airhex.com/images/airline-logos/united-airlines.png',
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
        airlineLogo: 'https://airhex.com/images/airline-logos/united-airlines.png',
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
  },
  {
    id: '3',
    tripType: 'round-trip',
    segments: [
      {
        airline: 'Turkish Airlines',
        airlineLogo: 'https://airhex.com/images/airline-logos/turkish-airlines.png',
        departureTime: '6:30 PM',
        departureAirport: 'JFK',
        arrivalTime: '12:45 PM',
        arrivalAirport: 'IST',
        duration: '11h 15m',
        stops: 1,
        date: 'Apr 6',
      },
      {
        airline: 'Turkish Airlines',
        airlineLogo: 'https://airhex.com/images/airline-logos/turkish-airlines.png',
        departureTime: '2:00 PM',
        departureAirport: 'IST',
        arrivalTime: '6:30 PM',
        arrivalAirport: 'JFK',
        duration: '11h 30m',
        stops: 1,
        date: 'Apr 13',
      },
    ],
    price: 860,
    originalPrice: 910,
    dealType: 'Spring Deal',
    baggage: { personalItem: true, carryOn: true, checkedBag: false },
  },

  // ONE-WAY FLIGHTS (1 segment)
  {
    id: '4',
    tripType: 'one-way',
    segments: [
      {
        airline: 'French Bee',
        airlineLogo: 'https://airhex.com/images/airline-logos/french-bee.png',
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
  },
  {
    id: '5',
    tripType: 'one-way',
    segments: [
      {
        airline: 'Icelandair',
        airlineLogo: 'https://airhex.com/images/airline-logos/icelandair.png',
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
  },
  {
    id: '6',
    tripType: 'one-way',
    segments: [
      {
        airline: 'Lufthansa',
        airlineLogo: 'https://airhex.com/images/airline-logos/lufthansa.png',
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
  },
  {
    id: '7',
    tripType: 'one-way',
    segments: [
      {
        airline: 'British Airways',
        airlineLogo: 'https://airhex.com/images/airline-logos/british-airways.png',
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
  },

  // MULTI-CITY FLIGHTS (3+ segments)
  {
    id: '8',
    tripType: 'multi-city',
    segments: [
      {
        airline: 'Air France',
        airlineLogo: 'https://airhex.com/images/airline-logos/air-france.png',
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
        airlineLogo: 'https://airhex.com/images/airline-logos/lufthansa.png',
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
        airlineLogo: 'https://airhex.com/images/airline-logos/united-airlines.png',
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
  }
];
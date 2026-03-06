// TO-DO: If there is 0 stops, show "Direct" instead of "0 stops"
// Types
export type TripType = 'one-way' | 'round-trip' | 'multi-city';

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
  baggageIncluded: boolean;
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
  { name: 'Air France', logo: 'https://logo.clearbit.com/airfrance.com' },
  { name: 'United Airlines', logo: 'https://logo.clearbit.com/united.com' },
  { name: 'Turkish Airlines', logo: 'https://logo.clearbit.com/turkishairlines.com' },
  { name: 'Icelandair', logo: 'https://logo.clearbit.com/icelandair.com' },
  { name: 'French Bee', logo: 'https://logo.clearbit.com/frenchbee.com' },
  { name: 'Ryanair', logo: 'https://logo.clearbit.com/ryanair.com' },
  { name: 'Lufthansa', logo: 'https://logo.clearbit.com/lufthansa.com' },
  { name: 'British Airways', logo: 'https://logo.clearbit.com/britishairways.com' },
];

export const MOCK_FLIGHTS: Flight[] = [
  // ROUND-TRIP FLIGHTS (2 segments)
  {
    id: '1',
    tripType: 'round-trip',
    segments: [
      {
        airline: 'Air France',
        airlineLogo: 'https://logo.clearbit.com/airfrance.com',
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
        airlineLogo: 'https://logo.clearbit.com/airfrance.com',
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
    baggageIncluded: true,
  },
  {
    id: '2',
    tripType: 'round-trip',
    segments: [
      {
        airline: 'United Airlines',
        airlineLogo: 'https://logo.clearbit.com/united.com',
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
        airlineLogo: 'https://logo.clearbit.com/united.com',
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
    baggageIncluded: true,
  },
  {
    id: '3',
    tripType: 'round-trip',
    segments: [
      {
        airline: 'Turkish Airlines',
        airlineLogo: 'https://logo.clearbit.com/turkishairlines.com',
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
        airlineLogo: 'https://logo.clearbit.com/turkishairlines.com',
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
    baggageIncluded: false,
  },

  // ONE-WAY FLIGHTS (1 segment)
  {
    id: '4',
    tripType: 'one-way',
    segments: [
      {
        airline: 'French Bee',
        airlineLogo: 'https://logo.clearbit.com/frenchbee.com',
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
    baggageIncluded: false,
  },
  {
    id: '5',
    tripType: 'one-way',
    segments: [
      {
        airline: 'Icelandair',
        airlineLogo: 'https://logo.clearbit.com/icelandair.com',
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
    baggageIncluded: true,
  },
  {
    id: '6',
    tripType: 'one-way',
    segments: [
      {
        airline: 'Lufthansa',
        airlineLogo: 'https://logo.clearbit.com/lufthansa.com',
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
    baggageIncluded: true,
  },
  {
    id: '7',
    tripType: 'one-way',
    segments: [
      {
        airline: 'British Airways',
        airlineLogo: 'https://logo.clearbit.com/britishairways.com',
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
    baggageIncluded: true,
  },

  // MULTI-CITY FLIGHTS (3+ segments)
  {
    id: '8',
    tripType: 'multi-city',
    segments: [
      {
        airline: 'Air France',
        airlineLogo: 'https://logo.clearbit.com/airfrance.com',
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
        airlineLogo: 'https://logo.clearbit.com/lufthansa.com',
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
        airlineLogo: 'https://logo.clearbit.com/united.com',
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
    baggageIncluded: true,
  },
  {
    id: '9',
    tripType: 'multi-city',
    segments: [
      {
        airline: 'British Airways',
        airlineLogo: 'https://logo.clearbit.com/britishairways.com',
        departureTime: '8:00 PM',
        departureAirport: 'JFK',
        arrivalTime: '8:00 AM',
        arrivalAirport: 'LHR',
        duration: '7h 00m',
        stops: 0,
        date: 'May 1',
      },
      {
        airline: 'Ryanair',
        airlineLogo: 'https://logo.clearbit.com/ryanair.com',
        departureTime: '6:30 AM',
        departureAirport: 'STN',
        arrivalTime: '9:45 AM',
        arrivalAirport: 'BCN',
        duration: '2h 15m',
        stops: 0,
        date: 'May 5',
      },
      {
        airline: 'Turkish Airlines',
        airlineLogo: 'https://logo.clearbit.com/turkishairlines.com',
        departureTime: '11:00 AM',
        departureAirport: 'BCN',
        arrivalTime: '5:30 PM',
        arrivalAirport: 'IST',
        duration: '3h 30m',
        stops: 0,
        date: 'May 10',
      },
      {
        airline: 'Turkish Airlines',
        airlineLogo: 'https://logo.clearbit.com/turkishairlines.com',
        departureTime: '10:00 PM',
        departureAirport: 'IST',
        arrivalTime: '2:30 AM',
        arrivalAirport: 'JFK',
        duration: '11h 30m',
        stops: 0,
        date: 'May 15',
      },
    ],
    price: 2340,
    originalPrice: 2800,
    dealType: 'Europe Explorer',
    baggageIncluded: true,
  },
];
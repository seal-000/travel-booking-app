// Flight-related type definitions
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

export interface AirlineFareOptions {
  airline: string;
  options: FareOption[];
}

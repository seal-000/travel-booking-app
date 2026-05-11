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

export interface FlightLeg {
  departureAirport: string;
  departureTime: string;
  departureDate: string;
  arrivalAirport: string;
  arrivalTime: string;
  arrivalDate: string;
  airline: string;
  airlineLogo: string;
  flightNumber: string;
  duration: string;
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
  legs?: FlightLeg[];
}


export interface Flight {
  id: string;
  tripType: TripType;
  segments: FlightSegment[];  // 1 for one-way, 2 for round-trip, 2+ for multi-city
  price: number;
  originalPrice?: number;
  baggage: Baggage;
}


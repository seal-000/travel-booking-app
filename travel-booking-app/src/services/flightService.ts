import axios from 'axios';
import { transformFlightOffers } from './flightTransformer';
import type { Flight } from './types';
import type { AmadeusFlightOffer } from './flightTransformer';

export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  cabinClass: string;
  nonStop?: boolean;
  tripType?: string;
}): Promise<Flight[]> {
  try {
    const { data } = await axios.get('/api/flight-search', {
      params: {
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        adults: params.adults,
        children: params.children,
        cabinClass: params.cabinClass,
        nonStop: params.nonStop,
      },
    });
    
    // Transform Amadeus API response to application format
    const flightOffers = Array.isArray(data) ? data : [];
    return transformFlightOffers(flightOffers as AmadeusFlightOffer[], params.tripType);
  } catch (err) {
    console.error('Flight search failed:', err);
    return [];
  }
}
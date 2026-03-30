import axios from 'axios';

// TODO: Remenber card flight with its details and add to booking summary page.
export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: any[];
  price: { total: string; base: string; fee: string; grandTotal: string };
  pricingOptions: any;
  validatingAirlineCodes: string[];
  travelerPricings: any[];
}

export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  cabinClass: string;
  nonStop?: boolean;
}): Promise<FlightOffer[]> {
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
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Flight search failed:', err);
    return [];
  }
}
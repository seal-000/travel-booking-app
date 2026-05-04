import type { Flight, FlightSegment } from './types';

// Duffel API response types
export interface DuffelFlightOffer {
  id: string;
  live: boolean;
  slices: DuffelSlice[];
  total_amount: number | string;
  total_currency: string;
  owner: { id: string; name: string };
  passengers: DuffelPassenger[];
  base_amount?: number | string;
  tax_amount?: number | string;
}

export interface DuffelSlice {
  id: string;
  origin: { iata_code: string; type: string };
  destination: { iata_code: string; type: string };
  departure_date: string;
  arrival_date: string;
  duration: string;
  segments: DuffelSegment[];
}

export interface DuffelSegment {
  id: string;
  origin: { iata_code: string; name?: string };
  destination: { iata_code: string; name?: string };
  departing_at: string;
  arriving_at: string;
  operating_carrier: { iata_code: string; name?: string; logo_symbol_url?: string };
  marketing_carrier: { iata_code: string; name?: string; logo_symbol_url?: string };
  aircraft?: { iata_code: string };
  operating_carrier_flight_number: string;
  marketing_carrier_flight_number: string;
  duration: string;
  stops: DuffelStop[];
}

export interface DuffelStop {
  airport: { iata_code: string };
  duration?: string;
}

export interface DuffelPassenger {
  id: string;
  type: string;
}

/**
 
// No longer needed since we switched to Amadeus API
// Mapping of airline carrier codes to airline names and logos (imported from airlines.json)
const CARRIER_CODE_TO_AIRLINE = airlinesData as Record<string, { name: string; logo: string }>;

    function getAirlineInfo(carrierCode: string): { name: string; logo: string } {
      const info = CARRIER_CODE_TO_AIRLINE[carrierCode as keyof typeof CARRIER_CODE_TO_AIRLINE];
      return info || { 
        name: carrierCode, 
        logo: 'https://via.placeholder.com/32?text=✈' 
      };
    }


 **/

/**
 * Parse ISO 8601 duration string to human readable format
 * e.g., "PT18H5M" -> "18h 5m"
 */
function parseDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Format ISO 8601 timestamp to time string
 * e.g., "2026-03-30T10:00:00" -> "10:00 AM"
 */
function formatTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Format ISO 8601 timestamp to date string
 * e.g., "2026-03-30T10:00:00" -> "Mar 30"
 */
function formatDate(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Calculate layover time between two ISO 8601 timestamps
 */
function calculateLayover(arrivalTime: string, departureTime: string): string {
  const arrival = new Date(arrivalTime);
  const departure = new Date(departureTime);
  const minutes = Math.round((departure.getTime() - arrival.getTime()) / 60000);
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Transform an Amadeus Itinerary (which may contain multiple segments/legs) to a single application FlightSegment
 * Combines all legs of a journey with stops into one segment
 */
function transformItinerary(slice: DuffelSlice): FlightSegment {
  const segments = slice.segments;
  
  if (segments.length === 0) {
    throw new Error('Slice must have at least one segment');
  }

  // Get airline info from the first segment (usually the main airline)
  const carrier = segments[0].marketing_carrier || segments[0].operating_carrier;
  const airlineName = carrier?.name || carrier?.iata_code || '';
  const airlineLogo = carrier?.logo_symbol_url || 'https://via.placeholder.com/32?text=✈';
  
  // Calculate total number of stops (total segments - 1) + any stops within segments
  let totalStops = segments.length - 1;
  for (const segment of segments) {
    if (segment.stops) {
      totalStops += segment.stops.length;
    }
  }
  
  // Build stop details from intermediate segments (not including first and last)
  const stopDetails = segments.slice(1).map((segment, index) => ({
    airport: segment.origin.iata_code,
    layoverTime: calculateLayover(segments[index].arriving_at, segment.departing_at),
  }));

  return {
    airline: airlineName,
    airlineLogo: airlineLogo,
    departureTime: formatTime(segments[0].departing_at),
    departureAirport: segments[0].origin.iata_code,
    arrivalTime: formatTime(segments[segments.length - 1].arriving_at),
    arrivalAirport: segments[segments.length - 1].destination.iata_code,
    duration: parseDuration(slice.duration),
    stops: totalStops,
    stopDetails: stopDetails.length > 0 ? stopDetails : undefined,
    date: formatDate(segments[0].departing_at),
  };
}

/**
 * Transform Amadeus FlightOffer to application Flight
 */
export function transformFlightOffer(offer: DuffelFlightOffer, userSearchTripType?: string): Flight {
  // Use the user's search trip type if provided, otherwise infer from API response
  const tripType = (userSearchTripType || (offer.slices.length === 1 ? 'one-way' : 'round-trip')) as any;
  
  //console.log(`[Transformer] Processing flight with tripType: ${tripType}, slices: ${offer.slices?.length}`);
  
  // Transform each itinerary to a single flight segment
  const allSegments = (offer.slices || []).map(slice => transformItinerary(slice));
  
  //console.log(`[Transformer] Created ${allSegments.length} segments from ${offer.slices?.length} slices`);

  // TODO: Fare options would come from Amadeus API pricing details
  const fareOptions: any[] = [];
  
  let price = 0;
  let baseAmount = 0;
  if (typeof offer.total_amount === 'string') {
    price = parseFloat(offer.total_amount);
  } else if (typeof offer.total_amount === 'number') {
    price = offer.total_amount;
  }
  
  if (typeof offer.base_amount === 'string') {
    baseAmount = parseFloat(offer.base_amount);
  } else if (typeof offer.base_amount === 'number') {
    baseAmount = offer.base_amount;
  }

  return {
    id: offer.id,
    tripType,
    segments: allSegments,
    price: Math.round(price),
    baggage: {
      personalItem: true,
      carryOn: true,
      checkedBag: baseAmount < 200,
    },
    fareOptions,
  };
}

/**
 * Transform array of Amadeus FlightOffers to application Flights
 */
export function transformFlightOffers(offers: DuffelFlightOffer[], userSearchTripType?: string): Flight[] {
  return offers.map(offer => transformFlightOffer(offer, userSearchTripType));
}

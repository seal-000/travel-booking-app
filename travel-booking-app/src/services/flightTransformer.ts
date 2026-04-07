import type { Flight, FlightSegment } from './types';
import airlinesData from '../constants/airlines.json';

// Amadeus API response types
export interface AmadeusFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  isUpsellOffer?: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: AmadeusItinerary[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees?: Array<{ amount: string; type: string }>;
    grandTotal: string;
    additionalServices?: Array<{ amount: string; type: string }>;
  };
  pricingOptions: any;
  validatingAirlineCodes: string[];
  travelerPricings: any[];
}

export interface AmadeusItinerary {
  duration: string;
  segments: AmadeusSegment[];
}

export interface AmadeusSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: { code: string };
  operating?: { carrierCode: string };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

// Mapping of airline carrier codes to airline names and logos (imported from airlines.json)
const CARRIER_CODE_TO_AIRLINE = airlinesData as Record<string, { name: string; logo: string }>;

/**
 * Get airline info from carrier code
 */
function getAirlineInfo(carrierCode: string): { name: string; logo: string } {
  const info = CARRIER_CODE_TO_AIRLINE[carrierCode as keyof typeof CARRIER_CODE_TO_AIRLINE];
  return info || { 
    name: carrierCode, 
    logo: 'https://via.placeholder.com/32?text=✈' 
  };
}

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
function transformItinerary(itinerary: AmadeusItinerary): FlightSegment {
  const segments = itinerary.segments;
  
  if (segments.length === 0) {
    throw new Error('Itinerary must have at least one segment');
  }

  // Get airline info from the first segment (usually the main airline)
  const airlineInfo = getAirlineInfo(segments[0].carrierCode);
  
  // Calculate total number of stops (total segments - 1)
  const totalStops = segments.length - 1;
  
  // Build stop details from intermediate segments (not including first and last)
  const stopDetails = segments.slice(1, -1).map((segment, index) => ({
    airport: segment.departure.iataCode,
    layoverTime: calculateLayover(segments[index].arrival.at, segment.departure.at),
  }));

  return {
    airline: airlineInfo.name,
    airlineLogo: airlineInfo.logo,
    departureTime: formatTime(segments[0].departure.at),
    departureAirport: segments[0].departure.iataCode,
    arrivalTime: formatTime(segments[segments.length - 1].arrival.at),
    arrivalAirport: segments[segments.length - 1].arrival.iataCode,
    duration: parseDuration(itinerary.duration),
    stops: totalStops,
    stopDetails: stopDetails.length > 0 ? stopDetails : undefined,
    date: formatDate(segments[0].departure.at),
  };
}

/**
 * Transform Amadeus FlightOffer to application Flight
 */
export function transformFlightOffer(offer: AmadeusFlightOffer, userSearchTripType?: string): Flight {
  // Use the user's search trip type if provided, otherwise infer from API response
  const tripType = (userSearchTripType || (offer.oneWay ? 'one-way' : offer.itineraries.length > 1 ? 'round-trip' : 'one-way')) as any;
  
  console.log(`[Transformer] Processing flight with tripType: ${tripType}, itineraries: ${offer.itineraries.length}`);
  
  // Transform each itinerary to a single flight segment
  const allSegments = offer.itineraries.map(itinerary => transformItinerary(itinerary));
  
  console.log(`[Transformer] Created ${allSegments.length} segments from ${offer.itineraries.length} itineraries`);

  // Get the primary airline from the first segment
  const primaryCarrier = offer.itineraries[0].segments[0].carrierCode;

  // TODO: Fare options would come from Amadeus API pricing details
  const fareOptions: any[] = [];

  return {
    id: offer.id,
    tripType,
    segments: allSegments,
    price: Math.round(parseFloat(offer.price.total)),
    baggage: {
      personalItem: true,
      carryOn: true,
      checkedBag: parseFloat(offer.price.base) < 200,
    },
    fareOptions,
  };
}

/**
 * Transform array of Amadeus FlightOffers to application Flights
 */
export function transformFlightOffers(offers: AmadeusFlightOffer[], userSearchTripType?: string): Flight[] {
  return offers.map(offer => transformFlightOffer(offer, userSearchTripType));
}

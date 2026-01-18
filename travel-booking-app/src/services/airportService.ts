// Mock airport data - replace with Amadeus API later
export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

const mockAirports: Airport[] = [
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
  { code: 'ORD', name: "Chicago O'Hare International", city: 'Chicago', country: 'USA' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA' },
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK' },
  { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France' },
  { code: 'FCM', name: 'Frankfurt am Main', city: 'Frankfurt', country: 'Germany' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
];

export const searchAirports = (query: string): Airport[] => {
  if (!query || query.length < 1) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockAirports.filter(airport =>
    airport.code.toLowerCase().includes(lowerQuery) ||
    airport.name.toLowerCase().includes(lowerQuery) ||
    airport.city.toLowerCase().includes(lowerQuery)
  );
};

export const getAirportByCode = (code: string): Airport | undefined => {
  return mockAirports.find(airport => airport.code === code.toUpperCase());
};

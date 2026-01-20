// Mock airport data - replace with Amadeus API later
import axios from 'axios';

export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const searchAirports = async (query: string): Promise<Airport[]> => {
  if (!query || query.trim().length < 2) return [];
  try {
    const { data } = await axios.get<Airport[]>('/api/airports', {
      params: { query }
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Airport API search failed:', err);
    return [];
  }
};

export const getAirportByCode = async (code: string): Promise<Airport | undefined> => {
  const results = await searchAirports(code);
  return results.find(a => a.code.toUpperCase() === code.toUpperCase());
};

import React, { useState, useMemo, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import './SearchResults.css';
import { FlightCards } from '../components/fields/flight-details/Cards';
import FlightSearchBox from '../components/flight-search/FlightSearchBox';
import FilterSidebar from '../components/fields/FilterSidebar';
import type { FilterState } from '../components/fields/FilterSidebar';
import type { Flight } from '../services/types';
import { searchFlights } from '../services/flightService';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        airlines: [],
        stops: [],
        priceRange: [0, 3000],
    });
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Fetch flights from API when search parameters change
    useEffect(() => {
        const fetchFlights = async () => {
            const departure = searchParams.get('departure');
            const arrival = searchParams.get('arrival');
            const departureDate = searchParams.get('departureDate');
            const returnDate = searchParams.get('returnDate');
            const adultsStr = searchParams.get('adults') || '1';
            const childrenStr = searchParams.get('children') || '0';
            const cabinClass = searchParams.get('cabinClass') || 'economy';
            const nonStopStr = searchParams.get('directFlightsOnly') || 'false';
            const tripType = searchParams.get('tripType');

            console.log('[SearchResults] URL params:', { departure, arrival, departureDate, returnDate, tripType });

            // Validate required parameters
            if (!departure || !arrival || !departureDate) {
                setError('Missing required search parameters');
                setFlights([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log('[SearchResults] Calling searchFlights with:', { departure, arrival, departureDate, returnDate, tripType });
                const results = await searchFlights({
                    originLocationCode: departure,
                    destinationLocationCode: arrival,
                    departureDate,
                    returnDate: returnDate || undefined,
                    adults: parseInt(adultsStr),
                    children: parseInt(childrenStr) || undefined,
                    cabinClass,
                    nonStop: nonStopStr === 'true',
                    tripType: tripType || undefined,
                });

                setFlights(results);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flights';
                setError(errorMessage);
                setFlights([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams]);

    // Extract unique airlines from flights
    const availableAirlines = useMemo(() => {
        const airlineSet = new Set<string>();
        flights.forEach(flight => {
            flight.segments.forEach(segment => {
                airlineSet.add(segment.airline);
            });
        });
        return Array.from(airlineSet).sort();
    }, [flights]);

    // Filter flights based on filter sidebar state
    const filteredFlights = useMemo(() => {
        return flights.filter((flight: Flight) => {
            // Filter by airline
            if (filters.airlines.length > 0) {
                const flightAirline = flight.segments[0]?.airline;
                if (!flightAirline || !filters.airlines.includes(flightAirline)) {
                    return false;
                }
            }

            // Filter by stops
            if (filters.stops.length > 0) {
                const maxStops = Math.min(...flight.segments.map(s => s.stops));
                if (!filters.stops.includes(maxStops)) {
                    return false;
                }
            }

            // Filter by price range
            if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) {
                return false;
            }

            return true;
        });
    }, [flights, filters]);

    return (
        <div>
        <section className='modify-search'>
        
         <Box sx={{ 
           mx: 'auto', 
           transform: { xs: 'scale(0.45)', sm: 'scale(0.5)', md: 'scale(0.6)' }, 
           transformOrigin: 'top center',
           px: { xs: 3, sm: 5, md: 7 },
         }}>
           <FlightSearchBox />
         </Box>
        
        
        </section>
        <section className='show-card-info'>
            <Box sx={{ mx: 'auto', p: { xs: 2, md: 3 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Filter Sidebar */}
                <FilterSidebar 
                    filters={filters} 
                    onFilterChange={setFilters} 
                    maxPrice={3000}
                    availableAirlines={availableAirlines}
                    isMobileOpen={mobileFiltersOpen}
                    onMobileClose={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                />
                
                {/* Flight Results */}
                <Box sx={{ flex: 1 }}>
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {!loading && !error && (
                        <FlightCards filters={filters} flights={filteredFlights} />
                    )}
                </Box>
            </Box>
        </section>
        </div>
    );
};

export default SearchResults;
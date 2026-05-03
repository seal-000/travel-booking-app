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
        priceRange: [0, 15000],
    });
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Fetch flights from API when search parameters change
    useEffect(() => {
        const fetchFlights = async () => {
            const tripType = searchParams.get('tripType');
            const adultsStr = searchParams.get('adults') || '1';
            const childrenStr = searchParams.get('children') || '0';
            const cabinClass = searchParams.get('cabinClass') || 'economy';
            const nonStopStr = searchParams.get('directFlightsOnly') || 'false';

            // Handle multi-city trips
            if (tripType === 'multi-city') {
                const multiStopDates = searchParams.get('multiStopDates') || '';
                const dates = multiStopDates.split('|').filter(d => d);
                const segments = dates.length;
                
                // Validate multi-city parameters
                const multiCityRoutes = [];
                let isValid = true;
                
                for (let i = 0; i < segments; i++) {
                    const departure = searchParams.get(`departure${i}`);
                    const arrival = searchParams.get(`arrival${i}`);
                    const date = searchParams.get(`date${i}`);
                    
                    if (!departure || !arrival || !date) {
                        isValid = false;
                        break;
                    }
                    
                    multiCityRoutes.push({ departure, arrival, date });
                }

                if (!isValid || multiCityRoutes.length === 0) {
                    setError('Missing required search parameters for multi-city trip');
                    setFlights([]);
                    return;
                }

                console.log('[SearchResults] Multi-city URL params:', { segments, multiStopDates, multiCityRoutes, tripType });

                setLoading(true);
                setError(null);

                try {
                    // For multi-city, fetch all segments
                    console.log('[SearchResults] Calling searchFlights for multi-city with all segments:', multiCityRoutes);
                    
                    // Fetch flights for all segments
                    const allSegmentResults: Flight[][] = [];
                    
                    for (let i = 0; i < multiCityRoutes.length; i++) {
                        const segmentResults = await searchFlights({
                            originLocationCode: multiCityRoutes[i].departure,
                            destinationLocationCode: multiCityRoutes[i].arrival,
                            departureDate: multiCityRoutes[i].date,
                            adults: parseInt(adultsStr),
                            children: parseInt(childrenStr) || undefined,
                            cabinClass,
                            nonStop: nonStopStr === 'true',
                            tripType: 'one-way', // Fetch each segment as one-way
                        });
                        allSegmentResults.push(segmentResults);
                    }

                    // Combine flights from all segments into multi-city itineraries
                    // For simplicity, pair first flight from each segment
                    // In production, you'd show all combinations or use a more sophisticated matching
                    const combinedFlights: Flight[] = [];
                    
                    if (allSegmentResults.length === 2) {
                        // For 2-segment multi-city, combine matching flights
                        const segment1Flights = allSegmentResults[0];
                        const segment2Flights = allSegmentResults[1];
                        
                        segment1Flights.forEach((flight1, idx) => {
                            if (segment2Flights[idx]) {
                                const flight2 = segment2Flights[idx];
                                const combinedFlight: Flight = {
                                    ...flight1,
                                    id: `${flight1.id}-${flight2.id}`, // Combine IDs
                                    tripType: 'multi-city',
                                    segments: [...flight1.segments, ...flight2.segments],
                                    price: flight1.price + flight2.price, // Total price
                                };
                                combinedFlights.push(combinedFlight);
                            }
                        });
                    } else if (allSegmentResults.length === 1) {
                        combinedFlights.push(...allSegmentResults[0]);
                    }

                    setFlights(combinedFlights);
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flights';
                    setError(errorMessage);
                    setFlights([]);
                } finally {
                    setLoading(false);
                }
            } else {
                // Handle one-way and round-trip
                const departure = searchParams.get('departure');
                const arrival = searchParams.get('arrival');
                const departureDate = searchParams.get('departureDate');
                const returnDate = searchParams.get('returnDate');

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
                const hasMatchingAirline = flight.segments.some(segment => filters.airlines.includes(segment.airline));
                if (!hasMatchingAirline) {
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
                    maxPrice={15000}
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
import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import './SearchResults.css';
import { FlightCards } from '../components/fields/flight-details/Cards';
import FlightSearchBox from '../components/flight-search/FlightSearchBox';
import FilterSidebar from '../components/fields/FilterSidebar';
import type { FilterState } from '../components/fields/FilterSidebar';
import { MOCK_FLIGHTS } from '../services/mockData';
import type { Flight } from '../services/mockData';

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState<FilterState>({
        airlines: [],
        stops: [],
        priceRange: [0, 3000],
    });
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Filter flights based on search parameters
    const filteredFlights = useMemo(() => {
        let tripType = searchParams.get('tripType') || 'one-way';
        
        // Normalize trip type values to match TripType enum
        if (tripType === 'oneway') tripType = 'one-way';
        if (tripType === 'roundtrip') tripType = 'round-trip';
        if (tripType === 'multicity') tripType = 'multi-city';
        
        const departure = searchParams.get('departure');
        const arrival = searchParams.get('arrival');
        const directFlightsOnly = searchParams.get('directFlightsOnly') === 'true';

        return MOCK_FLIGHTS.filter((flight: Flight) => {
            // Filter by trip type
            if (flight.tripType !== tripType) return false;

            // Filter by departure and arrival airports
            if (departure && !flight.segments.some(seg => seg.departureAirport === departure)) return false;
            if (arrival && !flight.segments.some(seg => seg.arrivalAirport === arrival)) return false;

            // Filter by direct flights only
            if (directFlightsOnly && flight.segments.some(seg => seg.stops > 0)) return false;

            // For roundtrip, check if departure and arrival match the route
            if (tripType === 'round-trip' && flight.segments.length >= 2) {
                const firstSegment = flight.segments[0];
                if (departure && firstSegment.departureAirport !== departure) return false;
                if (arrival && firstSegment.arrivalAirport !== arrival) return false;
            }

            // For one-way flights
            if (tripType === 'one-way' && flight.segments.length === 1) {
                if (departure && flight.segments[0].departureAirport !== departure) return false;
                if (arrival && flight.segments[0].arrivalAirport !== arrival) return false;
            }

            return true;
        });
    }, [searchParams]);

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
                    isMobileOpen={mobileFiltersOpen}
                    onMobileClose={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                />
                
                {/* Flight Results */}
                <Box sx={{ flex: 1 }}>
                    <FlightCards filters={filters} flights={filteredFlights} />
                </Box>
            </Box>
        </section>
        </div>
    );
};

export default SearchResults;
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { FlightCards } from '../components/fields/Cards';
import FlightSearchBox from '../components/flight-search/FlightSearchBox';
import FilterSidebar from '../components/fields/FilterSidebar';
import type { FilterState } from '../components/fields/FilterSidebar';

const SearchResults: React.FC = () => {
    const [filters, setFilters] = useState<FilterState>({
        airlines: [],
        stops: [],
        priceRange: [0, 3000],
    });

    return (
        <div>
        <section className='modify-search'>
        
         <Box sx={{ mx: 'auto', transform: 'scale(0.8)', transformOrigin: 'top center' }}>
           <FlightSearchBox />
         </Box>
        
        
        </section>
        <section className='show-card-info'>


        
            <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, display: 'flex', gap: 3 }}>
                {/* Filter Sidebar */}
                <FilterSidebar filters={filters} onFilterChange={setFilters} maxPrice={3000} />
                
                {/* Flight Results */}
                <Box sx={{ flex: 1 }}>
                    <FlightCards filters={filters} />
                </Box>
            </Box>

        </section>
        </div>
    );
};

export default SearchResults;
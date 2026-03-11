import React, { useState } from 'react';
import { Box } from '@mui/material';
import './SearchResults.css';
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
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
                    <FlightCards filters={filters} />
                </Box>
            </Box>
        </section>
        </div>
    );
};

export default SearchResults;
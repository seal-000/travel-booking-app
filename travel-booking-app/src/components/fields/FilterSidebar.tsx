import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Slider,
  Chip,
} from '@mui/material';
import { AIRLINES } from '../../services/mockData';

export interface FilterState {
  airlines: string[];
  stops: number[];
  priceRange: [number, number];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  maxPrice?: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  maxPrice = 3000,
}) => {
  const handleAirlineChange = (airlineName: string) => {
    const newAirlines = filters.airlines.includes(airlineName)
      ? filters.airlines.filter((a) => a !== airlineName)
      : [...filters.airlines, airlineName];
    onFilterChange({ ...filters, airlines: newAirlines });
  };

  const handleStopsChange = (stopCount: number) => {
    const newStops = filters.stops.includes(stopCount)
      ? filters.stops.filter((s) => s !== stopCount)
      : [...filters.stops, stopCount];
    onFilterChange({ ...filters, stops: newStops });
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    onFilterChange({ ...filters, priceRange: newValue as [number, number] });
  };

  const clearAllFilters = () => {
    onFilterChange({
      airlines: [],
      stops: [],
      priceRange: [0, maxPrice],
    });
  };

  const hasActiveFilters =
    filters.airlines.length > 0 ||
    filters.stops.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice;

  return (
    <Box
      sx={{
        width: 280,
        bgcolor: 'white',
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        p: 2,
        position: 'sticky',
        top: 20,
        height: 'fit-content',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        {hasActiveFilters && (
          <Chip
            label="Clear all"
            size="small"
            onClick={clearAllFilters}
            sx={{ cursor: 'pointer', bgcolor: '#e6f2fa', color: '#0071c2' }}
          />
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Stops Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Stops
        </Typography>
        <FormGroup>
          {[
            { value: 0, label: 'Direct' },
            { value: 1, label: '1 stop' },
            { value: 2, label: '2+ stops' },
          ].map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={filters.stops.includes(option.value)}
                  onChange={() => handleStopsChange(option.value)}
                  size="small"
                  sx={{ color: '#0071c2', '&.Mui-checked': { color: '#0071c2' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#1a1a1a' }}>
                  {option.label}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Price Range Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Price
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={maxPrice}
            valueLabelFormat={(value) => `$${value}`}
            sx={{
              color: '#0071c2',
              '& .MuiSlider-thumb': { bgcolor: '#0071c2' },
              '& .MuiSlider-track': { bgcolor: '#0071c2' },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: '#595959' }}>
              ${filters.priceRange[0]}
            </Typography>
            <Typography variant="caption" sx={{ color: '#595959' }}>
              ${filters.priceRange[1]}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Airlines Filter */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Airlines
        </Typography>
        <FormGroup>
          {AIRLINES.map((airline) => (
            <FormControlLabel
              key={airline.name}
              control={
                <Checkbox
                  checked={filters.airlines.includes(airline.name)}
                  onChange={() => handleAirlineChange(airline.name)}
                  size="small"
                  sx={{ color: '#0071c2', '&.Mui-checked': { color: '#0071c2' } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#1a1a1a' }}>
                  {airline.name}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
};

export default FilterSidebar;

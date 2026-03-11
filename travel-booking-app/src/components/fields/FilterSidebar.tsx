import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Slider,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Badge,
  Collapse,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Collapsible filter section component
const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}> = ({ title, children, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          py: 0.5,
          '&:hover': { bgcolor: '#f5f5f5' },
          borderRadius: 1,
          px: 0.5,
          mx: -0.5,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {expanded ? (
          <KeyboardArrowUpIcon sx={{ color: '#595959', fontSize: 20 }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ color: '#595959', fontSize: 20 }} />
        )}
      </Box>
      <Collapse in={expanded} timeout="auto">
        <Box sx={{ mt: 1 }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  maxPrice = 3000,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const filterContent = (
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
        overflowY: 'auto',
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
      <FilterSection title="Stops">
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
      </FilterSection>

      <Divider sx={{ mb: 2 }} />

      {/* Price Range Filter */}
      <FilterSection title="Price">
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
      </FilterSection>

      <Divider sx={{ mb: 2 }} />

      {/* Airlines Filter */}
      <FilterSection title="Airlines">
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
      </FilterSection>
    </Box>
  );

  // Mobile: render as expandable panel
  if (isMobile) {
    return (
      <Box sx={{ mb: 2, width: '100%' }}>
        {/* Mobile Toggle Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={onMobileClose}
          endIcon={
            isMobileOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )
          }
          sx={{
            borderColor: '#0071c2',
            color: '#0071c2',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            justifyContent: 'space-between',
            bgcolor: 'white',
            '&:hover': {
              borderColor: '#005999',
              bgcolor: '#e6f2fa',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon />
            <span>Filters</span>
            {hasActiveFilters && (
              <Badge
                badgeContent={
                  filters.airlines.length +
                  filters.stops.length +
                  (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0)
                }
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: '#0071c2',
                    color: 'white',
                    position: 'relative',
                    transform: 'none',
                    ml: 1,
                  },
                }}
              />
            )}
          </Box>
        </Button>

        {/* Expandable Filter Content */}
        <Collapse in={isMobileOpen} timeout="auto">
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              bgcolor: 'white',
              p: 2,
            }}
          >
            {/* Stops Filter */}
            <FilterSection title="Stops">
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
            </FilterSection>

            <Divider sx={{ mb: 2 }} />

            {/* Price Range Filter */}
            <FilterSection title="Price">
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
            </FilterSection>

            <Divider sx={{ mb: 2 }} />

            {/* Airlines Filter */}
            <FilterSection title="Airlines">
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
            </FilterSection>

            {/* Clear All Button */}
            {hasActiveFilters && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Button
                  fullWidth
                  variant="text"
                  onClick={clearAllFilters}
                  sx={{
                    color: '#0071c2',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Clear all filters
                </Button>
              </Box>
            )}
          </Box>
        </Collapse>
      </Box>
    );
  }

  // Desktop: render inline
  return filterContent;
};

export default FilterSidebar;

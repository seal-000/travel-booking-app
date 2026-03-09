import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Collapse,
  Divider,
  Stack,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Luggage,
  NoLuggage,
  ExpandMore,
  ExpandLess,
  AccessTime,
} from '@mui/icons-material';
import { MOCK_FLIGHTS } from '../../services/mockData';
import type { Flight, FlightSegment, Baggage } from '../../services/mockData';

interface FlightCardProps {
  flight: Flight;
}

const StopsIndicator: React.FC<{ stops: number }> = ({ stops }) => {
  if (stops === 0) {
    return (
      <Typography
        variant="body2"
        sx={{ color: '#008234', fontWeight: 600 }}
      >
        Direct
      </Typography>
    );
  }
  return (
    <Typography variant="body2" sx={{ color: '#595959' }}>
      {stops} {stops === 1 ? 'stop' : 'stops'}
    </Typography>
  );
};

const BaggageIndicator: React.FC<{ baggage: Baggage }> = ({ baggage }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {/* Personal Item */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {baggage.personalItem ? (
          <Luggage sx={{ fontSize: 16, color: '#008234' }} />
        ) : (
          <NoLuggage sx={{ fontSize: 16, color: '#595959' }} />
        )}
        <Typography variant="body2" sx={{ color: baggage.personalItem ? '#008234' : '#595959', fontSize: 12 }}>
          Personal item
        </Typography>
      </Box>

      {/* Carry-on */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {baggage.carryOn ? (
          <Luggage sx={{ fontSize: 16, color: '#008234' }} />
        ) : (
          <NoLuggage sx={{ fontSize: 16, color: '#595959' }} />
        )}
        <Typography variant="body2" sx={{ color: baggage.carryOn ? '#008234' : '#595959', fontSize: 12 }}>
          Carry-on
        </Typography>
      </Box>

      {/* Checked Bag */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {baggage.checkedBag ? (
          <Luggage sx={{ fontSize: 16, color: '#008234' }} />
        ) : (
          <NoLuggage sx={{ fontSize: 16, color: '#595959' }} />
        )}
        <Typography variant="body2" sx={{ color: baggage.checkedBag ? '#008234' : '#595959', fontSize: 12 }}>
          Checked bag
        </Typography>
      </Box>
    </Box>
  );
};

const SegmentRow: React.FC<{ segment: FlightSegment; label?: string }> = ({ segment, label }) => {
  return (
    <Box sx={{ mb: 2 }}>
      {label && (
        <Typography variant="caption" sx={{ color: '#595959', mb: 1, display: 'block' }}>
          {label}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Airline Logo */}
        <Box
          component="img"
          src={segment.airlineLogo}
          alt={segment.airline}
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            objectFit: 'contain',
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = 'https://via.placeholder.com/32?text=✈';
          }}
        />

        {/* Flight Times & Route */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Departure */}
          <Box sx={{ textAlign: 'center', minWidth: 70 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {segment.departureTime}
            </Typography>
            <Typography variant="body2" sx={{ color: '#595959' }}>
              {segment.departureAirport}
            </Typography>
          </Box>

          {/* Flight Line */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <FlightTakeoff sx={{ fontSize: 16, color: '#0071c2' }} />
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  bgcolor: '#e0e0e0',
                  mx: 1,
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'white',
                    px: 0.5,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#595959', fontSize: 11 }}>
                    {segment.duration}
                  </Typography>
                </Box>
              </Box>
              <FlightLand sx={{ fontSize: 16, color: '#0071c2' }} />
            </Box>
            <StopsIndicator stops={segment.stops} />
          </Box>

          {/* Arrival */}
          <Box sx={{ textAlign: 'center', minWidth: 70 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {segment.arrivalTime}
            </Typography>
            <Typography variant="body2" sx={{ color: '#595959' }}>
              {segment.arrivalAirport}
            </Typography>
          </Box>
        </Box>

        {/* Date */}
        <Typography variant="body2" sx={{ color: '#595959', minWidth: 60 }}>
          {segment.date}
        </Typography>
      </Box>
    </Box>
  );
};

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const [expanded, setExpanded] = useState(false);

  const getSegmentLabel = (index: number, tripType: string, totalSegments: number): string | undefined => {
    if (tripType === 'round-trip') {
      return index === 0 ? 'Outbound' : 'Return';
    }
    if (tripType === 'multi-city') {
      return `Flight ${index + 1} of ${totalSegments}`;
    }
    return undefined;
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderColor: '#0071c2',
        },
        transition: 'all 0.2s ease',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Deal/Badge Row */}
        {(flight.isCheapest || flight.isBest || flight.isFastest || flight.dealType) && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            {flight.isCheapest && (
              <Chip
                label="Cheapest"
                size="small"
                sx={{ bgcolor: '#e6f7ed', color: '#008234', fontWeight: 600 }}
              />
            )}
            {flight.isBest && (
              <Chip
                label="Best"
                size="small"
                sx={{ bgcolor: '#fef3cd', color: '#856404', fontWeight: 600 }}
              />
            )}
            {flight.isFastest && (
              <Chip
                label="Fastest"
                size="small"
                icon={<AccessTime sx={{ fontSize: 14 }} />}
                sx={{ bgcolor: '#e3f2fd', color: '#0071c2', fontWeight: 600 }}
              />
            )}
            {flight.dealType && (
              <Chip
                label={flight.dealType}
                size="small"
                sx={{ bgcolor: '#f8e6f1', color: '#a61a6e', fontWeight: 600 }}
              />
            )}
          </Box>
        )}

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Flight Segments */}
          <Box sx={{ flex: 1 }}>
            {/* Show first segment (and second for round-trip) in collapsed view */}
            <SegmentRow
              segment={flight.segments[0]}
              label={getSegmentLabel(0, flight.tripType, flight.segments.length)}
            />
            {flight.tripType === 'round-trip' && flight.segments[1] && (
              <SegmentRow
                segment={flight.segments[1]}
                label={getSegmentLabel(1, flight.tripType, flight.segments.length)}
              />
            )}

            {/* Additional segments for multi-city in collapsed state */}
            {flight.tripType === 'multi-city' && !expanded && flight.segments.length > 1 && (
              <Typography variant="body2" sx={{ color: '#0071c2', mt: 1 }}>
                + {flight.segments.length - 1} more flight{flight.segments.length > 2 ? 's' : ''}
              </Typography>
            )}

            {/* Expanded segments for multi-city */}
            <Collapse in={expanded}>
              {flight.tripType === 'multi-city' &&
                flight.segments.slice(1).map((segment, index) => (
                  <SegmentRow
                    key={index + 1}
                    segment={segment}
                    label={getSegmentLabel(index + 1, flight.tripType, flight.segments.length)}
                  />
                ))}
            </Collapse>
          </Box>

          {/* Price & Action Column */}
          <Box
            sx={{
              minWidth: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ textAlign: 'right' }}>
              {flight.originalPrice && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: 'line-through',
                    color: '#595959',
                  }}
                >
                  ${flight.originalPrice}
                </Typography>
              )}
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                ${flight.price}
              </Typography>
              <Typography variant="caption" sx={{ color: '#595959' }}>
                {flight.tripType === 'round-trip' ? 'round trip' : flight.tripType}
              </Typography>
            </Box>

            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: '#0071c2',
                '&:hover': { bgcolor: '#005999' },
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Select
            </Button>
          </Box>
        </Box>

        {/* Footer: Baggage & View Details */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <BaggageIndicator baggage={flight.baggage} />
            <Typography variant="body2" sx={{ color: '#595959' }}>
              {flight.segments[0].airline}
              {flight.tripType === 'multi-city' && ' + others'}
            </Typography>
          </Stack>

          <Button
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            sx={{
              color: '#0071c2',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { bgcolor: '#e6f2fa' },
            }}
          >
            View details
          </Button>
        </Box>

        {/* Expanded Details */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Flight Details
            </Typography>
            {flight.segments.map((segment, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {getSegmentLabel(index, flight.tripType, flight.segments.length) || `Segment ${index + 1}`}
                </Typography>
                <Typography variant="body2" sx={{ color: '#595959' }}>
                  {segment.airline} • {segment.departureAirport} → {segment.arrivalAirport}
                </Typography>
                <Typography variant="body2" sx={{ color: '#595959' }}>
                  {segment.date} • {segment.duration} • {segment.stops === 0 ? 'Direct' : `${segment.stops} stop${segment.stops > 1 ? 's' : ''}`}
                </Typography>
              </Box>
            ))}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Included baggage:</Typography>
              <Typography variant="body2" sx={{ color: flight.baggage.personalItem ? '#008234' : '#595959' }}>
                • Personal item: {flight.baggage.personalItem ? 'Included' : 'Not included'}
              </Typography>
              <Typography variant="body2" sx={{ color: flight.baggage.carryOn ? '#008234' : '#595959' }}>
                • Carry-on bag: {flight.baggage.carryOn ? 'Included' : 'Not included'}
              </Typography>
              <Typography variant="body2" sx={{ color: flight.baggage.checkedBag ? '#008234' : '#595959' }}>
                • Checked bag: {flight.baggage.checkedBag ? 'Included' : 'Available for purchase'}
              </Typography>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

import type { FilterState } from './FilterSidebar';

interface FlightCardsProps {
  filters?: FilterState;
}

export const FlightCards: React.FC<FlightCardsProps> = ({ filters }) => {
  const filteredFlights = MOCK_FLIGHTS.filter((flight) => {
    // Filter by airlines
    if (filters?.airlines && filters.airlines.length > 0) {
      const flightAirlines = flight.segments.map((s) => s.airline);
      const hasMatchingAirline = flightAirlines.some((airline) =>
        filters.airlines.includes(airline)
      );
      if (!hasMatchingAirline) return false;
    }

    // Filter by stops
    if (filters?.stops && filters.stops.length > 0) {
      const maxStops = Math.max(...flight.segments.map((s) => s.stops));
      const stopCategory = maxStops >= 2 ? 2 : maxStops;
      if (!filters.stops.includes(stopCategory)) return false;
    }

    // Filter by price range
    if (filters?.priceRange) {
      if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) {
        return false;
      }
    }

    return true;
  });

  if (filteredFlights.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" sx={{ color: '#595959' }}>
          No flights match your filters
        </Typography>
        <Typography variant="body2" sx={{ color: '#595959', mt: 1 }}>
          Try adjusting your filter criteria
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ color: '#595959', mb: 2 }}>
        {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
      </Typography>
      {filteredFlights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </Box>
  );
};

export default FlightCards;

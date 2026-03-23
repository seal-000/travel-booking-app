import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Collapse,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  AccessTime,
} from '@mui/icons-material';
import { MOCK_FLIGHTS } from '../../../services/mockData';
import type { Flight, FlightSegment, FareOption, Stop } from '../../../services/mockData';
import { ViewDetailsFlight } from './ViewDetailsFlight';
import './Cards.css';

interface FlightCardProps {
  flight: Flight;
}

// Component to display the number of stops in a flight segment
const StopsIndicator: React.FC<{ stops: number; stopDetails?: Stop[] }> = ({ stops, stopDetails }) => {
  if (stops === 0) {
    return (
      <div className="stops-indicator stops-direct">
        Direct
      </div>
    );
  }
  
  return (
    <div className="stops-container">
      <div className="stops-indicator">
        {stops} {stops === 1 ? 'stop' : 'stops'}
      </div>
      {stopDetails && stopDetails.length > 0 && (
        <div className="stop-details">
          {stopDetails.map((stop, index) => (
            <div key={index} className="stop-detail-item">
              <span className="stop-airport">{stop.airport}</span>
              <span className="stop-layover">{stop.layoverTime}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SegmentRow: React.FC<{ segment: FlightSegment; label?: string }> = ({ segment, label }) => {
  return (
    <Box className="segment-row">
      {label && (
        <Typography variant="caption" className="segment-label">
          {label}
        </Typography>
      )}
      <Box className="segment-content">
        {/* Airline Logo & Date Row (mobile) */}
        <Box className="airline-header">
          <img
            src={segment.airlineLogo}
            alt={segment.airline}
            className="airline-logo"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = 'https://via.placeholder.com/32?text=✈';
            }}
          />

          {/* Date - shown inline on mobile */}
          <Typography 
            variant="body2" 
            className="segment-date-mobile"
          >
            {segment.date}
          </Typography>
        </Box>

        {/* Flight Times & Route */}
        <Box className="flight-route">
          {/* Departure */}
          <Box className="time-box">
            <Typography 
              variant="h6" 
              className="time-display"
            >
              {segment.departureTime}
            </Typography>
            <Typography variant="body2" className="airport-code">
              {segment.departureAirport}
            </Typography>
          </Box>

          {/* Flight Line */}
          <Box className="flight-line-container">
            <Box className="flight-line">
              <FlightTakeoff sx={{ color: '#0071c2' }} />
              <Box className="flight-line-bar">
                <Typography variant="caption" className="flight-duration">
                  {segment.duration}
                </Typography>
              </Box>
              <FlightLand sx={{ color: '#0071c2' }} />
            </Box>
            <StopsIndicator stops={segment.stops} stopDetails={segment.stopDetails} />
          </Box>

          {/* Arrival */}
          <Box className="time-box">
            <Typography 
              variant="h6" 
              className="time-display"
            >
              {segment.arrivalTime}
            </Typography>
            <Typography variant="body2" className="airport-code">
              {segment.arrivalAirport}
            </Typography>
          </Box>
        </Box>

        {/* Date - hidden on mobile, shown on larger screens */}
        <Typography 
          variant="body2" 
          className="segment-date-desktop"
        >
          {segment.date}
        </Typography>
      </Box>
    </Box>
  );
};

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const [expanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedFare] = useState<{ fare: FareOption; price: number } | null>(null);

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
    <Card className="flight-card">
      <CardContent className="flight-card-content">
        {/* Deal/Badge Row */}
        {(flight.isCheapest || flight.isBest || flight.isFastest || flight.dealType) && (
          <Box className="badge-row">
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
        <Box className="flight-card-main">
          {/* Flight Segments */}
          <Box className="flight-segments">
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
              <Typography variant="body2" className="more-flights">
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
          <Box className="price-action-column">
            {/* Price Section */}
            <Box className="price-section">
              {flight.originalPrice && (
                <Typography
                  variant="body2"
                  className="original-price"
                >
                  ${flight.originalPrice}
                </Typography>
              )}
              <Typography 
                variant="h5" 
                className="current-price"
              >
                ${flight.price}
              </Typography>
              <Typography variant="caption" className="price-label">
                {flight.tripType === 'round-trip' ? 'round trip' : flight.tripType}
              </Typography>
            </Box>

            {/* Buttons Section */}
            <Box className="action-buttons">
              <Button
                variant="contained"
                size="small"
                onClick={() => setShowDetails(true)}
                className="primary-button"
              >
                View Details
              </Button>
            </Box>
          </Box>
        </Box>

        {/* View Details Dialog */}
        <ViewDetailsFlight
          flight={flight}
          initialFare={selectedFare?.fare || flight.fareOptions?.[0]}
          open={showDetails}
          onClose={() => setShowDetails(false)}
        />
      </CardContent>
    </Card>
  );
};

import type { FilterState } from '../FilterSidebar';

interface FlightCardsProps {
  filters?: FilterState;
  flights?: Flight[];
}

export const FlightCards: React.FC<FlightCardsProps> = ({ filters, flights: initialFlights }) => {
  const flightsList = initialFlights || MOCK_FLIGHTS;
  const filteredFlights = flightsList.filter((flight: Flight) => {
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
      <Box className="empty-state">
        <Typography variant="h6" className="empty-state-title">
          No flights match your filters
        </Typography>
        <Typography variant="body2" className="empty-state-subtitle">
          Try adjusting your filter criteria
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" className="flights-count">
        {filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found
      </Typography>
      {filteredFlights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </Box>
  );
};

export default FlightCards;

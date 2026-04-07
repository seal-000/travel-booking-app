import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  AccessTime,
} from '@mui/icons-material';
import type { Flight, FlightSegment, FareOption, Stop } from '../../../services/types';
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
      
      {/* Airline Logo & Date */}
      <Box className="segment-content">
        <Box className="airline-header">
          <img
            src={segment.airlineLogo}
            alt={segment.airline}
            className="airline-logo"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              const img = e.currentTarget;
              // Only set fallback once to prevent infinite error loop
              if (!img.hasAttribute('data-fallback-tried')) {
                img.setAttribute('data-fallback-tried', 'true');
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="15" fill="%230071c2"/%3E%3Ctext x="16" y="20" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle"%3E✈%3C/text%3E%3C/svg%3E';
              }
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
      </Box>

      {/* Flight Times & Route */}
      <Box className="segment-content">
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
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  console.log('First card flight data:', flight);
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
            {/* Show all segments for one-way, round-trip, and multi-city flights */}
            {flight.segments.map((segment, index) => (
              <SegmentRow
                key={index}
                segment={segment}
                label={getSegmentLabel(index, flight.tripType, flight.segments.length)}
              />
            ))}
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
  const flightsList = initialFlights || [];

  if (flightsList.length === 0) {
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
        {flightsList.length} flight{flightsList.length !== 1 ? 's' : ''} found
      </Typography>
      {flightsList.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </Box>
  );
};

export default FlightCards;

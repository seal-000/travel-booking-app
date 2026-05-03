import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  Luggage
} from '@mui/icons-material';
import type { Flight, FareOption, FlightSegment } from '../../../services/types';

interface ViewDetailsFlightProps {
  flight: Flight;
  initialFare?: FareOption;
  onClose?: () => void;
  open: boolean;
}

const FlightSegmentDetail: React.FC<{ segment: FlightSegment; label?: string }> = ({ segment, label }) => {
  return (
    <Box sx={{ mb: 3 }}>
      {label && (
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
          {label}
        </Typography>
      )}
      <Card sx={{ bgcolor: '#fafafa', border: '1px solid #e0e0e0' }}>
        <CardContent>
          {/* Header with airline */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                {segment.airline}
              </Typography>
              <Typography variant="caption" sx={{ color: '#595959' }}>
                {segment.date}
              </Typography>
            </Box>
          </Box>

          {/* Flight route and times */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {/* Departure */}
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                {segment.departureTime}
              </Typography>
              <Typography variant="body2" sx={{ color: '#595959', fontWeight: 600 }}>
                {segment.departureAirport}
              </Typography>
              <Typography variant="caption" sx={{ color: '#595959', fontSize: 11 }}>
                {segment.departureAirportName || segment.departureAirport}
              </Typography>
            </Box>

            {/* Flight line */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                    <Typography variant="caption" sx={{ color: '#595959', fontSize: 10 }}>
                      {segment.duration}
                    </Typography>
                  </Box>
                </Box>
                <FlightLand sx={{ fontSize: 16, color: '#0071c2' }} />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#595959', mt: 0.5, fontWeight: 600 }}>
                  {segment.stops === 0 ? 'Direct' : `${segment.stops} stop${segment.stops > 1 ? 's' : ''}`}
                </Typography>
                {segment.stopDetails && segment.stopDetails.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {segment.stopDetails.map((stop, index) => (
                      <Typography key={index} variant="caption" sx={{ display: 'block', color: '#8a8a8a', mt: 0.5 }}>
                        {stop.airport} • {stop.layoverTime} layover
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Arrival */}
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
                {segment.arrivalTime}
              </Typography>
              <Typography variant="body2" sx={{ color: '#595959', fontWeight: 600 }}>
                {segment.arrivalAirport}
              </Typography>
              <Typography variant="caption" sx={{ color: '#595959', fontSize: 11 }}>
                {segment.arrivalAirportName || segment.arrivalAirport}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export const ViewDetailsFlight: React.FC<ViewDetailsFlightProps> = ({
  flight,
  onClose,
  open,
}) => {
  const priceLabel = flight.tripType === 'round-trip' ? 'round trip' : flight.tripType;

  const getSegmentLabel = (index: number): string | undefined => {
    if (flight.tripType === 'round-trip') {
      return index === 0 ? 'Flight to destination' : 'Flight to home';
    }
    if (flight.tripType === 'multi-city') {
      return `Leg ${index + 1} of ${flight.segments.length}`;
    }
    return 'Flight Details';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          bgcolor: '#f5f5f5',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Your flight details
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ py: 3 }}>
        {/* Flight Segments */}
        <Box sx={{ mb: 4 }}>
          {flight.segments.map((segment, index) => (
            <FlightSegmentDetail
              key={index}
              segment={segment}
              label={getSegmentLabel(index)}
            />
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Baggage Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Baggage Details
          </Typography>
          <Typography variant="body2" sx={{ color: '#595959', mb: 2 }}>
            Included in your standard fare
          </Typography>

          <Stack spacing={2}>
            {flight.baggage?.personalItem > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Luggage sx={{ color: '#008234', mt: 0.5, fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {flight.baggage.personalItem} Personal Item{flight.baggage.personalItem > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#595959' }}>
                    Must fit under the seat in front of you
                  </Typography>
                  <Chip label="Included" size="small" sx={{ mt: 0.5, bgcolor: '#e6f7ed', color: '#008234', fontWeight: 600, display: 'block', width: 'fit-content' }} />
                </Box>
              </Box>
            )}
            
            {flight.baggage?.carryOn > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Luggage sx={{ color: '#008234', mt: 0.5, fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {flight.baggage.carryOn} Carry-on Bag{flight.baggage.carryOn > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#595959' }}>
                    Must fit in the overhead bin
                  </Typography>
                  <Chip label="Included" size="small" sx={{ mt: 0.5, bgcolor: '#e6f7ed', color: '#008234', fontWeight: 600, display: 'block', width: 'fit-content' }} />
                </Box>
              </Box>
            ) : (
               <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Luggage sx={{ color: '#d32f2f', mt: 0.5, fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Carry-on Bag Not Included
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#595959' }}>
                    Available for purchase during checkout
                  </Typography>
                </Box>
              </Box>
            )}

            {flight.baggage?.checkedBag > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Luggage sx={{ color: '#008234', mt: 0.5, fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {flight.baggage.checkedBag} Checked Bag{flight.baggage.checkedBag > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#595959' }}>
                    Standard weight limits apply
                  </Typography>
                  <Chip label="Included" size="small" sx={{ mt: 0.5, bgcolor: '#e6f7ed', color: '#008234', fontWeight: 600, display: 'block', width: 'fit-content' }} />
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Luggage sx={{ color: '#595959', mt: 0.5, fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Checked Bag Not Included
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#595959' }}>
                    Available for purchase during checkout
                  </Typography>
                </Box>
              </Box>
            )}
          </Stack>
        </Box>
      </DialogContent>

      {/* Footer with pricing */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #e0e0e0',
          bgcolor: '#f5f5f5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: '#595959' }}>
            Total price for your {priceLabel}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
            ${flight.price}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} sx={{ color: '#595959' }}>
            Close
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#0071c2',
              '&:hover': { bgcolor: '#005999' },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Continue Booking
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default ViewDetailsFlight;

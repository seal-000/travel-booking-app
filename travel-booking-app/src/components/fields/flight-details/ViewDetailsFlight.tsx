import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Stack,
  Dialog,
  DialogContent,
} from '@mui/material';
import {
  AccessTime,
  Luggage,
  Backpack,
  CardTravel,
} from '@mui/icons-material';
import type { Flight, FlightSegment } from '../../../services/types';

interface ViewDetailsFlightProps {
  flight: Flight;
  onClose?: () => void;
  open: boolean;
}

const FlightSegmentDetail: React.FC<{ segment: FlightSegment; label?: string }> = ({ segment, label }) => {
  return (
    <Box sx={{ mb: 6 }}>
      {label && (
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <Typography variant="body1" sx={{ color: '#595959', mb: 3 }}>
        {segment.stops === 0 ? 'Direct' : `${segment.stops} stop${segment.stops > 1 ? 's' : ''}`} · {segment.duration}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 1 }}>
        {segment.legs && segment.legs.length > 0 ? (
          segment.legs.map((leg, legIndex) => (
            <React.Fragment key={legIndex}>
              {/* Departure */}
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, mr: 2 }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #595959', bgcolor: 'white', zIndex: 2 }} />
                  <Box sx={{ width: '1px', flexGrow: 1, bgcolor: '#595959', minHeight: 60, my: 0.5 }} />
                </Box>
                <Box sx={{ flex: 1, pb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#595959', mb: 0.5 }}>
                      {leg.departureDate} · {leg.departureTime}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                      {leg.departureAirport}
                    </Typography>
                  </Box>
                  {/* Airline Info */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box
                      component="img"
                      src={leg.airlineLogo}
                      alt={leg.airline}
                      sx={{ width: 24, height: 24, objectFit: 'contain' }}
                    />
                    <Box>
                      <Typography variant="body2" sx={{ color: '#595959' }}>{leg.airline}</Typography>
                      <Typography variant="caption" sx={{ color: '#8a8a8a', display: 'block' }}>{leg.flightNumber}</Typography>
                      <Typography variant="caption" sx={{ color: '#8a8a8a', display: 'block' }}>Flight time {leg.duration}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Arrival */}
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, mr: 2 }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid #595959', bgcolor: 'white', zIndex: 2 }} />
                  {legIndex < segment.legs!.length - 1 && (
                    <Box sx={{ width: 0, flexGrow: 1, minHeight: 40 }} />
                  )}
                </Box>
                <Box sx={{ flex: 1, pb: legIndex < segment.legs!.length - 1 ? 2 : 0 }}>
                  <Typography variant="body2" sx={{ color: '#595959', mb: 0.5 }}>
                    {leg.arrivalDate} · {leg.arrivalTime}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    {leg.arrivalAirport}
                  </Typography>
                </Box>
              </Box>

              {/* Layover (if not the last leg) */}
              {legIndex < segment.legs!.length - 1 && segment.stopDetails?.[legIndex] && (
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Box sx={{ width: 24, mr: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 18, color: '#595959' }} />
                    <Typography variant="body2" sx={{ color: '#595959', my: 2.5 }}>
                      Layover {segment.stopDetails[legIndex].layoverTime}
                    </Typography>
                  </Box>
                </Box>
              )}
            </React.Fragment>
          ))
        ) : (
          /* Fallback for older data */
          <Box>
            <Typography variant="body2">No detailed legs available.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const ViewDetailsFlight: React.FC<ViewDetailsFlightProps> = ({
  flight,
  onClose,
  open,
}) => {
  console.log('ViewDetailsFlight received flight data:', flight
  );

  
  const benefits: string[] = [];
  if (flight.baggage) {
    const personalItemQty = flight.baggage.personalItem || 0;
    const carryOnQty = flight.baggage.carryOn || 0;
    const checkedBagQty = flight.baggage.checkedBag || 0;

    if (personalItemQty > 0) benefits.push(`${personalItemQty} personal item${personalItemQty > 1 ? 's' : ''}`);
    if (carryOnQty > 0) benefits.push(`${carryOnQty} carry-on bag${carryOnQty > 1 ? 's' : ''}`);
    if (checkedBagQty > 0) benefits.push(`${checkedBagQty} checked bag${checkedBagQty > 1 ? 's' : ''}`);
  }
  if (benefits.length === 0) {
    benefits.push('1 personal item'); // Default fallback
  }

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
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: '0 0 250px' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Baggage
            </Typography>
            <Typography variant="body2" sx={{ color: '#595959' }}>
              The total baggage included in the price
            </Typography>
          </Box>

          <Stack spacing={2} sx={{ flex: 1 }}>
            {benefits
              .filter(
                (benefit) =>
                  benefit.includes('personal item') ||
                  benefit.includes('carry-on') ||
                  benefit.includes('checked bag')
              )
              .map((benefit, index) => {
                let Icon = Luggage;
                if (benefit.includes('personal item')) Icon = Backpack;
                else if (benefit.includes('carry-on')) Icon = CardTravel;

                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Icon sx={{ color: '#595959', mt: 0.5, fontSize: 24 }} />
                      <Box>
                      <Typography variant="body2" sx={{ color: '#1a1a1a' }}>
                        {benefit.split('(')[0].trim()}
                      </Typography>
                      {benefit.includes('(') && (
                        <Typography variant="caption" sx={{ color: '#595959' }}>
                          {benefit.split('(')[1].replace(')', '')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#008234', fontWeight: 600 }}>
                    Included
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Box>


        <Divider sx={{ my: 3 }} />

       
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
            disabled
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

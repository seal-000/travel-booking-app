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
  Luggage,
  CheckCircle,
} from '@mui/icons-material';
import type { Flight, FareOption, FlightSegment } from '../../../services/types';

interface ViewDetailsFlightProps {
  flight: Flight;
  initialFare?: FareOption;
  onClose?: () => void;
  open: boolean;
}

const getAirportName = (code: string): string => {
  const airports: { [key: string]: string } = {
    JFK: 'John F. Kennedy International Airport',
    LGA: 'LaGuardia Airport',
    EWR: 'Newark Liberty International Airport',
    CDG: 'Paris Charles de Gaulle Airport',
    LHR: 'London Heathrow Airport',
    ORY: 'Paris Orly Airport',
    IST: 'Istanbul Airport',
    KEF: 'Keflavik International Airport',
    FRA: 'Frankfurt am Main Airport',
    MAD: 'Adolfo Suarez Madrid-Barajas Airport',
  };
  return airports[code] || code;
};

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
                {getAirportName(segment.departureAirport)}
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
                {getAirportName(segment.arrivalAirport)}
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
  initialFare,
  onClose,
  open,
}) => {
  const [selectedFare, setSelectedFare] = useState<FareOption | null>(
    initialFare || flight.fareOptions?.[0] || null
  );
  const [showFareSelector, setShowFareSelector] = useState(false);

  if (!selectedFare) {
    return null;
  }

  const adjustedPrice = Math.round(flight.price * selectedFare.priceModifier);
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
            Baggage - Included in {selectedFare.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#595959', mb: 2 }}>
            The total baggage included in the price
          </Typography>

          <Stack spacing={1.5}>
            {selectedFare.benefits
              .filter(
                (benefit) =>
                  benefit.includes('personal item') ||
                  benefit.includes('carry-on') ||
                  benefit.includes('checked bag')
              )
              .map((benefit, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Luggage sx={{ color: '#008234', mt: 0.5, fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                      {benefit.split('(')[0].trim()}
                    </Typography>
                    {benefit.includes('(') && (
                      <Typography variant="caption" sx={{ color: '#595959' }}>
                        {benefit.split('(')[1]}
                      </Typography>
                    )}
                    <Chip
                      label="Included"
                      size="small"
                      sx={{
                        mt: 0.5,
                        bgcolor: '#e6f7ed',
                        color: '#008234',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              ))}
          </Stack>

          {/* Fare rules */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#fafafa', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#1a1a1a' }}>
              Fare rules
            </Typography>
            <Stack spacing={0.5}>
              {selectedFare.benefits
                .filter(
                  (benefit) =>
                    benefit.includes('change') ||
                    benefit.includes('refund') ||
                    benefit.includes('free') ||
                    benefit.includes('allowed')
                )
                .map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: '#008234' }} />
                    <Typography variant="body2" sx={{ color: '#595959' }}>
                      {benefit}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Fare Selection */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Current fare: <span style={{ color: '#0071c2' }}>{selectedFare.name}</span>
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowFareSelector(true)}
              sx={{
                color: '#0071c2',
                border: '1px solid #0071c2',
                textTransform: 'none',
              }}
            >
              Change fare
            </Button>
          </Box>
          <Typography variant="body2" sx={{ color: '#595959' }}>
            You selected {selectedFare.name}. Want something different?
          </Typography>
        </Box>

        {/* Better fares available */}
       

        {/* Extras you might like */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
            Extras you might like
          </Typography>
          <Stack spacing={1}>
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Checked bag
                </Typography>
                <Typography variant="caption" sx={{ color: '#595959' }}>
                  Additional baggage
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                  From $151.98
                </Typography>
                <Typography variant="caption" sx={{ color: '#595959' }}>
                  Available in next steps
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Flexible ticket
                </Typography>
                <Typography variant="caption" sx={{ color: '#595959' }}>
                  Date change possible
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                  +$102.65
                </Typography>
                <Typography variant="caption" sx={{ color: '#595959' }}>
                  For all travelers
                </Typography>
              </Box>
            </Box>
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
            ${adjustedPrice}
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

      {/* Fare Selector Dialog */}
      <Dialog
        open={showFareSelector}
        onClose={() => setShowFareSelector(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Change Fare</DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Stack spacing={1.5}>
            {flight.fareOptions?.map((fare) => {
              const farePrice = Math.round(flight.price * fare.priceModifier);
              const isSelected = selectedFare.name === fare.name;

              return (
                <Box
                  key={fare.name}
                  sx={{
                    p: 2,
                    border: isSelected ? '2px solid #0071c2' : '1px solid #e0e0e0',
                    borderRadius: 1,
                    cursor: 'pointer',
                    bgcolor: isSelected ? 'rgba(0, 113, 194, 0.04)' : 'white',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#0071c2' },
                  }}
                  onClick={() => {
                    setSelectedFare(fare);
                    setShowFareSelector(false);
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      <Radio checked={isSelected} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {fare.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#595959' }}>
                          {fare.benefits.length} included benefits
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                      ${farePrice}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowFareSelector(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ViewDetailsFlight;

import { Box } from '@mui/material';
import './FlightSearchBox.css';
import TripOptionsRow from '../layout/TripOptionsRow';
import { useState } from 'react';
import TripRouteAndDateRow from '../layout/TripRouteAndDateRow';
import type { Airport } from '../../services/airportService';
import type { Dayjs } from 'dayjs';
import { SubmitButton } from '../fields/SubmitButton';

const FlightSearchBox = () => {

    // For trip type, we can use 'oneway', 'roundtrip', 'multicity'
    const [tripType, setTripType] = useState('oneway');

    // For cabin class, we can use 'economy', 'premium_economy', 'business', 'first'
    const [cabinClass, setCabinClass] = useState('economy');

    // For direct flights only filter
    const [directFlightsOnly, setDirectFlightsOnly] = useState(false);

    // For multi-city, we can have up to 3 segments (2 for departure/arrival pairs)
    const [multiCitySegments, setMultiCitySegments] = useState(2);

    // For guests, we can have adults and children counts
    const [guests, setGuests] = useState({ adults: 1, children: 0 });

    // For one-way and roundtrip: single departure/arrival
    const [departure, setDeparture] = useState<Airport | null>(null);
    const [arrival, setArrival] = useState<Airport | null>(null);

    // For one-way and roundtrip: dates
    const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
    const [returnDate, setReturnDate] = useState<Dayjs | null>(null); // only used for roundtrip

    // For multi-city: array of segments with departure/arrival/date
    const [multiCityRoutes, setMultiCityRoutes] = useState<Array<{ departure: Airport | null; arrival: Airport | null; date: Dayjs | null }>>([
        { departure: null, arrival: null, date: null },
        { departure: null, arrival: null, date: null },
        { departure: null, arrival: null, date: null }
    ]);
    console.log(departure, arrival);
    console.log(departureDate, returnDate);
    console.log(multiCityRoutes);
    
    const getTripTypeLabel = () => {
    if (tripType === 'roundtrip') return 'Round Trip';
    if (tripType === 'oneway') return 'One Way';
    if (tripType === 'multicity') return 'Multi-City';
    return 'Round Trip'; // default fallback
    };
    
    return (


        <Box className="flight-search-box">
            
            {/*<p>{getTripTypeLabel()}</p>}*/}

            <TripOptionsRow 
                tripType={tripType} 
                onTripTypeChange={setTripType}
                cabinClass={cabinClass}
                onCabinClassChange={setCabinClass}
                directFlightsOnly={directFlightsOnly}
                onDirectFlightsChange={setDirectFlightsOnly}
                guests={guests}
                onGuestUpdate={setGuests}
            />
            <TripRouteAndDateRow 
                tripType={tripType}
                segmentCount={multiCitySegments}
                onSegmentCountChange={setMultiCitySegments}
                guests={guests}
                onGuestUpdate={setGuests}
                departure={departure}
                arrival={arrival}
                onDepartureChange={setDeparture}
                onArrivalChange={setArrival}
                departureDate={departureDate}
                returnDate={returnDate}
                onDepartureDateChange={setDepartureDate}
                onReturnDateChange={setReturnDate}
                multiCityRoutes={multiCityRoutes}
                onMultiCityRoutesChange={setMultiCityRoutes}
            />
          
            <Box>

                {tripType === 'multicity' && (
                <button onClick={() => setMultiCitySegments(multiCitySegments + 1)}
                disabled={multiCitySegments >= 3}
                >
                    Add flight
                </button>
            )}


            </Box>

            <SubmitButton className="search-button" label="Search Flights" />

        </Box>
    );

 };
    export default FlightSearchBox;
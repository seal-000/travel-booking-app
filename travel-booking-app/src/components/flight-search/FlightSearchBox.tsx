import { Box, Snackbar, Alert } from '@mui/material';
import './FlightSearchBox.css';
import TripOptionsRow from '../layout/TripOptionsRow';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripRouteAndDateRow from '../layout/TripRouteAndDateRow';
import type { Airport } from '../../services/airportService';
import type { Dayjs } from 'dayjs';
import { SubmitButton } from '../fields/SubmitButton';

const FlightSearchBox = () => {
    const navigate = useNavigate();

    // For trip type, we can use 'oneway', 'roundtrip', 'multicity'
    const [tripType, setTripType] = useState('oneway');
    const [showError, setShowError] = useState(false);

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

    const handleSearch = () => {
        // Validate required fields
        if (tripType === 'multicity') {
            for (let i = 0; i < multiCitySegments; i++) {
                if (!multiCityRoutes[i].departure || !multiCityRoutes[i].arrival || !multiCityRoutes[i].date) {
                    setShowError(true);
                    return;
                }
            }
        } else {
            if (!departure || !arrival || !departureDate || (tripType === 'roundtrip' && !returnDate)) {
                setShowError(true);
                return;
            }
        }

        console.log('=== Flight Search Data ===');
        console.log('Trip Type:', tripType);
        console.log('Cabin Class:', cabinClass);
        console.log('Direct Flights Only:', directFlightsOnly);
        console.log('Guests:', guests);
        
        if (tripType === 'multicity') {
            console.log('Multi-City Segments:', multiCitySegments);
            console.log('Multi-City Routes:', multiCityRoutes);
        } else {
            console.log('Departure:', departure);
            console.log('Arrival:', arrival);
            console.log('Departure Date:', departureDate?.format('YYYY-MM-DD'));
            if (tripType === 'roundtrip') {
                console.log('Return Date:', returnDate?.format('YYYY-MM-DD'));
            }
        }
        console.log('=========================');

        // Build search params and navigate to search results
        const searchParams = new URLSearchParams();
        searchParams.set('tripType', tripType);
        searchParams.set('cabinClass', cabinClass);
        searchParams.set('directFlightsOnly', String(directFlightsOnly));
        searchParams.set('adults', String(guests.adults));
        searchParams.set('children', String(guests.children));

        if (tripType === 'multicity') {
            searchParams.set('segments', multiCitySegments.toString());
            for (let i = 0; i < multiCitySegments; i++) {
                searchParams.set(`departure${i}`, multiCityRoutes[i].departure?.code || '');
                searchParams.set(`arrival${i}`, multiCityRoutes[i].arrival?.code || '');
                searchParams.set(`date${i}`, multiCityRoutes[i].date?.format('YYYY-MM-DD') || '');
            }
        } else {
            searchParams.set('departure', departure?.code || '');
            searchParams.set('arrival', arrival?.code || '');
            searchParams.set('departureDate', departureDate?.format('YYYY-MM-DD') || '');
            if (tripType === 'roundtrip' && returnDate) {
                searchParams.set('returnDate', returnDate.format('YYYY-MM-DD'));
            }
        }

        navigate(`/flights?${searchParams.toString()}`);
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

            <SubmitButton className="search-button" label="Search Flights" onSubmit={handleSearch} />
            {/*To-do: Implement search functionality - API URL*/}

            <Snackbar
                open={showError}
                autoHideDuration={3000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" onClose={() => setShowError(false)}>One of the values is not completed</Alert>
            </Snackbar>
        </Box>
    );

 };
    export default FlightSearchBox;
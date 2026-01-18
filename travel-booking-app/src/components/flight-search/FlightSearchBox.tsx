import { Box } from '@mui/material';
import './FlightSearchBox.css';
import TripOptionsRow from '../layout/TripOptionsRow';
import { useState } from 'react';
import TripRouteAndDateRow from '../layout/TripRouteAndDateRow';

const FlightSearchBox = () => {

    const [tripType, setTripType] = useState('oneway');
    const [cabinClass, setCabinClass] = useState('economy');
    const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
    const [multiCitySegments, setMultiCitySegments] = useState(2);
    
    const getTripTypeLabel = () => {
    if (tripType === 'roundtrip') return 'Round Trip';
    if (tripType === 'oneway') return 'One Way';
    if (tripType === 'multicity') return 'Multi-City';
    return 'Round Trip'; // default fallback
    };
    
    return (


        <Box className="flight-search-box">
            <p>{getTripTypeLabel()}</p>
            <TripOptionsRow 
                tripType={tripType} 
                onTripTypeChange={setTripType}
                cabinClass={cabinClass}
                onCabinClassChange={setCabinClass}
                directFlightsOnly={directFlightsOnly}
                onDirectFlightsChange={setDirectFlightsOnly}
            />
            <TripRouteAndDateRow 
                tripType={tripType}
                segmentCount={multiCitySegments}
            />
          
            <Box>

                  {tripType === 'multicity' && (
                <button onClick={() => setMultiCitySegments(multiCitySegments + 1)}>
                    Add flight
                </button>
            )}


            </Box>

        </Box>
    );

 };
    export default FlightSearchBox;
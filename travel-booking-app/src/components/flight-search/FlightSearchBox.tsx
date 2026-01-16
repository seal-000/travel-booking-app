import { Box } from '@mui/material';
import './FlightSearchBox.css';
import TripOptionsRow from '../layout/TripOptionsRow';
import { useState } from 'react';

const FlightSearchBox = () => {

    const [tripType, setTripType] = useState('oneway');
    const [cabinClass, setCabinClass] = useState('economy');
    
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
            />
        </Box>
    );

 };
    export default FlightSearchBox;
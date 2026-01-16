import React from 'react';
import './TripOptionsRow.css';
import TripTypeRadioGroup from '../fields/TripTypeRadioGroup';
import FormControlMenu from '../fields/FormControlMenu';
import FormControlLabel from '../fields/FormControlLabel';

interface TripOptionsRowProps {
  tripType: string;
  onTripTypeChange: (value: string) => void;
  cabinClass: string;
  onCabinClassChange: (value: string) => void;
  directFlightsOnly: boolean;
  onDirectFlightsChange: (checked: boolean) => void;
}

const TripOptionsRow: React.FC<TripOptionsRowProps> = ({ tripType, onTripTypeChange, cabinClass, onCabinClassChange, directFlightsOnly, onDirectFlightsChange }) => {
    
    const tripOptions = [
        { label: 'Round Trip', value: 'roundtrip' },
        { label: 'One Way', value: 'oneway' },
        { label: 'Multi-City', value: 'multicity' },
    ];
    
    const cabinOptions = [
        { label: 'Economy', value: 'economy' },
        { label: 'Premium Economy', value: 'premium' },
        { label: 'Business', value: 'business' },
        { label: 'First Class', value: 'firstclass' },
    ];
    
    
    return (
        <div className="trip-options-row">
            <TripTypeRadioGroup value={tripType} onChange={onTripTypeChange} options={tripOptions} />
            
            <div className='trip-options-right'>
            <FormControlMenu 
                label="Cabin Class" 
                value={cabinClass} 
                onChange={onCabinClassChange} 
                options={cabinOptions} 
            />
            {tripType !== 'multicity' && (
            <FormControlLabel
                label="Direct flights only"
                checked={directFlightsOnly}
                onChange={onDirectFlightsChange}
                />
            )}
            </div>
        </div>
    );
};

export default TripOptionsRow;
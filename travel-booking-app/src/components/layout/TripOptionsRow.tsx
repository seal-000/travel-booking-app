import React from 'react';
import './TripOptionsRow.css';
import TripTypeRadioGroup from '../fields/TripTypeRadioGroup';
import FormControl from '../fields/FormControl';

interface TripOptionsRowProps {
  tripType: string;
  onTripTypeChange: (value: string) => void;
  cabinClass: string;
  onCabinClassChange: (value: string) => void;
}

const TripOptionsRow: React.FC<TripOptionsRowProps> = ({ tripType, onTripTypeChange, cabinClass, onCabinClassChange }) => {
    
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
            <FormControl 
                label="Cabin Class" 
                value={cabinClass} 
                onChange={onCabinClassChange} 
                options={cabinOptions} 
            />
        </div>
    );
};

export default TripOptionsRow;
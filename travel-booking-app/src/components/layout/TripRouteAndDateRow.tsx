import { useState, useEffect } from 'react';
import type { Airport } from '../../services/airportService';
import DepartureLocation from '../fields/DepartureLocation';
import ArrivalLocation from '../fields/ArrivalLocation';
import SwapButton from '../fields/SwapButton';
import DateRangePickerComponent from '../fields/DateRangePicker';
import DatePickerComponent from '../fields/DatePicker';
import GuestSelector from '../fields/GuestSelector';

interface TripRouteAndDateRowProps {
    tripType: string;
    segmentCount: number;
    onSegmentCountChange?: (newCount: number) => void;
    guests?: { adults: number; children: number };
    onGuestUpdate?: (guests: { adults: number; children: number }) => void;
}

const TripRouteAndDateRow = ({ tripType, segmentCount, onSegmentCountChange, guests = { adults: 1, children: 0 }, onGuestUpdate }: TripRouteAndDateRowProps) => {
    const [departures, setDepartures] = useState<(Airport | null)[]>(
        Array(segmentCount).fill(null)
    );
    const [arrivals, setArrivals] = useState<(Airport | null)[]>(
        Array(segmentCount).fill(null)
    );

    const handleDepartureChange = (index: number, airport: Airport) => {
        console.log(`Departure changed at index ${index}:`, airport);
        const newDepartures = [...departures];
        newDepartures[index] = airport;
        setDepartures(newDepartures);
        console.log('Updated departures array:', newDepartures);
    };

    const handleArrivalChange = (index: number, airport: Airport) => {
        console.log(`Arrival changed at index ${index}:`, airport);
        const newArrivals = [...arrivals];
        newArrivals[index] = airport;
        setArrivals(newArrivals);
        console.log('Updated arrivals array:', newArrivals);
    };

    const handleSwap = (index: number) => {
        console.log(`Swapping departure and arrival at index ${index}`);
        const newDepartures = [...departures];
        const newArrivals = [...arrivals];
        [newDepartures[index], newArrivals[index]] = [newArrivals[index], newDepartures[index]];
        setDepartures(newDepartures);
        setArrivals(newArrivals);
        console.log('Swapped - Departures:', newDepartures, 'Arrivals:', newArrivals);
    };

    // Function to handle removing a segment
    const handleRemoveSegment = (index: number) => {
        if (segmentCount > 2) {
            const newDepartures = departures.filter((_, i) => i !== index);
            const newArrivals = arrivals.filter((_, i) => i !== index);
            setDepartures(newDepartures);
            setArrivals(newArrivals);
            onSegmentCountChange?.(segmentCount - 1);
        }
    };

    // Sync arrays when segmentCount increases (adding rows)
    useEffect(() => {
        console.log('Segment count changed to:', segmentCount);
        setDepartures(prev => {
            if (prev.length < segmentCount) {
                const newArray = [...prev, ...Array(segmentCount - prev.length).fill(null)];
                console.log('Departures array expanded:', newArray);
                return newArray;
            }
            return prev;
        });
        setArrivals(prev => {
            if (prev.length < segmentCount) {
                const newArray = [...prev, ...Array(segmentCount - prev.length).fill(null)];
                console.log('Arrivals array expanded:', newArray);
                return newArray;
            }
            return prev;
        });
    }, [segmentCount]);

    if (tripType === 'multicity') {
        return (
            <>
                {Array.from({ length: segmentCount }, (_, index) => (
                    <div className="trip-options-row" key={index}>
                        <DepartureLocation 
                            selectedAirport={departures[index]}
                            onAirportSelect={(airport) => handleDepartureChange(index, airport)}
                        />
                        <SwapButton onSwap={() => handleSwap(index)} />
                        <ArrivalLocation 
                            selectedAirport={arrivals[index]}
                            onAirportSelect={(airport) => handleArrivalChange(index, airport)}
                        />
                        <DatePickerComponent />
                        <button
                            onClick={() => handleRemoveSegment(index)}
                            //can't remove if only 2 segments left
                            disabled={segmentCount <= 2}
                            className="remove-segment-btn"
                          
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </>
        );
    }

    return (
        <div className="trip-options-row">
            <DepartureLocation 
                selectedAirport={departures[0]}
                onAirportSelect={(airport) => handleDepartureChange(0, airport)}
            />
            <SwapButton onSwap={() => handleSwap(0)} />
            <ArrivalLocation 
                selectedAirport={arrivals[0]}
                onAirportSelect={(airport) => handleArrivalChange(0, airport)}
            />
            {tripType === 'roundtrip' && (
                <DateRangePickerComponent />
            )}
            {tripType === 'oneway' && (
                <DatePickerComponent/>
            )}
            {(tripType === 'roundtrip' || tripType === 'oneway') && (
            <GuestSelector 
                guests={guests}
                onGuestUpdate={onGuestUpdate}
            />
            )}
            
        </div>
    );
};

export default TripRouteAndDateRow;
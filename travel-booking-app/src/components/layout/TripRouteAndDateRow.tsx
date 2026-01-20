import { useState, useEffect } from 'react';
import type { Airport } from '../../services/airportService';
import DepartureLocation from '../fields/DepartureLocation';

interface TripRouteAndDateRowProps {
    tripType: string;
    segmentCount: number;
    onSegmentCountChange?: (newCount: number) => void;
}

const TripRouteAndDateRow = ({ tripType, segmentCount, onSegmentCountChange }: TripRouteAndDateRowProps) => {
    const [departures, setDepartures] = useState<(Airport | null)[]>(
        Array(segmentCount).fill(null)
    );

    const handleDepartureChange = (index: number, airport: Airport) => {
        console.log(`Departure changed at index ${index}:`, airport);
        const newDepartures = [...departures];
        newDepartures[index] = airport;
        setDepartures(newDepartures);
        console.log('Updated departures array:', newDepartures);
    };

    // Function to handle removing a segment
    const handleRemoveSegment = (index: number) => {
        if (segmentCount > 2) {
            const newDepartures = departures.filter((_, i) => i !== index);
            setDepartures(newDepartures);
            onSegmentCountChange?.(segmentCount - 1);
        }
    };

    // Sync departures array when segmentCount increases (adding rows)
    useEffect(() => {
        console.log('Segment count changed to:', segmentCount);
        setDepartures(prev => {
            if (prev.length < segmentCount) {
                // Add null entries for new rows
                const newArray = [...prev, ...Array(segmentCount - prev.length).fill(null)];
                console.log('Departures array expanded:', newArray);
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
        </div>
        
        
    );
};

export default TripRouteAndDateRow;
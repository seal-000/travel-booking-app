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
        const newDepartures = [...departures];
        newDepartures[index] = airport;
        setDepartures(newDepartures);
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
        setDepartures(prev => {
            if (prev.length < segmentCount) {
                // Add null entries for new rows
                return [...prev, ...Array(segmentCount - prev.length).fill(null)];
            }
            return prev;
        });
    }, [segmentCount]);

    if (tripType === 'multicity') {
        return (
            <>
                {Array.from({ length: segmentCount }, (_, index) => (
                    <div className="trip-options-row" key={index}>
                        <DepartureLocation />
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
            <DepartureLocation />
        </div>
        
        
    );
};

export default TripRouteAndDateRow;
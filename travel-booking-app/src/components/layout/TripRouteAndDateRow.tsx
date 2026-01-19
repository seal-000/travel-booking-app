import { useState } from 'react';
import type { Airport } from '../../services/airportService';
import DepartureLocation from '../fields/DepartureLocation';

interface TripRouteAndDateRowProps {
    tripType: string;
    segmentCount: number;
}

const TripRouteAndDateRow = ({ tripType, segmentCount }: TripRouteAndDateRowProps) => {
    const [departures, setDepartures] = useState<(Airport | null)[]>(
        Array(segmentCount).fill(null)
    );

    const handleDepartureChange = (index: number, airport: Airport) => {
        const newDepartures = [...departures];
        newDepartures[index] = airport;
        setDepartures(newDepartures);
    };

    if (tripType === 'multicity') {
        return (
            <>
                {Array.from({ length: segmentCount }, (_, index) => (
                    <div className="trip-options-row" key={index}>
                        <DepartureLocation />
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
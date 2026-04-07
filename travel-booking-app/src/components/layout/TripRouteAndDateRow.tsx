import type { Airport } from '../../services/airportService';
import type { Dayjs } from 'dayjs';
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
    // For one-way and roundtrip
    departure: Airport | null;
    arrival: Airport | null;
    onDepartureChange: (airport: Airport | null) => void;
    onArrivalChange: (airport: Airport | null) => void;
    // For one-way and roundtrip dates
    departureDate: Dayjs | null;
    returnDate: Dayjs | null; // only used for roundtrip
    onDepartureDateChange: (date: Dayjs | null) => void;
    onReturnDateChange: (date: Dayjs | null) => void;
    // For multi-city
    multiCityRoutes: Array<{ departure: Airport | null; arrival: Airport | null; date: Dayjs | null }>;
    onMultiCityRoutesChange: (routes: Array<{ departure: Airport | null; arrival: Airport | null; date: Dayjs | null }>) => void;
}

const TripRouteAndDateRow = ({ 
    tripType, 
    segmentCount, 
    onSegmentCountChange, 
    guests = { adults: 1, children: 0 }, 
    onGuestUpdate,
    departure,
    arrival,
    onDepartureChange,
    onArrivalChange,
    //departureDate,
    //returnDate,
    onDepartureDateChange,
    onReturnDateChange,
    multiCityRoutes,
    onMultiCityRoutesChange
}: TripRouteAndDateRowProps) => {

    const handleMultiCityDepartureChange = (index: number, airport: Airport) => {
        console.log(`Departure changed at index ${index}:`, airport);
        const newRoutes = [...multiCityRoutes];
        newRoutes[index] = { ...newRoutes[index], departure: airport };
        onMultiCityRoutesChange(newRoutes);
    };

    const handleMultiCityArrivalChange = (index: number, airport: Airport) => {
        console.log(`Arrival changed at index ${index}:`, airport);
        const newRoutes = [...multiCityRoutes];
        newRoutes[index] = { ...newRoutes[index], arrival: airport };
        onMultiCityRoutesChange(newRoutes);
    };

    const handleMultiCityDateChange = (index: number, date: Dayjs | null) => {
        console.log(`Date changed at index ${index}:`, date);
        const newRoutes = [...multiCityRoutes];
        newRoutes[index] = { ...newRoutes[index], date: date };
        onMultiCityRoutesChange(newRoutes);
    };

    const handleSwap = (index: number) => {
        if (tripType === 'multi-city') {
            console.log(`Swapping departure and arrival at index ${index}`);
            const newRoutes = [...multiCityRoutes];
            newRoutes[index] = { 
                ...newRoutes[index],
                departure: newRoutes[index].arrival, 
                arrival: newRoutes[index].departure 
            };
            onMultiCityRoutesChange(newRoutes);
        } else {
            // For one-way and roundtrip
            const tempDeparture = departure;
            onDepartureChange(arrival);
            onArrivalChange(tempDeparture);
        }
    };

    // Function to handle removing a segment
    const handleRemoveSegment = (index: number) => {
        if (segmentCount > 2) {
            const newRoutes = multiCityRoutes.filter((_, i) => i !== index);
            onMultiCityRoutesChange(newRoutes);
            onSegmentCountChange?.(segmentCount - 1);
        }
    };

    if (tripType === 'multi-city') {
        return (
            <>
                {Array.from({ length: segmentCount }, (_, index) => (
                    <div className="trip-options-row" key={index}>
                        <DepartureLocation 
                            selectedAirport={multiCityRoutes[index]?.departure ?? null}
                            onAirportSelect={(airport) => handleMultiCityDepartureChange(index, airport)}
                        />
                        <SwapButton onSwap={() => handleSwap(index)} />
                        <ArrivalLocation 
                            selectedAirport={multiCityRoutes[index]?.arrival ?? null}
                            onAirportSelect={(airport) => handleMultiCityArrivalChange(index, airport)}
                        />
                        <DatePickerComponent 
                            onDateChange={(date) => handleMultiCityDateChange(index, date)}
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
                selectedAirport={departure}
                onAirportSelect={(airport) => onDepartureChange(airport)}
            />
            <SwapButton onSwap={() => handleSwap(0)} />
            <ArrivalLocation 
                selectedAirport={arrival}
                onAirportSelect={(airport) => onArrivalChange(airport)}
            />
            {tripType === 'round-trip' && (
                <DateRangePickerComponent 
                    onDateRangeChange={(start, end) => {
                        onDepartureDateChange(start);
                        onReturnDateChange(end);
                    }}
                />
            )}
            {tripType === 'one-way' && (
                <DatePickerComponent 
                    onDateChange={onDepartureDateChange}
                />
            )}
            {(tripType === 'round-trip' || tripType === 'one-way') && (
            <GuestSelector 
                guests={guests}
                onGuestUpdate={onGuestUpdate}
            />
            )}
            
        </div>
    );
};

export default TripRouteAndDateRow;
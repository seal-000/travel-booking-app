import React, { useState, useCallback } from 'react';
import type { Airport } from '../../services/airportService';
import { searchAirports } from '../../services/airportService';

interface DepartureLocationProps {
  value: Airport | null;
  onChange: (airport: Airport) => void;
}

const DepartureLocation: React.FC<DepartureLocationProps> = ({ value, onChange }) => {
  const [input, setInput] = useState<string>(value?.code || '');
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInput(query);

    if (query.length > 0) {
      const results = searchAirports(query);
      setSuggestions(results);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, []);

  const handleSelectAirport = (airport: Airport) => {
    setInput(airport.code);
    onChange(airport);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInput('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        placeholder="Leaving from..."
        value={input}
        onChange={handleInputChange}
        onFocus={() => input && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      />
      
      {input && (
        <button
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ✕
        </button>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #ccc',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            margin: 0,
            padding: '8px 0',
            listStyle: 'none',
            maxHeight: '250px',
            overflowY: 'auto',
            zIndex: 10,
          }}
        >
          {suggestions.map(airport => (
            <li
              key={airport.code}
              onClick={() => handleSelectAirport(airport)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <strong>{airport.code}</strong> - {airport.name}
              <div style={{ fontSize: '12px', color: '#666' }}>
                {airport.city}, {airport.country}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DepartureLocation;

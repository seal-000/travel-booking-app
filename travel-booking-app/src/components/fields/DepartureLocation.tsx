import React, { useState } from 'react';
import type { Airport } from '../../services/airportService';
import { searchAirports } from '../../services/airportService';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';

import { Button, Popper, Fade, Paper, Typography, ClickAwayListener, TextField, List, ListItem, ListItemButton, ListItemText, Chip } from '@mui/material';
import './Location.css';

interface DepartureLocationProps {
  onAirportSelect?: (airport: Airport) => void;
  selectedAirport?: Airport | null;
}

const DepartureLocation: React.FC<DepartureLocationProps> = ({ onAirportSelect, selectedAirport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Airport[]>([]);

  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const results = await searchAirports(query);
    setSearchResults(results);
    console.log('Departure airport search results:', results);
  };

  const handleAirportSelect = (airport: Airport, popupState: any) => {
    console.log('Departure Airport selected:', airport);
    onAirportSelect?.(airport);
    setSearchQuery('');
    setSearchResults([]);
    popupState.close();
  };

  const handleDelete = () => {
    console.log('Clearing selected departure airport');
    onAirportSelect?.(null as any);
  };

  return (
      <PopupState variant="popper" popupId="departure-popup-popper">
      {(popupState) => (
        <div>
          <Button variant="contained" className='location-button' {...bindToggle(popupState)}>
            <FontAwesomeIcon icon={faPlaneDeparture} />
            {selectedAirport ? `${selectedAirport.code} - ${selectedAirport.city}` : 'Leaving from'}
          </Button>
          <Popper {...bindPopper(popupState)} placement="bottom-start" transition>
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={() => popupState.close()}>
                <Fade {...TransitionProps} timeout={350}>
                  <Paper className="location-paper" sx={{ p: 2, maxWidth: 400, position: 'relative' }}>
                    <span className="tooltip-arrow" />
                    <TextField 
                      label="Search Airports" 
                      variant="outlined" 
                      fullWidth
                      value={searchQuery}
                      onChange={handleSearchChange}
                      sx={{ mb: 2, bgcolor: '#ffffff' }} 
                      autoFocus
                    />
                    {searchResults.length > 0 ? (
                      <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {searchResults.map((airport) => (
                          <ListItem key={airport.code} disablePadding>
                            <ListItemButton onClick={() => handleAirportSelect(airport, popupState)}>
                              <ListItemText 
                                primary={`${airport.code} - ${airport.name}`}
                                secondary={`${airport.name}, ${airport.country}`}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <>
                        <Typography sx={{ p: 2, color: 'text.secondary' }}>
                          {searchQuery ? 'No airports found' : 'Start typing to search airports'}
                        </Typography>
                        {selectedAirport && (
                          <Chip
                            label={`${selectedAirport.code} - ${selectedAirport.city}`}
                            color="primary"
                            variant="outlined"
                            onDelete={handleDelete}
                            sx={{ mt: 1, ml: 2 }}
                          />
                        )}
                      </>
                    )}
                  </Paper>
                </Fade>
              </ClickAwayListener>
            )}
          </Popper>
        </div>
      )}
    </PopupState>
  );
};

export default DepartureLocation;
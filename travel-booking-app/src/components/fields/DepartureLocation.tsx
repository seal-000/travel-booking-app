import React, { useState, useCallback } from 'react';
import type { Airport } from '../../services/airportService';
import { searchAirports } from '../../services/airportService';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';

import { Button, Popper, Fade, Paper, Typography, ClickAwayListener, TextField } from '@mui/material';
import './DepartureLocation.css';

const DepartureLocation: React.FC = () => {

  return (
      <PopupState variant="popper" popupId="departure-popup-popper">
      {(popupState) => (
        <div>
          <Button variant="contained"  {...bindToggle(popupState)}>
            Leaving from
          </Button>
          <Popper {...bindPopper(popupState)} placement="bottom-start" transition>
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={() => popupState.close()}>
                <Fade {...TransitionProps} timeout={350}>
                  <Paper className="departure-location-paper" sx={{ p: 2, maxWidth: 300, position: 'relative' }}>
                    <span className="tooltip-arrow" />
                    <TextField label="Search Airports" variant="outlined" sx={{ maxWidth: 200 }} />
                    <Typography sx={{ p: 2 }}>Select an airport</Typography>
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
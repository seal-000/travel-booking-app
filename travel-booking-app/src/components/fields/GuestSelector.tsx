import React, { useState } from 'react';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';

import {
  Button,
  Popper,
  Fade,
  Paper,
  Typography,
  ClickAwayListener,
  Box,
  IconButton,
} from '@mui/material';
//import AddIcon from '@mui/icons-material/Add';
//import RemoveIcon from '@mui/icons-material/Remove';

import './Location.css';

interface GuestSelectorProps {
  onGuestUpdate?: (guests: { adults: number; children: number }) => void;
  guests?: { adults: number; children: number };
}

const GuestSelector: React.FC<GuestSelectorProps> = ({
  onGuestUpdate,
  guests = { adults: 1, children: 0 },
}) => {
  const [adultCount, setAdultCount] = useState(guests.adults);
  const [childrenCount, setChildrenCount] = useState(guests.children);

  const handleAdultIncrease = () => {
    const newCount = adultCount + 1;
    setAdultCount(newCount);
    onGuestUpdate?.({ adults: newCount, children: childrenCount });
  };

  const handleAdultDecrease = () => {
    if (adultCount > 1) {
      const newCount = adultCount - 1;
      setAdultCount(newCount);
      onGuestUpdate?.({ adults: newCount, children: childrenCount });
    }
  };

  const handleChildrenIncrease = () => {
    const newCount = childrenCount + 1;
    setChildrenCount(newCount);
    onGuestUpdate?.({ adults: adultCount, children: newCount });
  };

  const handleChildrenDecrease = () => {
    if (childrenCount > 0) {
      const newCount = childrenCount - 1;
      setChildrenCount(newCount);
      onGuestUpdate?.({ adults: adultCount, children: newCount });
    }
  };

  const totalGuests = adultCount + childrenCount;
  const displayText = totalGuests === 1 ? '1 guest' : `${totalGuests} guests`;

  return (
    <PopupState variant="popper" popupId="guest-popup-popper">
      {(popupState) => (
        <div>
          <Button variant="contained" className="location-button" {...bindToggle(popupState)}>
            <FontAwesomeIcon icon={faUsers} />
            {displayText}
          </Button>
          <Popper {...bindPopper(popupState)} placement="bottom-start" transition>
            {({ TransitionProps }) => (
              <ClickAwayListener onClickAway={() => popupState.close()}>
                <Fade {...TransitionProps} timeout={350}>
                  <Paper className="location-paper" sx={{ p: 3, maxWidth: 320, position: 'relative' }}>
                    <span className="tooltip-arrow" />

                    {/* Adults Section */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Adults
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Age 18+
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                          size="small"
                          onClick={handleAdultDecrease}
                          disabled={adultCount <= 1}
                          sx={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            '&:hover': { bgcolor: '#f5f5f5' },
                          }}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </IconButton>
                        <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
                          {adultCount}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={handleAdultIncrease}
                          sx={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            '&:hover': { bgcolor: '#f5f5f5' },
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Children Section */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Children
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Age 0–17
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                          size="small"
                          onClick={handleChildrenDecrease}
                          disabled={childrenCount <= 0}
                          sx={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            '&:hover': { bgcolor: '#f5f5f5' },
                          }}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </IconButton>
                        <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
                          {childrenCount}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={handleChildrenIncrease}
                          sx={{
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            '&:hover': { bgcolor: '#f5f5f5' },
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </IconButton>
                      </Box>
                    </Box>
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

export default GuestSelector;

import React, { useState } from 'react';

import './FlightSearchBox.css'
import { Box, RadioGroup, FormControl, FormControlLabel, Radio, InputLabel, Select, MenuItem, Checkbox } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture, faPlaneArrival, faExchangeAlt, faCalendarAlt, faUser, faSearch} from '@fortawesome/free-solid-svg-icons';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';

import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const FlightSearchBox = () => {

  const [travelClass, setTravelClass] = useState('economy')
  const [tripType, setTripType] = useState('one-way')
  const [travelDate, setTravelDate] = useState(null);

  const [travelDates, setTravelDates] = useState([null, null])
  const isOneWay = travelDates[0] && !travelDates[1];
  const isRoundTrip = travelDates[0] && travelDates[1];



  const handleClassChange = (event) => {
    setTravelClass(event.target.value)
  }

  const dateFieldStyles = {
  backgroundColor: 'white',
  borderRadius: '8px',
  width: 260,
  minHeight: 36,

  '& .MuiOutlinedInput-root': {
    height: 56,
    borderRadius: '8px',

    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': { border: 'none' },
  },

  '& .MuiInputBase-input': {
    padding: '14px 12px',
  },
};

  
  return (
    <div className="flight-search-box">
        <Box 
          sx={{
            backgroundColor: '#14213D',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '1.2rem',
            color: 'white',
            maxWidth: '90%', 
            margin: '0 auto',
          }}
        > 
          {/* White Panel with Trip Options */}
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              color: '#000',
            }}
          >
            {/* Trip type radio buttons */}
            <RadioGroup 
            value={tripType}
            onChange={(e) => setTripType(e.target.value)}
            row sx={{ flexWrap: 'wrap' }}>
              <FormControlLabel value="one-way" control={<Radio />} label="One Way" />
              <FormControlLabel value="round-trip" control={<Radio />} label="Round Trip" />
              <FormControlLabel value="multi-city" control={<Radio />} label="Multi-City" />
            </RadioGroup>

            {/* Right-aligned controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel id="travel-class-label">Travel Class</InputLabel>
                <Select
                  labelId="travel-class-label"
                  id="travel-class"
                  value={travelClass}
                  label="Travel Class"
                  onChange={handleClassChange}
                >
                  <MenuItem value="economy">Economy</MenuItem>
                  <MenuItem value="premium-economy">Premium Economy</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="first">First Class</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={<Checkbox />}
                label="Direct flights only"
                sx={{ whiteSpace: 'nowrap' }}
              />
            </Box>

          </Box> {/* Trip Options Panel */}

          {/* Origin + Switch in same row */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 1.25, // spacing between the two boxes
              
            }}
          >
            {/* Leaving from */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                backgroundColor: 'white',
                color: '#000',
                borderRadius: '8px',
                px: 2,
                py: 1.25,
                minHeight: 36,
                width: 250,
                
              }}
            >
              <FontAwesomeIcon icon={faPlaneDeparture} />
              <Typography sx={{ opacity: 0.7 }}>Leaving from</Typography>
            </Box>

            {/* Switch */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                color: '#000',
                borderRadius: '8px',
                minHeight: 56,
                width: 56,
              }}
            >
              <IconButton aria-label="Swap origin and destination">
                <FontAwesomeIcon icon={faExchangeAlt} />
              </IconButton>
            </Box>

            {/* Going to */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                backgroundColor: 'white',
                color: '#000',
                borderRadius: '8px',
                px: 2,
                py: 1.25,
                minHeight: 36,
                width: 250,
              }}
            >
              <FontAwesomeIcon icon={faPlaneArrival} />
              <Typography sx={{ opacity: 0.7 }}>Going to</Typography>
            </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs}>

            {/* ONE WAY */}
            {tripType === 'one-way' && (
              <DatePicker
                value={travelDate}
                onChange={(newValue) => setTravelDate(newValue)}
                format="ddd, MMM D"
                slotProps={{
                  textField: {
                    placeholder: 'Departure date',
                    sx: dateFieldStyles,
                  },
                }}
              />
            )}

            {/* ROUND TRIP */}
            {tripType === 'round-trip' && (
              <DateRangePicker
                value={travelDates}
                onChange={(newValue) => setTravelDates(newValue)}
                format="ddd, MMM D"
                localeText={{ start: 'Departure', end: 'Return' }}
                slotProps={{
                  textField: {
                    sx: dateFieldStyles,
                  },
                }}
              />
            )}

          </LocalizationProvider>


     


            {/* Travelers */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                backgroundColor: 'white',
                color: '#000',
                borderRadius: '8px',
                px: 2,
                py: 1.00,
                minHeight: 20,
                width: 250,
              }}
            >
              <FontAwesomeIcon icon={faUser} />
              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <Typography sx={{ fontSize: 12, opacity: 0.7 }}>Travelers</Typography>
                <Typography>1 Adult</Typography>
              </Box>
            </Box>

            {/* Search */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                color: '#000',
                borderRadius: '8px',
                px: 2,
                py: 1.25,
                minHeight: 56,
                width: { sm: 56 },
                cursor: 'pointer',
              }}
              role="button"
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faSearch} />
            </Box> 
                   

            
          </Box>
          
            

        </Box>
    </div>
  )
}
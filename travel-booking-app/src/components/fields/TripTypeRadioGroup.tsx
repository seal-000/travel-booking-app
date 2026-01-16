import React from 'react';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@mui/material';

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

const TripTypeRadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        row
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default TripTypeRadioGroup;
import React from 'react';
import { Select, MenuItem, FormControl as MuiFormControl, InputLabel } from '@mui/material';

interface FormControlProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
}

const FormControl: React.FC<FormControlProps> = ({ label, value, onChange, options }) => {
    return (
        <MuiFormControl>
            <InputLabel>{label}</InputLabel>
            <Select 
                value={value} 
                label={label}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </MuiFormControl>
    );
};

export default FormControl;
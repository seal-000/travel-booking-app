import React from 'react';
import { FormControlLabel as MuiFormControlLabel, Checkbox } from '@mui/material';

interface FormControlLabelProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const FormControlLabel: React.FC<FormControlLabelProps> = ({ label, checked, onChange }) => {
    return (
        <MuiFormControlLabel
            control={
                <Checkbox 
                    checked={checked} 
                    onChange={(e) => onChange(e.target.checked)}
                />
            }
            label={label}
        />
    );
};

export default FormControlLabel;

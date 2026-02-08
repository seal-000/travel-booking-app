import React from 'react';
import './Location.css';


interface SubmitButtonProps {
    onSubmit?: (e: React.FormEvent<HTMLButtonElement>) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    onSubmit,
    label = 'SUBMIT',
    disabled = false,
    className = '',
}) => {
    return (
        <button
            type="submit"
            onClick={onSubmit}
            disabled={disabled}
            className={`submit-button ${className}`.trim()}
        >
            {label} 
        </button>
    );
};
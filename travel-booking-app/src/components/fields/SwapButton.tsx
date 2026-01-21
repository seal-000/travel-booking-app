import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';

interface SwapButtonProps {
    onSwap: () => void;
}

export default function SwapButton({ onSwap }: SwapButtonProps) {
    return (
        <IconButton
            aria-label="Swap origin and destination"
            onClick={onSwap}
            size='small'
            sx={{ color: '#14213D', border: '2px solid', borderColor: '#14213D', borderRadius: '4px', padding: '4px', margin: '0 8px' }}
        >
            <FontAwesomeIcon icon={faExchangeAlt} />
        </IconButton>
    );
}
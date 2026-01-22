import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerComponentProps {
  onDateChange?: (date: Dayjs | null) => void;
  label?: string;
  disabled?: boolean;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  onDateChange,
  label = 'Travel Date',
  disabled = false,
}) => {
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const handleDateChange = (newDate: Dayjs | null) => {
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={date}
        onChange={handleDateChange}
        disabled={disabled}
        minDate={dayjs()}
        slotProps={{
          textField: {
            size: 'small',
            variant: 'outlined',
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;

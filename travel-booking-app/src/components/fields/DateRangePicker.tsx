import React, { useState } from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface DateRangePickerComponentProps {
  onDateRangeChange?: (startDate: Dayjs | null, endDate: Dayjs | null) => void;
  label?: string;
  disabled?: boolean;
}

const DateRangePickerComponent: React.FC<DateRangePickerComponentProps> = ({
  onDateRangeChange,
  label = 'Travel Dates',
  disabled = false,
}) => {
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs(),
    dayjs().add(1, 'day'),
  ]);

  const handleDateRangeChange = (newDateRange: [Dayjs | null, Dayjs | null]) => {
    setDateRange(newDateRange);
    if (onDateRangeChange) {
      onDateRangeChange(newDateRange[0], newDateRange[1]);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateRangePicker
        label={label}
        value={dateRange}
        onChange={handleDateRangeChange}
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

export default DateRangePickerComponent;

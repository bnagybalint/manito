import { useState } from 'react';
import {
    TextField,
} from '@mui/material';
import { DatePicker as MuiDatePicker} from '@mui/x-date-pickers'

import moment from 'moment';


type Props = {
    value: moment.Moment,
    label?: string,

    onChange?: (value: moment.Moment) => void,
}

export default function DatePicker({ value, label, onChange }: Props) {
    const [open, setOpen] = useState(false);
    return (
        <MuiDatePicker
            open={open}
            label={label}
            value={value}
            onClose={() => setOpen(false)}
            onChange={(value: Date | null) => {
                onChange?.(moment(value));
            }}
            renderInput={(params) => (
                <TextField
                    onClick={(e) => setOpen(true)}
                    size="small"
                    {...params}
                />
            )}
        />
    );
}
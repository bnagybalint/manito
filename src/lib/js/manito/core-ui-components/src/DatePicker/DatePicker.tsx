import { useState } from 'react';
import { TextField as MuiTextField } from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers'

import moment from 'moment';


type Props = {
    value: moment.Moment,
    label?: string,
    hideOpenIcon?: boolean,

    onChange?: (value: moment.Moment) => void,
}

export function DatePicker({ value, label, hideOpenIcon, onChange }: Props) {
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
                <MuiTextField
                    onClick={(e) => setOpen(true)}
                    size="small"
                    sx={{
                        "& input": {
                            textAlign: 'center',
                        }
                    }}
                    {...params}
                />
            )}
            disableOpenPicker={hideOpenIcon}
        />
    );
}
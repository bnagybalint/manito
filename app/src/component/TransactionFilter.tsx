import { TextField, Grid } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import hu from 'date-fns/locale/hu';

type Props = {
    startDate: Date,
    endDate: Date,

    onStartDateChanged?: (value: Date | null) => void,
    onEndDateChanged?: (value: Date | null) => void,
};

export function TransactionFilter(props: Props) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hu}>
            <Grid container>
                <Grid item>
                    <TextField
                        label="Search"
                        variant="outlined"
                    />
                </Grid>
                <Grid item>
                    <DatePicker
                        label="Start date"
                        value={props.startDate}
                        onChange={(value: Date | null) => props.onStartDateChanged?.(value)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="End date"
                        value={props.endDate}
                        onChange={(value: Date | null) => props.onEndDateChanged?.(value)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
            </Grid>
        </LocalizationProvider>
    );
}
export default TransactionFilter;
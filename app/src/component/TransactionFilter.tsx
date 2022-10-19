import {
    Grid,
    Stack,
    TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers'

type Props = {
    searchString: string,
    startDate: Date,
    endDate: Date,

    onSearchStringChanged?: (value: string | null) => void,
    onStartDateChanged?: (value: Date | null) => void,
    onEndDateChanged?: (value: Date | null) => void,
};

export function TransactionFilter(props: Props) {
    return (
        <Grid container gap={1}>
            <Grid item>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={props.searchString}
                    onChange={(e) => props.onSearchStringChanged?.(e.target.value)}
                />
            </Grid>
            <Grid item>
                <Stack direction="row" columnGap={1}>
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
                </Stack>
            </Grid>
        </Grid>
    );
}
export default TransactionFilter;
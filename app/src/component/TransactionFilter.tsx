import moment from 'moment';
import {
    Grid,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers'
import { Box } from '@mui/system';

type Props = {
    searchString: string,
    startDate: moment.Moment,
    endDate: moment.Moment,

    onSearchStringChanged?: (value: string | null) => void,
    onStartDateChanged?: (value: moment.Moment | null) => void,
    onEndDateChanged?: (value: moment.Moment | null) => void,
};

export function TransactionFilter(props: Props) {
    return (
        <Box>
            <Grid container gap={1} marginTop={1}>
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
                            onChange={(value: Date | null) => props.onStartDateChanged?.(moment(value))}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <DatePicker
                            label="End date"
                            value={props.endDate}
                            onChange={(value: Date | null) => props.onEndDateChanged?.(moment(value))}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
export default TransactionFilter;
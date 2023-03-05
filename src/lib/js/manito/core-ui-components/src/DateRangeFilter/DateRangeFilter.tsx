import {
    Button,
    Typography,
    Stack,
    Divider,
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import moment from 'moment';

import { DatePicker } from '../DatePicker';


type Props = {
    startDate: moment.Moment,
    endDate: moment.Moment,

    onDateRangeChange?: (startDate: moment.Moment, endDate: moment.Moment) => void,
    onPreviousClick?: () => void,
    onNextClick?: () => void,
}

export function DateRangeFilter(props: Props) {

    const setRange = (period: 'week' | 'month' | 'year') => {
        const start = moment().startOf(period);
        const end = moment().endOf(period);
        props.onDateRangeChange?.(start, end);
    }

    return (
        <Stack direction="column">
            <Stack
                direction="row"
                columnGap={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Button
                    variant="contained"
                    type="button"
                    sx={{ padding: 1 }}
                    onClick={() => props.onPreviousClick?.()}
                >
                    <ChevronLeftRoundedIcon />
                </Button>
                <DatePicker
                    value={props.startDate}
                    onChange={(value) => {
                        props.onDateRangeChange?.(value, props.endDate);
                    }}
                    hideOpenIcon
                />
                <Typography>to</Typography>
                <DatePicker
                    value={props.endDate}
                    onChange={(value) => {
                        props.onDateRangeChange?.(props.startDate, value);
                    }}
                    hideOpenIcon
                />
                <Button
                    variant="contained"
                    type="button"
                    sx={{ padding: 1 }}
                    onClick={() => props.onNextClick?.()}
                >
                    <ChevronRightRoundedIcon />
                </Button>
            </Stack>
            <Stack
                direction="row"
                columnGap={1}
                display="flex"
                justifyContent="center"
                marginTop={1}
            >
                <Button variant="text" onClick={(e) => setRange('week')}>this week</Button>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Button variant="text" onClick={(e) => setRange('month')}>this month</Button>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Button variant="text" onClick={(e) => setRange('year')}>this year</Button>
            </Stack>
        </Stack>
    );
}
import {
    Grid,
    Stack,
    TextField,
} from '@mui/material';
import { Box } from '@mui/system';

type Props = {
    searchString: string,
    onSearchStringChanged?: (value: string | null) => void,
};

export function TransactionFilter(props: Props) {
    return (
        <Box>
            <Stack direction="column" gap={1} marginTop={1}>
                <Grid container>
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        value={props.searchString}
                        onChange={(e) => props.onSearchStringChanged?.(e.target.value)}
                    />
                </Grid>
            </Stack>
        </Box>
    );
}
export default TransactionFilter;
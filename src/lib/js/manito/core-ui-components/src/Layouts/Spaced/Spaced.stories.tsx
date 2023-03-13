import { Meta } from '@storybook/react';
import { Box, Button } from '@mui/material';

import { Spaced } from './Spaced';
import { Stack } from '@mui/system';
import { Checkbox } from '../../Checkbox';


export default {
    title: 'Layouts/Spaced',
    component: Spaced,
    argTypes: {
    }
} as Meta<typeof Spaced>;

export const LeftAndRight = () => (
    <Box sx={{border: 1, padding: 1}}>
        <Spaced>
            <Button variant="contained" size="small">Left</Button>
            <Button variant="contained" size="small">Right</Button>
        </Spaced>
    </Box>
)

export const Multi = () => (
    <Box sx={{border: 1, padding: 1}}>
        <Spaced>
            <Button variant="contained" size="small">Left</Button>
            <Button variant="contained" size="small">Middle</Button>
            <Button variant="contained" size="small">Right</Button>
        </Spaced>
    </Box>
)

export const SpacedAndTight = () => (
    <Box sx={{border: 1, padding: 1}}>
        <Spaced>
            <Stack direction="row" gap={1}>
                <Button variant="contained" size="small">&lt;&lt;</Button>
                <Button variant="contained" size="small">&gt;&gt;</Button>
            </Stack>
            <Stack direction="row" gap={1}>
                <Checkbox checked={true} label="keep open" />
                <Button variant="contained" size="small">Create</Button>
            </Stack>
        </Spaced>
    </Box>
)

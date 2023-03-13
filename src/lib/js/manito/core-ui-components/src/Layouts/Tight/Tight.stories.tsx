import { Meta } from '@storybook/react';
import { Box, Button, Stack } from '@mui/material';

import { Tight } from './Tight';


export default {
    title: 'Layouts/Tight',
    component: Tight,
    argTypes: {
    }
} as Meta<typeof Tight>;

export const Default = () => (
    <Box sx={{border: 1, padding: 1}} justifyContent="center">
        <Tight>
            <Button variant="contained" size="small">Left</Button>
            <Button variant="contained" size="small">Right</Button>
        </Tight>
    </Box>
)

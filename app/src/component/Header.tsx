import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import './Header.css'


export default function Header() {
    return (
        <Link to="/" className="no-underline">
            <Box className="header">
                <Typography align="center" variant="h4">MANITO</Typography>
            </Box>
        </Link>
    );
}

import { useTheme, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


export default function Header() {
    const theme = useTheme();
    return (
        <Link to="/" className="undecorated-link">
            <Box sx={{backgroundColor: theme.palette.primary.main}}>
                <Typography align="center" variant="h4">
                    MANITO
                </Typography>
            </Box>
        </Link>
    );
}

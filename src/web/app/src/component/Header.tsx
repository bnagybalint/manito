import { useTheme, Box } from '@mui/material';
import { Link } from 'react-router-dom';

import logo from 'assets/images/logo.png';

import './Header.css'


export default function Header() {
    const theme = useTheme();
    return (
        <Link to="/" className="undecorated-link">
            <Box
                display="flex" 
                justifyContent="center"
                className="header-div"
                sx={{
                    backgroundColor: theme.palette.primary.main,
                }}
            >
                <img src={logo} alt="Manito" className="header-logo-image"/>
            </Box>
        </Link>
    );
}

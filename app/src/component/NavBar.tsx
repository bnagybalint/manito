import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';

import './NavBar.css';


type PageName = 'wallets' | 'graphs' | 'settings'

export default function NavBar() {
    const [currentPage, setCurrentPage] = useState<PageName>('wallets');

    const navigate = useNavigate();

    return (
        <Box className="navbar">
            <Tabs
                centered
                value={currentPage}
                onChange={(e, newValue) => {
                    setCurrentPage(newValue)
                    navigate(`/${newValue}`);
                }}
            >
                <Tab label="Wallets" value="wallets" />
                <Tab label="Graphs" value="graphs"/>
                <Tab label="Settings" value="settings"/>
            </Tabs>
        </Box>
    );
}

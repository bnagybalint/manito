import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Tab, Tabs } from '@mui/material';


type PageName = 'wallets' | 'graphs' | 'settings'

export default function NavBar() {
    const [currentPage, setCurrentPage] = useState<PageName>('wallets');

    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.bg.main,
                borderBottom: theme.palette.backdrop.dark,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid'
            }}
        >
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

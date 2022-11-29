import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { Container } from '@mui/material';

import hu from 'date-fns/locale/hu';

import Header from 'component/Header';
import Footer from 'component/Footer';
import LoginPage from 'component/LoginPage';
import WalletPage from 'component/WalletPage';
import SettingsPage from 'component/SettingsPage';
import NavBar from 'component/NavBar';

import { useUserStore, selectCurrentUser } from 'stores/user'

import ThemeFactory from 'Theme';



export default function App() {
    const currentUser = useUserStore(selectCurrentUser);
    const theme = ThemeFactory.createLightTheme();

    const renderContent = () => {
        return (
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/wallets" />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                    <Route path="/wallets" element={<WalletPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </div>
        );
    }

    const renderPage = () => {
        if (currentUser == null) {
            return (
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            );
        }
        return (
            <div>
                <NavBar />
                <Container maxWidth="md">
                    { renderContent() }
                </Container>
            </div>
        );
    }
    
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hu}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <Header />
                    { renderPage() }
                    <Footer />
                </ThemeProvider>
            </BrowserRouter>
        </LocalizationProvider>
    );
}

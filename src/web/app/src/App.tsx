import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers'
import { Container } from '@mui/material';

import LoginPage from 'page/LoginPage';
import WalletPage from 'page/WalletPage';
import SettingsPage from 'page/SettingsPage';

import Header from 'component/Header';
import Footer from 'component/Footer';
import NavBar from 'component/NavBar';

import { useUserStore, selectCurrentUser } from 'stores/user'

import ThemeFactory from 'Theme';

// Need to import locale in order to be used by LocalizationProvider
import 'moment/locale/hu';


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
        <LocalizationProvider dateAdapter={AdapterMoment} locale={'hu-HU'}>
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

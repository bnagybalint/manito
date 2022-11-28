import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers'

import hu from 'date-fns/locale/hu';

import Header from 'component/Header';
import Footer from 'component/Footer';
import LoginPage from 'component/LoginPage';
import WalletPage from 'component/WalletPage';
import SettingsPage from 'component/SettingsPage';
import NavBar from 'component/NavBar';

import { useUserStore, selectCurrentUser } from 'stores/user'

import { ManitoDefaultTheme } from 'Theme';

import './App.css';


export default function App() {
    const currentUser = useUserStore(selectCurrentUser);

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
            <div className="mainPanel">
                <NavBar />
                <div className="contentPanel">
                    { renderContent() }
                </div>
            </div>
        );
    }
    
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hu}>
            <BrowserRouter>
                <ThemeProvider theme={ManitoDefaultTheme}>
                    <Header />
                    { renderPage() }
                    <Footer />
                </ThemeProvider>
            </BrowserRouter>
        </LocalizationProvider>
    );
}

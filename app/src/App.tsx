import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers'

import hu from 'date-fns/locale/hu';

import Header from 'component/Header';
import Footer from 'component/Footer';
import LoginPanel from 'component/LoginPanel';
import WalletPanel from 'component/WalletPanel';
import SettingsPanel from 'component/SettingsPanel';
import NavigationBar from 'component/NavigationBar';

import { useUserStore, selectCurrentUser } from 'stores/user'

import { ManitoDefaultTheme } from 'Theme';

import './App.css';

export default function App() {
    const currentUser = useUserStore(selectCurrentUser);

    const renderContent = () => {
        if (currentUser == null) {
            return (
                <Routes>
                    <Route path="/login" element={<LoginPanel />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            );
        }
        return (
            <div>
                <Routes>
                    <Route path="/" element={<Navigate to="/wallet" />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                </Routes>
                <NavigationBar />
                <Routes>
                    <Route path="/wallet" element={<WalletPanel />} />
                    <Route path="/settings" element={<SettingsPanel />} />
                </Routes>
            </div>
        );
    }

    const renderPage = () => {
        return (
            <div className="mainPanel">
                <div className="contentPanel">
                    <BrowserRouter>
                        <ThemeProvider theme={ManitoDefaultTheme}>
                            <Header />
                            { renderContent() }
                            <Footer />
                        </ThemeProvider>
                    </BrowserRouter>
                </div>
            </div>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hu}>
            { renderPage() }
        </LocalizationProvider>
    );
}

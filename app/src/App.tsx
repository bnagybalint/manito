import React from 'react';
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

import User from 'entity/User';

import { ManitoDefaultTheme } from 'Theme';
import UserContext from 'UserContext';

import './App.css';


type Props = {};

type State = {
    login_user: User | null,
};

export default class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        // faking login
        let u: User = {
            id: 159,
            name: 'Jakab',
        };

        this.state = {
            login_user: u,
        };
    }

    renderContent() {
        if (this.state.login_user == null) {
            return (
                <Routes>
                    <Route path="/login" element={<LoginPanel />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            );
        }
        return (
            <UserContext.Provider value={this.state.login_user}>
                <Routes>
                    <Route path="/" element={<Navigate to="/wallet" />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                </Routes>
                <NavigationBar />
                <Routes>
                    <Route path="/wallet" element={<WalletPanel />} />
                    <Route path="/settings" element={<SettingsPanel />} />
                </Routes>
            </UserContext.Provider>
        );
    }

    renderPage() {
        return (
            <div className="mainPanel">
                <div className="contentPanel">
                    <BrowserRouter>
                        <ThemeProvider theme={ManitoDefaultTheme}>
                            <Header />
                            {this.renderContent()}
                            <Footer />
                        </ThemeProvider>
                    </BrowserRouter>
                </div>
            </div>
        );
    }

    render() {
        return (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hu}>
                {this.renderPage()}
            </LocalizationProvider>
        );
    }
}

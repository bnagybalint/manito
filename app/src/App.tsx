import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Header } from 'component/Header';
import { Footer } from 'component/Footer';
import { SettingsPanel } from 'component/SettingsPanel';
import { WalletPanel } from 'component/WalletPanel';

import { ManitoDefaultTheme } from 'Theme';

import './App.css';

type Props = {};

type State = {};

export class App extends React.Component<Props, State> {
    render() {
        return (
            <div className="mainPanel">
                <div className="contentPanel">
                    <BrowserRouter>
                        <ThemeProvider theme={ManitoDefaultTheme}>
                            <Header />
                            <Routes>
                                <Route path="/wallet" element={<WalletPanel />} />
                                <Route path="/settings" element={<SettingsPanel />} />
                            </Routes>
                            <Footer />
                        </ThemeProvider>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}

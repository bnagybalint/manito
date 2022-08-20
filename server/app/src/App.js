import React from 'react';

import Wallet from './components/Wallet.js';
import CategoryManager from './components/CategoryManager.js';
import Footer from './components/Footer.js';

import './App.css'

class App extends React.Component {
    render() {
        return (
            <div class="mainPanel">
                <div class="contentPanel">
                    <Wallet walletName="Wallet"/>
                    <Wallet walletName="Bank account"/>
                    <CategoryManager />
                    <Footer />
                </div>
            </div>
        );
    }
}

export default App;
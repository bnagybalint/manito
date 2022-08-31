import React from 'react';

import { Wallet } from 'component/Wallet';
import { CategoryManager } from 'component/CategoryManager';
import { Footer } from 'component/Footer';

import './App.css';


export class App extends React.Component {
    render() {
        return (
            <div className="mainPanel">
                <div className="contentPanel">
                    <Wallet walletId={1000036127} />
                    <Wallet walletId={1000041234} />
                    <CategoryManager />
                    <Footer />
                </div>
            </div>
        );
    }
}

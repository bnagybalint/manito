import React from 'react';

import TransactionViewer from './TransactionViewer.js';

import './Wallet.css'

class Wallet extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="block wallet">
                <h1 class="block-title">{this.props.walletName ?? "Unnamed wallet"}</h1>
                <button class="button">+ Add transation</button>
                <TransactionViewer />
            </div>
        );
    }
}

export default Wallet;
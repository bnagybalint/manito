import React from 'react';
import Button from '@mui/material/Button';

import TransactionViewer from './TransactionViewer.js';

import './Wallet.css'

export default class Wallet extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="block wallet">
                <h1 class="block-title">{this.props.walletName ?? "Unnamed wallet"}</h1>
                <Button variant="contained">+ Add transation</Button>
                <TransactionViewer />
            </div>
        );
    }
}

import React from 'react';
import Button from '@mui/material/Button';

import { TransactionViewer } from 'component/TransactionViewer';

import './Wallet.css';


type Props = {
    walletId : number,
};

type State = {
    walletName : string,
};

export class Wallet extends React.Component<Props, State> {
    render() {
        return (
            <div className="block wallet">
                <h1 className="block-title">Unnamed wallet (#{this.props.walletId})</h1>
                <Button variant="contained">+ Add transation</Button>
                <TransactionViewer />
            </div>
        );
    }
}

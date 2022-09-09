import React from 'react';
import Button from '@mui/material/Button';

import TransactionList from 'component/TransactionList';


type Props = {
    walletId : number,
};

type State = {
    walletName : string,
};

export default class WalletView extends React.Component<Props, State> {
    render() {
        return (
            <div className="block">
                <h1 className="block-title">Unnamed wallet (#{this.props.walletId})</h1>
                <Button variant="contained">+ Add transation</Button>
                <TransactionList />
            </div>
        );
    }
}

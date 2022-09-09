import React from 'react';

import { Wallet } from 'component/Wallet';


type Props = {};

type State = {};

export class WalletPanel extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <p className="page-title">Wallets</p>
                <Wallet walletId={1000036127} />
                <Wallet walletId={1000041234} />
            </div>
        );
    }
}

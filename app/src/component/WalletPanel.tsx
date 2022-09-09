import React from 'react';

import WalletView from 'component/WalletView';
import Wallet from 'entity/Wallet';

import UserContext from 'UserContext';
import ApiClient from 'ApiClient';

type Props = {};

type State = {
    wallets: Wallet[],
    active_wallet: Wallet,
};

export default class WalletPanel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        // let user = React.useContext(UserContext);

        // if (user != null) {
        //     new ApiClient()
        //         .getWallets(user.id)
        //         .then((wallets) => this.onFetchComplete(wallets));
        // }
        let w: Wallet = {
            id: 11,
            name: 'Bank account',
            createdAt: new Date(),
            ownerId: 12,
        }
        this.state = {
            wallets: [w],
            active_wallet: w,
        }
    }

    render() {
        return (
            <div>
                <p className="page-title">Wallets</p>
                <WalletView walletId={1000036127} />
                <WalletView walletId={1000041234} />
            </div>
        );
    }
}

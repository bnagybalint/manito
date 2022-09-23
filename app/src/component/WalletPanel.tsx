import React from 'react';
import { Alert, AlertTitle, Button, Skeleton } from '@mui/material';

import TransactionList from 'component/TransactionList';

import { TransactionFilter } from 'component/TransactionFilter';
import Wallet from 'entity/Wallet';
import User from 'entity/User';

import UserContext from 'UserContext';
import ApiClient from 'ApiClient';
import Transaction from 'entity/Transaction';


const WalletPanel = (props: {}) => {
    const user = React.useContext(UserContext);
    return <WalletPanelImpl user={user!} {...props}/>
} 
export default WalletPanel;

type Props = {
    user: User,
};

type State = {
    wallets: Wallet[],
    activeWallet: Wallet | null,

    startDate: Date,
    endDate: Date,
    transactions: Transaction[],

    error: string | null,
};

class WalletPanelImpl extends React.Component<Props, State> {
    private needsReload: Boolean = true;

    constructor(props: Props) {
        super(props);

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        this.state = {
            wallets: [],
            activeWallet: null,
            startDate: startDate,
            endDate: endDate,
            transactions: [],
            error: null,
        }
    }

    componentDidMount() {
        const client = new ApiClient();
        const currentUser = this.props.user;
        client.getWallets(currentUser.id)
            .then(wallets => this.onFetchComplete(wallets))
            .catch(error => {
                console.error(`Failed to fetch: ${error}`);
                this.setState({error: 'Failed to load wallets from server!'});
            });
    }

    componentDidUpdate() {
        if(this.needsReload) {
            const client = new ApiClient();
            this.loadTransactions();
            this.needsReload = false;
        }
    }

    onWalletChange() {
        // TODO load transactions
        return;
    }
    onFetchComplete(wallets: Wallet[]) {
        if(!wallets)
        {
            return;
        }

        this.setState({
            wallets: wallets,
            activeWallet: this.state.activeWallet ?? wallets[0],
        });
    }

    loadTransactions() {
        if(this.state.activeWallet != null) {
            const client = new ApiClient();
            client.getTransactions(this.state.activeWallet.id, {
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                })
                .then((transactions) => this.setState({transactions: transactions}))
                .catch(error => {
                    console.error(`Failed to fetch: ${error}`);
                    this.setState({error: 'Failed to load transactions from server!'});
                });
        }
    }

    invalidateState<K extends keyof State>(state: (Pick<State, K> | State | null)) {
        this.needsReload = true;
        this.setState(state);
    }

    renderContent() {
        if(this.state.error != null) {
            return (
                <Alert severity="error" >
                    <AlertTitle><b>Error</b></AlertTitle>
                    {this.state.error}
                </Alert>
            );
        }

        if(!this.state.activeWallet) {
            return (
                <div>
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                </div>
            );
        }

        const wallet = this.state.activeWallet;
        const transactions = this.state.transactions;

        return (
            <div>
                <h1 className="block-title">{wallet.name}</h1>
                <TransactionFilter
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onStartDateChanged={(value: Date | null) => this.invalidateState({startDate: value!})}
                    onEndDateChanged={(value: Date | null) => this.invalidateState({endDate: value!})}
                />
                <Button variant="contained">+ Add transation</Button>
                <TransactionList transactions={transactions}/>
            </div>
        );
    }

    render() {
        return (
            <div>
                <p className="page-title">Wallets</p>
                <div className="block">
                    { this.renderContent() }
                </div>
            </div>
        );
    }
}

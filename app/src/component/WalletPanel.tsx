import React from 'react';
import {
    Alert,
    AlertTitle,
    Fab,
    Skeleton,
    Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import TransactionList from 'component/TransactionList';

import TransactionFilter from 'component/TransactionFilter';
import TransactionDialog from 'component/TransactionDialog';
import Wallet from 'entity/Wallet';
import User from 'entity/User';

import UserContext from 'UserContext';
import ApiClient from 'api_client/ApiClient';
import ITransaction from 'api_client/model/ITransaction';
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

    searchString: string,
    startDate: Date,
    endDate: Date,
    transactions: Transaction[],

    isTransactionDialogOpen: boolean,

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
            searchString: "",
            startDate: startDate,
            endDate: endDate,
            transactions: [],
            isTransactionDialogOpen: false,
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

    openTransactionDialog() {
        this.setState({isTransactionDialogOpen: true});
    }

    closeTransactionDialog() {
        this.setState({isTransactionDialogOpen: false});
    }

    loadTransactions() {
        if(this.state.activeWallet != null) {
            const client = new ApiClient();
            client.getTransactions(this.state.activeWallet.id, {
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    searchString: this.state.searchString
                })
                .then((transactions) => this.setState({transactions: transactions}))
                .catch(error => {
                    console.error(`Failed to fetch: ${error}`);
                    this.setState({error: 'Failed to load transactions from server!'});
                });
        }
    }

    handleCreateTransaction(transaction: ITransaction) {
        const client = new ApiClient();
        client.createTransaction(transaction)
            .then(() => this.invalidateState({}))
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
            <Stack gap={1}>
                <h1 className="block-title">{wallet.name}</h1>
                <TransactionFilter
                    searchString={this.state.searchString}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onSearchStringChanged={(value: string | null) => this.invalidateState({searchString: value!})}
                    onStartDateChanged={(value: Date | null) => this.invalidateState({startDate: value!})}
                    onEndDateChanged={(value: Date | null) => this.invalidateState({endDate: value!})}
                />
                <div>
                    <Fab
                        size="medium"
                        color="primary"
                        variant="extended"
                        aria-label="add"
                        onClick={() => this.openTransactionDialog()}
                    >
                        <AddIcon />
                        New transaction
                    </Fab>
                </div>
                <TransactionList
                    walletId={this.state.activeWallet.id}
                    transactions={transactions}
                />
                <TransactionDialog
                    wallet={this.state.activeWallet}
                    open={this.state.isTransactionDialogOpen}
                    onClose={() => this.closeTransactionDialog()}
                    onSubmit={(t: ITransaction) => this.handleCreateTransaction(t)}
                />
            </Stack>
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

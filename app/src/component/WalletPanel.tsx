import { useState, useEffect } from 'react';
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

import ApiClient from 'api_client/ApiClient';
import ITransaction from 'api_client/model/ITransaction';
import Transaction from 'entity/Transaction';

import { useUserStore, selectCurrentUser } from 'stores/user';


export default function WalletPanel() {
    const currentUser = useUserStore(selectCurrentUser)

    const now = new Date();
    const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    const [searchString, setSearchString] = useState("");

    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [activeWallet, setActiveWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [walletsLoaded, setWalletsLoaded] = useState(false);
    const [transactionsLoaded, setTransactionsLoaded] = useState(false);

    useEffect(() => {
        if(!walletsLoaded) {
            const client = new ApiClient();
            client.getWallets(currentUser!.id)
                .then(wallets => {
                    setWallets(wallets);
                    if(wallets) {
                        setActiveWallet(wallets[0]);
                    }
                    setWalletsLoaded(true);
                })
                .catch(error => {
                    console.error(`Failed to fetch: ${error}`);
                    setError('Failed to load wallets from server!');
                });

        } else if(activeWallet && !transactionsLoaded) {
            loadTransactions();
            setTransactionsLoaded(true);
        }
    }, [currentUser, walletsLoaded, transactionsLoaded, activeWallet]);

    const openTransactionDialog = () => {
        setIsTransactionDialogOpen(true);
    }

    const closeTransactionDialog = () => {
        setIsTransactionDialogOpen(false);
    }

    const loadTransactions = () => {
        if(activeWallet) {
            const client = new ApiClient();
            client.getTransactions(activeWallet.id!, {
                    startDate: startDate,
                    endDate: endDate,
                    searchString: searchString
                })
                .then((transactions) => setTransactions(transactions))
                .catch(error => {
                    console.error(`Failed to fetch: ${error}`);
                    setError('Failed to load transactions from server!');
                });
        }
    }

    const handleCreateTransaction = (transaction: ITransaction) => {
        const client = new ApiClient();
        client.createTransaction(transaction);
    }

    const renderContent = () => {
        if(error != null) {
            return (
                <Alert severity="error" >
                    <AlertTitle><b>Error</b></AlertTitle>
                    {error}
                </Alert>
            );
        }

        if(!activeWallet || !transactionsLoaded) {
            return (
                <div>
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                </div>
            );
        }

        return (
            <Stack gap={1}>
                <h1 className="block-title">{activeWallet.name}</h1>
                <TransactionFilter
                    searchString={searchString}
                    startDate={startDate}
                    endDate={endDate}
                    onSearchStringChanged={(value: string | null) => { setSearchString(value!); setTransactionsLoaded(false); }}
                    onStartDateChanged={(value: Date | null) => { setStartDate(value!); setTransactionsLoaded(false); }}
                    onEndDateChanged={(value: Date | null) => { setEndDate(value!); setTransactionsLoaded(false); }}
                />
                <div>
                    <Fab
                        size="medium"
                        color="primary"
                        variant="extended"
                        aria-label="add"
                        onClick={() => openTransactionDialog()}
                    >
                        <AddIcon />
                        New transaction
                    </Fab>
                </div>
                <TransactionList
                    walletId={activeWallet.id!}
                    transactions={transactions}
                />
                <TransactionDialog
                    wallet={activeWallet}
                    open={isTransactionDialogOpen}
                    onClose={() => closeTransactionDialog()}
                    onSubmit={(t: ITransaction) => handleCreateTransaction(t)}
                />
            </Stack>
        );
    }

    return (
        <div>
            <p className="page-title">Wallets</p>
            <div className="block">
                { renderContent() }
            </div>
        </div>
    );
}

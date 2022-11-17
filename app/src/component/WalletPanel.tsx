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

import ApiClient from 'api_client/ApiClient';
import ITransaction from 'api_client/model/ITransaction';
import Transaction from 'entity/Transaction';

import { useUserStore, selectCurrentUser } from 'stores/user';
import { useWalletStore } from 'stores/wallet';


export default function WalletPanel() {
    const currentUser = useUserStore(selectCurrentUser);
    const currentWallet = useWalletStore((state) => state.currentWallet);
    const walletsLoaded = useWalletStore((state) => state.loaded);
    const walletError = useWalletStore((state) => state.error);
    const fetchWallets = useWalletStore((state) => state.fetchWallets);

    const now = new Date();
    const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    const [searchString, setSearchString] = useState("");

    const [transactionsError, setTransactionsError] = useState<string | null>(null);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

    const [transactionsLoaded, setTransactionsLoaded] = useState(false);

    useEffect(() => {
        if(!walletsLoaded) {
            fetchWallets(currentUser!.id!);
        } else if(currentWallet && !transactionsLoaded) {
            loadTransactions();
            setTransactionsLoaded(true);
        }
    }, [currentUser, walletsLoaded, transactionsLoaded, currentWallet]);

    const openTransactionDialog = () => {
        setIsTransactionDialogOpen(true);
    }

    const closeTransactionDialog = () => {
        setIsTransactionDialogOpen(false);
    }

    const loadTransactions = () => {
        if(currentWallet) {
            const client = new ApiClient();
            client.getTransactions(currentWallet.id!, {
                    startDate: startDate,
                    endDate: endDate,
                    searchString: searchString
                })
                .then((transactions) => setTransactions(transactions))
                .catch(error => {
                    console.error(`Failed to fetch: ${error}`);
                    setTransactionsError('Failed to load transactions from server!');
                });
        }
    }

    const handleCreateTransaction = (transaction: ITransaction) => {
        const client = new ApiClient();
        client.createTransaction(transaction);
    }

    const renderContent = () => {
        const error = walletError ?? transactionsError;
        if(error != null) {
            return (
                <Alert severity="error" >
                    <AlertTitle><b>Error</b></AlertTitle>
                    {error}
                </Alert>
            );
        }

        if(!currentWallet || !transactionsLoaded) {
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
                <h1 className="block-title">{currentWallet.name}</h1>
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
                    walletId={currentWallet.id!}
                    transactions={transactions}
                />
                <TransactionDialog
                    wallet={currentWallet}
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

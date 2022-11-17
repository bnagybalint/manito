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

import ITransaction from 'api_client/model/ITransaction';

import { useUserStore, selectCurrentUser } from 'stores/user';
import { useWalletStore } from 'stores/wallet';
import { selectFilteredTransactions, useTransactionStore } from 'stores/transaction';


export default function WalletPanel() {
    const now = new Date();
    const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    const [searchString, setSearchString] = useState("");
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

    const currentUser = useUserStore(selectCurrentUser);
    const currentWallet = useWalletStore((state) => state.currentWallet);
    const walletsLoaded = useWalletStore((state) => state.loaded);
    const walletError = useWalletStore((state) => state.error);
    const fetchWallets = useWalletStore((state) => state.fetchWallets);
    
    const transactions = useTransactionStore(selectFilteredTransactions({
        wallet: currentWallet ?? undefined,
        startDate: startDate,
        endDate: endDate,
        searchString: searchString,
    }));
    const transactionsLoaded = useTransactionStore((state) => state.loaded);
    const transactionsError = useTransactionStore((state) => state.error);
    const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
    const addTransaction = useTransactionStore((state) => state.addTransaction);
    
    useEffect(() => {
        // TODO check if there is a better way to lazy load data than checking
        //      if the data is loaded in every component
        if(!walletsLoaded) {
            fetchWallets(currentUser!.id!);
        } else if(currentWallet && !transactionsLoaded) {
            fetchTransactions(currentWallet.id!);
        }
    }, [currentUser, currentWallet, walletsLoaded, transactionsLoaded]);

    const openTransactionDialog = () => {
        setIsTransactionDialogOpen(true);
    }

    const closeTransactionDialog = () => {
        setIsTransactionDialogOpen(false);
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
                    onSearchStringChanged={(value: string | null) => { setSearchString(value!); }}
                    onStartDateChanged={(value: Date | null) => { setStartDate(value!); }}
                    onEndDateChanged={(value: Date | null) => { setEndDate(value!); }}
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
                    onSubmit={(t: ITransaction) => addTransaction(t)}
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

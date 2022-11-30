import moment from 'moment';
import { useState, useEffect } from 'react';
import {
    Alert,
    AlertTitle,
    Card,
    CardContent,
    Fab,
    MenuItem,
    Select,
    Skeleton,
    Stack,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import TransactionHistory, {TransactionHistorySelectionModel } from 'component/TransactionHistory';
import TransactionFilter from 'component/TransactionFilter';
import TransactionDialog from 'component/TransactionDialog';

import { ITransaction } from 'api_client/model/Transaction';

import { selectCurrentUser, useUserStore } from 'stores/user';
import { useWalletStore } from 'stores/wallet';
import { selectFilteredTransactions, useTransactionStore } from 'stores/transaction';


export default function WalletPage() {
    const now = moment();
    const [startDate, setStartDate] = useState(moment(now).startOf('month'));
    const [endDate, setEndDate] = useState(moment(now).endOf('month'));
    const [searchString, setSearchString] = useState("");
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [transactionSelectionModel, setTransactionSelectionModel] = useState<TransactionHistorySelectionModel>({selectedTransactions: new Set()});

    const currentUser = useUserStore(selectCurrentUser);
    const currentWallet = useWalletStore((state) => state.currentWallet);
    const wallets = useWalletStore((state) => state.wallets);
    const walletsLoaded = useWalletStore((state) => state.loaded);
    const walletError = useWalletStore((state) => state.error);
    const fetchWallets = useWalletStore((state) => state.fetchWallets);
    const setCurrentWallet = useWalletStore((state) => state.setCurrentWallet);
    
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
            <Stack gap={1} paddingTop={1}>
                <Card>
                    <Select
                        value={currentWallet.id!}
                        onChange={(e) => {
                            const wallet = wallets.find((w) => w.id == e.target.value);
                            setCurrentWallet(wallet!);
                        }}
                        sx={{boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                    >
                        {wallets.map((w) => (
                            <MenuItem value={w.id}>
                                <Typography>{w.name}</Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </Card>
                <Card>
                    <CardContent>
                        <Typography fontWeight="bold">Filters</Typography>
                        <TransactionFilter
                            searchString={searchString}
                            startDate={startDate}
                            endDate={endDate}
                            onSearchStringChanged={(value: string | null) => { setSearchString(value!); }}
                            onStartDateChanged={(value: moment.Moment | null) => { setStartDate(value!); }}
                            onEndDateChanged={(value: moment.Moment | null) => { setEndDate(value!); }}
                        />
                    </CardContent>
                </Card>
                <Stack direction="row" gap={1}>
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
                    {transactionSelectionModel.selectedTransactions.size > 0 &&
                        <Fab
                            size="medium"
                            color="red"
                            variant="extended"
                            aria-label="delete"
                        >
                            <DeleteIcon />
                            Delete transactions ({transactionSelectionModel.selectedTransactions.size})
                        </Fab>
                    }
                </Stack>
                <TransactionHistory
                    transactions={transactions}
                    walletId={currentWallet.id}
                    selectionModel={transactionSelectionModel}
                    onSelectionModelChange={(model) => setTransactionSelectionModel(model)}
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

    return renderContent();
}

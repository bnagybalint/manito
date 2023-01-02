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
import EditIcon from '@mui/icons-material/Edit';

import TransactionHistory, { TransactionHistorySelectionModel } from 'component/TransactionHistory';
import TransactionFilter from 'component/TransactionFilter';
import TransactionCreateEditDialog from 'component/TransactionCreateEditDialog';
import ConfirmDialog from 'component/ConfirmDialog';

import Transaction from 'entity/Transaction';

import { selectCurrentUser, useUserStore } from 'stores/user';
import { useWalletStore } from 'stores/wallet';
import { selectFilteredTransactions, useTransactionStore } from 'stores/transaction';


export default function WalletPage() {
    const now = moment();
    const [startDate, setStartDate] = useState(moment(now).startOf('month'));
    const [endDate, setEndDate] = useState(moment(now).endOf('month'));
    const [searchString, setSearchString] = useState("");
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
    const [transactionSelectionModel, setTransactionSelectionModel] = useState<TransactionHistorySelectionModel>(new Set());
    const [editedTransaction, setEditedTransaction] = useState<Transaction | null>(null);

    const currentUser = useUserStore(selectCurrentUser);
    const currentWallet = useWalletStore((state) => state.currentWallet);
    const wallets = useWalletStore((state) => state.wallets);
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
    const deleteTransactionById = useTransactionStore((state) => state.deleteTransactionById);
    const updateTransaction = useTransactionStore((state) => state.updateTransaction);
    
    useEffect(() => {
        fetchWallets(currentUser!.id!);

        if(currentWallet) {
            fetchTransactions(currentWallet.id!);
        }
    }, [currentUser, currentWallet, fetchWallets, fetchTransactions]);

    const handleCreateTransactionClicked = () => {
        setIsTransactionDialogOpen(true);
    }

    const handleEditTransactionsClicked = () => {
        const transactionId = Array.from(transactionSelectionModel.values())[0];
        const transaction = transactions.find((t) => t.id === transactionId);
        setEditedTransaction(transaction!);
        setIsTransactionDialogOpen(true);
    }

    const handleCreateEditTransactionClosed = () => {
        setIsTransactionDialogOpen(false);
        setEditedTransaction(null);
    }

    const handleDeleteTransactionsClicked = () => {
        setIsDeleteConfirmDialogOpen(true);
    }

    const handleDeleteTransactionsCancelled = () => {
        setIsDeleteConfirmDialogOpen(false);
    }

    const handleDeleteTransactionsConfirmed = () => {
        transactionSelectionModel.forEach((t) => {
            deleteTransactionById(t);
        })
        setTransactionSelectionModel(new Set());
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
                            const wallet = wallets.find((w) => w.id === e.target.value);
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
                        onClick={() => handleCreateTransactionClicked()}
                    >
                        <AddIcon />
                        New
                    </Fab>
                    {transactionSelectionModel.size > 0 &&
                        <Fab
                            size="medium"
                            color="blue"
                            variant="extended"
                            onClick={() => handleEditTransactionsClicked()}
                            disabled={transactionSelectionModel.size > 1}
                        >
                            <EditIcon />
                            Edit
                        </Fab>
                    }
                    {transactionSelectionModel.size > 0 &&
                        <Fab
                            size="medium"
                            color="red"
                            variant="extended"
                            onClick={() => handleDeleteTransactionsClicked()}
                        >
                            <DeleteIcon />
                            Delete ({transactionSelectionModel.size})
                        </Fab>
                    }
                </Stack>
                <TransactionHistory
                    transactions={transactions}
                    walletId={currentWallet.id}
                    selectionModel={transactionSelectionModel}
                    onSelectionModelChange={(model) => setTransactionSelectionModel(model)}
                />
                <TransactionCreateEditDialog
                    transaction={editedTransaction ?? undefined}
                    open={isTransactionDialogOpen}
                    onClose={handleCreateEditTransactionClosed}
                    onCreate={(t: Transaction) => addTransaction(t)}
                    onEdit={(t: Transaction) => updateTransaction(t)}
                />
                <ConfirmDialog
                    open={isDeleteConfirmDialogOpen}
                    title="Confirm delete?"
                    message="Are you sure you want to delete the selected transactions?"
                    color="red"
                    onClose={() => handleDeleteTransactionsCancelled()}
                    onConfirm={() => handleDeleteTransactionsConfirmed()}
                />
            </Stack>
        );
    }

    return renderContent();
}

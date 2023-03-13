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
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { DateRangeFilter } from '@manito/core-ui-components';

import TransactionHistory, { TransactionHistorySelectionModel } from 'component/TransactionHistory';
import TransactionFilter from 'component/TransactionFilter';
import TransactionCreateEditDialog from 'component/TransactionCreateEditDialog';
import ConfirmDialog from 'component/ConfirmDialog';
import ImportTransactionDialog from 'component/ImportTransactionDialog';

import Transaction from 'entity/Transaction';

import { selectCurrentUser, useUserStore } from 'stores/user';
import { useWalletStore } from 'stores/wallet';
import { selectFilteredTransactions, useTransactionStore } from 'stores/transaction';
import DateRange from 'util/DateRange';


export default function WalletPage() {
    const now = moment();
    const [startDate, setStartDate] = useState(moment(now).startOf('month'));
    const [endDate, setEndDate] = useState(moment(now).endOf('month'));
    const [searchString, setSearchString] = useState("");
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
    const [isTransactionImportDialogOpen, setIsTransactionImportDialogOpen] = useState(false);
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

    const handleTransactionImportClicked = () => {
        setIsTransactionImportDialogOpen(true);
    }

    const handleTransactionImportSubmitted = (transactions: Transaction[]) => {
        // TODO make this a batch import
        transactions.forEach((t) => addTransaction(t));
        setIsTransactionImportDialogOpen(false);
    }

    const handleDateRangeStep = (up: boolean) => {
        const range = new DateRange(startDate, endDate);
        const offset = up ? 1 : -1;

        if(range.isFullMonth()) {
            const year = startDate.year();
            const month = startDate.month();
            let newYear = year;
            let newMonth = month + offset;
            if(month + offset < 0) {
                newYear = year - 1;
                newMonth = 11;
            } else if(month + offset > 11) {
                newYear = year + 1;
                newMonth = 0;
            }

            setStartDate((d) => moment(d).set({ year: newYear, month: newMonth }).startOf('month'));
            setEndDate((d) => moment(d).set({ year: newYear, month: newMonth }).endOf('month'));

        } else if (range.isFullYear()) {
            const newYear = startDate.year() + offset;

            setStartDate((d) => moment(d).set({ year: newYear }).startOf('year'));
            setEndDate((d) => moment(d).set({ year: newYear }).endOf('year'));

        } else {
            const newRange = range.addInterval(offset);

            setStartDate((d) => moment(newRange.startDate));
            setEndDate((d) => moment(newRange.endDate));
        }
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
                    <Stack margin={1}>
                        <DateRangeFilter
                            startDate={startDate}
                            endDate={endDate}
                            onDateRangeChange={(start, end) => {
                                setStartDate(start!);
                                setEndDate(end!);
                            }}
                            onPreviousClick={() => handleDateRangeStep(false)}
                            onNextClick={() => handleDateRangeStep(true)}
                        />
                    </Stack>
                </Card>
                <Card>
                    <CardContent>
                        <Typography fontWeight="bold">Filters</Typography>
                        <TransactionFilter
                            searchString={searchString}
                            onSearchStringChanged={(value: string | null) => { setSearchString(value!); }}
                        />
                    </CardContent>
                </Card>
                <Stack direction="row" gap={1}>
                    <Stack direction="row" gap={1} flexGrow={1}>
                        <Fab
                            size="medium"
                            color="primary"
                            variant="extended"
                            onClick={handleCreateTransactionClicked}
                        >
                            <AddIcon />
                            New
                        </Fab>
                        {transactionSelectionModel.size > 0 &&
                            <Fab
                                size="medium"
                                color="blue"
                                variant="extended"
                                onClick={handleEditTransactionsClicked}
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
                                onClick={handleDeleteTransactionsClicked}
                            >
                                <DeleteIcon />
                                Delete ({transactionSelectionModel.size})
                            </Fab>
                        }
                    </Stack>
                    <Stack direction="row" gap={1} justifyContent="end" flexGrow={1}>
                        <Fab
                            size="medium"
                            color="primary"
                            variant="extended"
                            onClick={handleTransactionImportClicked}
                        >
                            <FileUploadIcon/>
                            Import
                        </Fab>
                    </Stack>
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
                <ImportTransactionDialog
                    open={isTransactionImportDialogOpen}
                    onSubmit={handleTransactionImportSubmitted}
                    onClose={() => setIsTransactionImportDialogOpen(false)}
                />
            </Stack>
        );
    }

    return renderContent();
}

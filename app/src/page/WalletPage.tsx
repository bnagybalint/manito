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

import { groupBy } from 'common/arrayUtils';

import TransactionList from 'component/TransactionList';
import TransactionFilter from 'component/TransactionFilter';
import TransactionDialog from 'component/TransactionDialog';

import { ITransaction } from 'api_client/model/Transaction';

import { selectCurrentUser, useUserStore } from 'stores/user';
import { useWalletStore } from 'stores/wallet';
import { selectFilteredTransactions, useTransactionStore } from 'stores/transaction';
import Localization from 'util/Localization';
import Transaction from 'entity/Transaction';


export default function WalletPage() {
    const now = moment();
    const [startDate, setStartDate] = useState(moment(now).startOf('month'));
    const [endDate, setEndDate] = useState(moment(now).endOf('month'));
    const [searchString, setSearchString] = useState("");
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [selectedTransactionIds, setSelectedTransactionIds] = useState(new Set<number>());

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

    const handleTransactionSelectedChanged = (transaction: Transaction, selected: boolean) => {
        const newSet = new Set(selectedTransactionIds);
        if(selected) {
            newSet.add(transaction.id!);
        } else {
            newSet.delete(transaction.id!);
        }
        console.log(newSet);
        setSelectedTransactionIds(newSet);
    }

    const renderTransactions = () => {
        if(transactions.length == 0) {
            return (
                <Card>
                    <CardContent>
                        <Typography align="center" sx={{ color: 'text.disabled' }}>No transactions to show</Typography>
                    </CardContent>
                </Card>
            );
        }
        
        const transactionsByDate = groupBy(transactions, (t) => Localization.formatDateLocale(t.time.startOf('day')));

        return (
            <Stack gap={1}>
                {Array.from(transactionsByDate.keys()).map((dateStr: string) => 
                    <Card>
                        <CardContent>
                            <Typography fontWeight="bold">{dateStr}</Typography>
                            <TransactionList
                                walletId={currentWallet!.id!}
                                transactions={transactionsByDate.get(dateStr)!}
                                onTransactionSelectedChange={handleTransactionSelectedChanged}
                            />
                        </CardContent>
                    </Card>
                )}
            </Stack>
        );
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
                    {selectedTransactionIds.size > 0 &&
                        <Fab
                            size="medium"
                            color="red"
                            variant="extended"
                            aria-label="delete"
                        >
                            <DeleteIcon />
                            Delete transactions ({selectedTransactionIds.size})
                        </Fab>
                    }
                </Stack>
                {renderTransactions()}
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

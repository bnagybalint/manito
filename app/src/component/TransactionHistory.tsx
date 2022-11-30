import {
    Typography,
    Card,
    CardContent,
    Stack,
} from '@mui/material';

import Localization from 'util/Localization';
import Transaction from 'entity/Transaction';
import TransactionList, {TransactionListSelectionModel} from 'component/TransactionList';
import { groupBy } from 'common/arrayUtils';
import { useWalletStore } from 'stores/wallet';

export type TransactionHistorySelectionModel = Set<Transaction>;

type Props = {
    walletId: number,
    transactions: Transaction[],
    selectionModel: TransactionHistorySelectionModel,

    onSelectionModelChange?: (model: TransactionHistorySelectionModel) => void,
};

export default function TransactionHistory(props: Props) {
    const currentWallet = useWalletStore((state) => state.currentWallet);
    
    if(props.transactions.length == 0) {
        return (
            <Card>
                <CardContent>
                    <Typography align="center" sx={{ color: 'text.disabled' }}>No transactions to show</Typography>
                </CardContent>
            </Card>
        );
    }

    const transactionsByDate = groupBy(props.transactions, (t) => Localization.formatDateLocale(t.time.startOf('day')));
    
    let selectionModelByDate = new Map<string, TransactionListSelectionModel>();
    transactionsByDate.forEach((transactionsForDate, dateStr) => {
        selectionModelByDate.set(dateStr, new Set(transactionsForDate.filter((t) => props.selectionModel.has(t))));
    });

    const handleSelectedChanged = (dateStr: string, model: TransactionListSelectionModel) => {
        selectionModelByDate.set(dateStr, model);
        const newSelectedTransactions = Array.from(selectionModelByDate.values()).flatMap((m) => Array.from(m.values()));
        props.onSelectionModelChange?.(new Set(newSelectedTransactions));
    }

    return (
        <Stack gap={1}>
            {Array.from(transactionsByDate.keys()).map((dateStr: string) => {
                return (
                    <Card>
                        <CardContent>
                            <Typography fontWeight="bold">{dateStr}</Typography>
                            <TransactionList
                                walletId={currentWallet!.id!}
                                transactions={transactionsByDate.get(dateStr)!}
                                selectionModel={selectionModelByDate.get(dateStr)!}
                                onSelectionModelChange={(model) => handleSelectedChanged(dateStr, model)}
                            />
                        </CardContent>
                    </Card>
                );
            }
            )}
        </Stack>
    );
};


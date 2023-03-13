import moment from 'moment';
import {
    Typography,
    Card,
    CardContent,
    Stack,
} from '@mui/material';

import Localization from 'util/Localization';
import Transaction from 'entity/Transaction';
import TransactionList, {TransactionListSelectionModel} from 'component/TransactionList';
import { groupBy, sortBy } from '@manito/common';
import { useWalletStore } from 'stores/wallet';

export type TransactionHistorySelectionModel = Set<number>;

type DayData = {
    dateStringInLocalTime: string, // for sorting purposes
    dateDisplay: string, // for display purposes
    transactions: Transaction[],
}

type Props = {
    walletId: number,
    transactions: Transaction[],
    selectionModel: TransactionHistorySelectionModel,

    onSelectionModelChange?: (model: TransactionHistorySelectionModel) => void,
};

export default function TransactionHistory(props: Props) {
    const currentWallet = useWalletStore((state) => state.currentWallet);
    
    if(props.transactions.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography align="center" sx={{ color: 'text.disabled' }}>No transactions to show</Typography>
                </CardContent>
            </Card>
        );
    }

    // group transactions by date
    const transactionsByDate = groupBy(props.transactions, (t) => moment(t.time).local().startOf('day').format('YYYYMMDD'));
    
    // generate DayData from groups
    const days: DayData[] = Array.from(transactionsByDate).map(([dateStringInLocalTime, transactions]) => ({
        dateStringInLocalTime: dateStringInLocalTime,
        dateDisplay: Localization.formatDateLocale(moment(dateStringInLocalTime, 'YYYYMMDD')),
        transactions: transactions,
    }));
    // sort dates descending
    const sortedDays = sortBy(days, (dd) => dd.dateStringInLocalTime).reverse();

    const selectionModelByDate = new Map<string, TransactionListSelectionModel>(
        sortedDays.map((dd) => [
            dd.dateStringInLocalTime,
            new Set(dd.transactions
                .filter((t) => props.selectionModel.has(t.id!))
                .map((t) => t.id!))
        ])
    );

    const handleSelectedChanged = (dateStringInLocalTime: string, model: TransactionListSelectionModel) => {
        selectionModelByDate.set(dateStringInLocalTime, model);
        const newSelectedTransactions = Array.from(selectionModelByDate.values()).flatMap((m) => Array.from(m.values()));
        props.onSelectionModelChange?.(new Set(newSelectedTransactions));
    }
    return (
        <Stack direction="column" gap={1}>
            {sortedDays.map((dayData) => {
                return (
                    <Card>
                        <CardContent>
                            <Typography fontWeight="bold">{dayData.dateDisplay}</Typography>
                            <TransactionList
                                walletId={currentWallet!.id!}
                                transactions={dayData.transactions}
                                selectionModel={selectionModelByDate.get(dayData.dateStringInLocalTime)!}
                                onSelectionModelChange={(model) => handleSelectedChanged(dayData.dateStringInLocalTime, model)}
                            />
                        </CardContent>
                    </Card>
                );
            }
            )}
        </Stack>
    );
};


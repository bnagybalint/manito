import {
    useTheme,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';

import Localization from 'util/Localization';
import Transaction from 'entity/Transaction';


export type TransactionListSelectionModel = {
    selectedTransactions: Set<Transaction>,
}

type RowProps = {
    walletId: number,
    transaction: Transaction,
    selected: boolean,

    onSelectedChange?: (selected: boolean) => void,
}

function TransactionRow(props: RowProps) {
    const amount = props.transaction.getSignedAmount(props.walletId);
    const amountString = Localization.formatMoneyAmount(amount);
    
    const theme = useTheme();
    const rowColor = props.selected ? theme.palette.primary.light : undefined;
    const amountColor = (amount < 0) ? theme.palette.negative.main : theme.palette.positive.main;

    const handleSelectedChanged = (e: any, selected: boolean) => {
        props.onSelectedChange?.(selected);
    }

    return (
        <TableRow sx={{backgroundColor: rowColor}}>
            <TableCell align="center" width={24}>
                <Checkbox
                    checked={props.selected}
                    onChange={handleSelectedChanged}
                />
            </TableCell>
            <TableCell>
                <Typography>{props.transaction.notes ?? '-'}</Typography>
            </TableCell>
            <TableCell align="right">
                <Typography color={amountColor}>{amountString} Ft</Typography>
            </TableCell>
        </TableRow>
    );
}

type Props = {
    walletId: number,
    transactions: Transaction[],
    selectionModel: TransactionListSelectionModel,

    onSelectionModelChange: (model: TransactionListSelectionModel) => void,
};

export default function TransactionList(props: Props) {


    const handleTransactionSelected = (transaction: Transaction, selected: boolean) => {
        const newSet = new Set(props.selectionModel.selectedTransactions);
        if(selected) {
            newSet.add(transaction);
        } else {
            newSet.delete(transaction);
        }
        props.onSelectionModelChange?.({ selectedTransactions: newSet });
    }

    return (
        <div style={{ width: '100%' }}>
            <Table
                size="small"
                padding="none"
            >
                <TableBody>
                    {props.transactions.map((transaction) => (
                        <TransactionRow
                            transaction={transaction}
                            walletId={props.walletId}
                            selected={props.selectionModel.selectedTransactions.has(transaction)}
                            onSelectedChange={(selected) => handleTransactionSelected(transaction, selected)}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

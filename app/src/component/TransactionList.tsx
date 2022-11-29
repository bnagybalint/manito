import { useState } from 'react';
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


type Props = {
    walletId: number,
    transactions: Transaction[],

    onTransactionSelectedChange?: (transaction: Transaction, selected: boolean) => void,
};

type RowProps = {
    walletId: number,
    transaction: Transaction,

    onSelectedChange?: (selected: boolean) => void,
}

function TransactionRow(props: RowProps) {
    const [selected, setSelected] = useState(false);
    
    const amount = props.transaction.getSignedAmount(props.walletId);
    const amountString = Localization.formatMoneyAmount(amount);
    
    const theme = useTheme();
    const rowColor = selected ? theme.palette.primary.light : undefined;
    const amountColor = (amount < 0) ? theme.palette.negative.main : theme.palette.positive.main;

    const handleSelectedChanged = (e: any, selected: boolean) => {
        setSelected(selected);
        props.onSelectedChange?.(selected);
    }

    return (
        <TableRow sx={{backgroundColor: rowColor}}>
            <TableCell align="center" width={24}>
                <Checkbox value={selected} onChange={handleSelectedChanged}/>
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

export default function TransactionList(props: Props) {
    const PAGE_SIZE = 5;

    const handleTransactionSelected = (transaction: Transaction, selected: boolean) => {
        props.onTransactionSelectedChange?.(transaction, selected);
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
                            onSelectedChange={(selected) => handleTransactionSelected(transaction, selected)}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

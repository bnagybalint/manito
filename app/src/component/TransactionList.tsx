import { useState } from 'react';
import clsx from 'clsx';
import { Checkbox, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import { GridValueGetterParams, GridCellParams, GridColumns } from '@mui/x-data-grid';

import Localization from 'util/Localization';
import Transaction from 'entity/Transaction';

import './TransactionList.css'


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
    const amountCellClassName = (amount < 0) ? 'numeric-by-sign-negative' : 'numeric-by-sign-positive';
    
    // TODO derive color from theme
    const rowClassName = selected ? 'transaction-row-selected' : '';

    const handleSelectedChanged = (e: any, selected: boolean) => {
        setSelected(selected);
        props.onSelectedChange?.(selected);
    }

    return (
        <TableRow className={rowClassName}>
            <TableCell align="center" className="transaction-row-cell-checkbox">
                <Checkbox value={selected} onChange={handleSelectedChanged}/>
            </TableCell>
            <TableCell>
                <Typography>{props.transaction.notes ?? '-'}</Typography>
            </TableCell>
            <TableCell align="right">
                <Typography className={amountCellClassName}>{amountString}</Typography>
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

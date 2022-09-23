import React from 'react';
import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';

import Localization from 'util/Localization';
import Transaction from 'entity/Transaction';


type Props = {
    transactions: Transaction[],
};

export default function TransactionList(props: Props) {
    const COLUMN_DEFINITIONS = [
        {
            field: 'amount',
            headerName: 'Amount',
            type: 'number',
            width: 150,
            valueGetter: (params: GridValueGetterParams) => Localization.formatMoneyAmount(params.row.amount),
        },
        {
            field: 'description',
            headerName: 'Note',
            width: 300,
        },
        {
            field: 'time',
            headerName: 'Time',
            width: 200,
            valueGetter: (params: GridValueGetterParams) => Localization.formatDate(params.row.time),
        },
    ];

    return (
        <div style={{ width: '100%' }}>
            <DataGrid
                autoHeight
                rows={props.transactions}
                columns={COLUMN_DEFINITIONS}
                pageSize={5}
                rowsPerPageOptions={[5, 10,20]}
                checkboxSelection
            />
        </div>
    );
}

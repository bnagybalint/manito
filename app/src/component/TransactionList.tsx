import clsx from 'clsx';
import React from 'react';
import { DataGrid, GridValueGetterParams, GridCellParams } from '@mui/x-data-grid';

import Localization from 'util/Localization';
import Transaction from 'entity/Transaction';


import './TransactionList.css'

type Props = {
    walletId: number,
    transactions: Transaction[],
};

export default function TransactionList(props: Props) {
    const COLUMN_DEFINITIONS = [
        {
            field: 'time',
            headerName: 'Date',
            width: 100,
            valueGetter: (params: GridValueGetterParams) => Localization.formatDate(params.row.time),
        },
        {
            field: 'amount',
            headerName: 'Amount',
            type: 'number',
            width: 150,
            valueGetter: (params: GridValueGetterParams<Transaction>) => params.row.getSignedAmount(props.walletId),
            cellClassName: (params: GridCellParams<number>) => {
                if (params.value == null) {
                    return '';
                }
                return clsx('numeric-by-sign', {
                    negative: params.value < 0,
                    positive: params.value >= 0,
                });
            },
            valueFormatter: ({value}: any) => Localization.formatMoneyAmount(value),
        },
        {
            field: 'notes',
            headerName: 'Notes',
            width: 300,
        },
    ];

    const PAGE_SIZE_OPTIONS = [10, 20, 50];

    const [pageSize, setPageSize] = React.useState<number>(PAGE_SIZE_OPTIONS[0]);

    return (
        <div style={{ width: '100%' }}>
            <DataGrid
                autoHeight
                rows={props.transactions}
                columns={COLUMN_DEFINITIONS}
                pageSize={pageSize}
                rowsPerPageOptions={PAGE_SIZE_OPTIONS}
                onPageSizeChange={(value) => setPageSize(value)}
                checkboxSelection
            />
        </div>
    );
}

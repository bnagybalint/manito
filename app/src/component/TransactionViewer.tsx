import React from 'react';
import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';

import { Localization } from 'util/Localization';
import { Transaction, Category } from 'entity';

import './TransactionViewer.css';


type Props = {};

type State = {
    transactions: Transaction[],
};

export class TransactionViewer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            transactions: [
                new Transaction(1, new Date(), new Category(1000, new Date(), "Groceries", ""), "SPAR bevasarlas", -20345),
                new Transaction(2, new Date(), new Category(1001, new Date(), "Income", ""), "Fizetes", 1000000),
            ]
        }
    }

    render() {

        const COLUMN_DEFINITIONS = [
            {
                field: 'time',
                headerName: 'Time',
                width: 200,
                valueGetter: (params: GridValueGetterParams) => Localization.formatDateTime(params.row.time),
            },
            {
                field: 'category',
                headerName: 'Category',
                sortable: false,
                width: 100,
                valueGetter: (params: GridValueGetterParams) => params.row.category.name,
            },
            {
                field: 'note',
                headerName: 'Note',
                width: 300,
            },
            {
                field: 'amount',
                headerName: 'Amount',
                type: 'number',
                width: 150,
                valueGetter: (params: GridValueGetterParams) => Localization.formatMoneyAmount(params.row.amount),
            },
        ];

        return (
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={this.state.transactions}
                    columns={COLUMN_DEFINITIONS}
                    pageSize={10}
                    rowsPerPageOptions={[10,20]}
                    checkboxSelection
                />
            </div>
        );
    }
}

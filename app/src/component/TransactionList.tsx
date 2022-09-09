import React from 'react';
import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';

import Localization from 'util/Localization';
import Transaction from 'entity/Transaction';


type Props = {};

type State = {
    transactions: Transaction[],
};

export default class TransactionList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            transactions: [
                {
                    id: 1,
                    time: new Date(),
                    category: {
                        id: 1000,
                        createdAt: new Date(),
                        name: 'Groceries',
                        iconUrl: '',
                    },
                    note: 'SPAR bevasarlas',
                    amount: -20345,
                },
                {
                    id: 2,
                    time: new Date(),
                    category: {
                        id: 1001,
                        createdAt: new Date(),
                        name: 'Income',
                        iconUrl: '',
                    },
                    note: 'Fizetes',
                    amount: 1000000,
                },
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
            <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                    rows={this.state.transactions}
                    columns={COLUMN_DEFINITIONS}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10,20]}
                    checkboxSelection
                />
            </div>
        );
    }
}

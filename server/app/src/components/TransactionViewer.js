import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

import Localization from '../util/Localization.js';

import './TransactionViewer.css'

export default class TransactionViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [
                {
                    id: 1,
                    time: new Date(),
                    category: "Groceries",
                    note: "SPAR bevasarlas",
                    amount: -20345,
                },
                {
                    id: 2,
                    time: new Date(),
                    category: "Income",
                    note: "Fizetes",
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
                valueGetter: (params) => Localization.formatDateTime(params.row.time),
            },
            {
                field: 'category',
                headerName: 'Category',
                sortable: false,
                width: 100,
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
                valueGetter: (params) => Localization.formatMoneyAmount(params.row.amount),
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

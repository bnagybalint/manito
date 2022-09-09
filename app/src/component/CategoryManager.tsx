import React from 'react';
import { DataGrid, GridValueGetterParams, GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';

import { Category } from 'entity';
import { Localization } from 'util/Localization';


type Props = {};

type State = {
    categories: Category[];
};

export class CategoryManager extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            categories: [
                new Category(1000, new Date(), "Income", ""),
                new Category(1001, new Date(), "Expense", ""),
                new Category(1002, new Date(), "Transfer", ""),
            ]
        }
    }

    render() {

        const COLUMN_DEFINITIONS: GridColDef[] = [
            {
                field: 'icon',
                headerName: '',
                sortable: false,
                width: 32,
                align: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    return (<img src={params.row.iconUrl} />);
                }
            },
            {
                field: 'name',
                headerName: 'Name',
                sortable: false,
                width: 100,
                valueGetter: (params: GridValueGetterParams) => params.row.name,
            },
            {
                field: 'createdAt',
                headerName: 'Created',
                width: 180,
                valueGetter: (params: GridValueGetterParams) => Localization.formatDateTime(params.row.time),
            },
        ];

        return (
            <div className="block">
                <h1 className="block-title">Categories</h1>
                <div className='button-row'>
                    <Button variant="contained">+ Add</Button>
                    <Button variant="contained" color="error">Delete</Button>
                </div>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={this.state.categories}
                        columns={COLUMN_DEFINITIONS}
                        pageSize={10}
                        rowsPerPageOptions={[5,10]}
                        checkboxSelection
                    />
                </div>
            </div>
        );
    }
}

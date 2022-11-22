import {
    DataGrid,
    GridValueGetterParams,
    GridRenderCellParams,
    GridColDef,
} from '@mui/x-data-grid';
import { Button } from '@mui/material';

import Localization from 'util/Localization';
import { selectAllCategories, useCategoryStore } from 'stores/category';

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

export default function CategoryList() {
    const categories = useCategoryStore(selectAllCategories);

    return (
        <div className="block">
            <h1 className="block-title">Categories</h1>
            <div className='button-row'>
                <Button variant="contained">+ Add</Button>
                <Button variant="contained" color="error">Delete</Button>
            </div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={categories}
                    columns={COLUMN_DEFINITIONS}
                    pageSize={10}
                    rowsPerPageOptions={[5,10]}
                    checkboxSelection
                />
            </div>
        </div>
    );
}

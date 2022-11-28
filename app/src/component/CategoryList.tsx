import {
    DataGrid,
    GridValueGetterParams,
    GridRenderCellParams,
    GridColDef,
} from '@mui/x-data-grid';

import Localization from 'util/Localization';
import Category from 'entity/Category';

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

type Props = {
    categories: Category[],
}

export default function CategoryList(props: Props) {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={props.categories}
                columns={COLUMN_DEFINITIONS}
                pageSize={10}
                rowsPerPageOptions={[5,10]}
                checkboxSelection
            />
        </div>
    );
}

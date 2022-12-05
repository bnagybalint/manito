import {
    useTheme,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';

import Category from 'entity/Category';


export type CategoryListSelectionModel = Set<number>;

type RowProps = {
    category: Category,
    selected: boolean,

    onSelectedChange?: (selected: boolean) => void,
}

function CategoryRow(props: RowProps) {
    const theme = useTheme();
    const rowColor = props.selected ? theme.palette.primary.light : undefined;

    const handleSelectedChanged = (e: any, selected: boolean) => {
        props.onSelectedChange?.(selected);
    }

    return (
        <TableRow
            sx={{
                backgroundColor: rowColor,
                "& td": { border: 0},
            }}
        >
            <TableCell align="center" width={24}>
                <Checkbox
                    checked={props.selected}
                    onChange={handleSelectedChanged}
                />
            </TableCell>
            <TableCell>
                <Typography>{props.category.name}</Typography>
            </TableCell>
        </TableRow>
    );
}

type Props = {
    categories: Category[],
    selectionModel: CategoryListSelectionModel,

    onSelectionModelChange: (model: CategoryListSelectionModel) => void,
};

export default function CategoryList(props: Props) {
    const handleCategorySelected = (category: Category, selected: boolean) => {
        const newModel = new Set(props.selectionModel);
        if(selected) {
            newModel.add(category.id!);
        } else {
            newModel.delete(category.id!);
        }
        props.onSelectionModelChange?.(newModel);
    }

    return (
        <Table
            size="small"
            padding="none"
        >
            <TableBody>
                {props.categories.map((category) => (
                    <CategoryRow
                        category={category}
                        selected={props.selectionModel.has(category.id!)}
                        onSelectedChange={(selected) => handleCategorySelected(category, selected)}
                    />
                ))}
            </TableBody>
        </Table>
    );
}

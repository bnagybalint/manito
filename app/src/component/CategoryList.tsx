import { useEffect } from 'react';
import {
    useTheme,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableRow,
} from '@mui/material';

import Category from 'entity/Category';
import { selectIconById, useIconStore } from 'stores/icon';
import CategoryIcon from 'component/CategoryIcon';


export type CategoryListSelectionModel = Set<number>;

type RowProps = {
    category: Category,
    selected: boolean,

    onSelectedChange?: (selected: boolean) => void,
}

function CategoryRow(props: RowProps) {
    const theme = useTheme();
    const rowColor = props.selected ? theme.palette.primary.light : undefined;

    const icon = useIconStore(selectIconById(props.category.iconId));
    const fetchIcons = useIconStore((state) => state.fetchIcons);

    useEffect(() => {
        fetchIcons();
    }, [fetchIcons]);

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
            <TableCell align="center">
                <Checkbox
                    checked={props.selected}
                    onChange={handleSelectedChanged}
                />
            </TableCell>
            <TableCell sx={{ pr: 1 }} width={36}>
                <CategoryIcon
                    color={props.category.iconColor}
                    text={props.category.name}
                    imageUrl={icon?.imageUrl}
                />
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
            style={{ width: "auto" }}
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

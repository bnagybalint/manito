    import { useEffect } from 'react';
import {
    useTheme,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Alert,
    AlertTitle,
    Skeleton,
} from '@mui/material';

import CategoryIcon from 'component/CategoryIcon';
import { sortBy } from '@manito/common';
import Localization from 'util/Localization';
import Transaction from 'entity/Transaction';
import { selectCategoryById, useCategoryStore } from 'stores/category';
import { selectIconById, useIconStore } from 'stores/icon';
import { useUserStore } from 'stores/user';


export type TransactionListSelectionModel = Set<number>;

type RowProps = {
    walletId: number,
    transaction: Transaction,
    selected: boolean,

    onSelectedChange?: (selected: boolean) => void,
}

function TransactionRow(props: RowProps) {
    const category = useCategoryStore(selectCategoryById(props.transaction.categoryId))!;

    const icon = useIconStore(selectIconById(category!.iconId));

    const amount = props.transaction.getSignedAmount(props.walletId);
    const amountString = Localization.formatMoneyAmount(amount);
    
    const theme = useTheme();
    const rowColor = props.selected ? theme.palette.primary.light : undefined;
    const amountColor = (amount < 0) ? theme.palette.negative.main : theme.palette.positive.main;

    const handleSelectedChanged = (e: any, selected: boolean) => {
        props.onSelectedChange?.(selected);
    }

    return (
        <TableRow
            sx={{
                backgroundColor: rowColor,
                "&:last-child td": { border: 0},
            }}
        >
            <TableCell align="center" width={24}>
                <Checkbox
                    checked={props.selected}
                    onChange={handleSelectedChanged}
                />
            </TableCell>
            <TableCell align="center" width={250}>
                <CategoryIcon
                    color={category.iconColor}
                    text={category.name}
                    imageUrl={icon?.imageUrl}
                />
            </TableCell>
            <TableCell>
                <Typography noWrap padding={1}>{props.transaction.notes ?? '-'}</Typography>
            </TableCell>
            <TableCell align="right">
                <Typography noWrap padding={1} color={amountColor}>{amountString} Ft</Typography>
            </TableCell>
        </TableRow>
    );
}

type Props = {
    walletId: number,
    transactions: Transaction[],
    selectionModel: TransactionListSelectionModel,

    onSelectionModelChange: (model: TransactionListSelectionModel) => void,
};

export default function TransactionList(props: Props) {
    const transactions = sortBy(props.transactions, (t) => t.id);

    const currentUser = useUserStore((state) => state.loginUser)!;
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);
    const categoriesLoaded = useCategoryStore((state) => state.loaded);
    const categoriesError = useCategoryStore((state) => state.error);
    
    useEffect(() => {
        fetchCategories(currentUser!.id!);
    }, [currentUser, fetchCategories]);
    
    const handleTransactionSelected = (transaction: Transaction, selected: boolean) => {
        const newModel = new Set(props.selectionModel);
        if(selected) {
            newModel.add(transaction.id!);
        } else {
            newModel.delete(transaction.id!);
        }
        props.onSelectionModelChange?.(newModel);
    }

    const error = categoriesError;
    if(error != null) {
        return (
            <Alert severity="error" >
                <AlertTitle><b>Error</b></AlertTitle>
                {error}
            </Alert>
        );
    }

    if(!categoriesLoaded) {
        return (
            <div>
                <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
            </div>
        );
    }

    return (
        <div style={{ width: '100%' }}>
            <Table
                size="small"
                padding="none"
                style={{ width: "100%" }}
            >
                <TableBody>
                    {transactions.map((transaction) => (
                        <TransactionRow
                            transaction={transaction}
                            walletId={props.walletId}
                            selected={props.selectionModel.has(transaction.id!)}
                            onSelectedChange={(selected) => handleTransactionSelected(transaction, selected)}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

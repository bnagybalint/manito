import { useEffect, useState } from 'react';
import moment from 'moment';

import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControlLabel,
    FormControl,
    InputAdornment,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    MenuItem,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { DatePicker } from '@mui/x-date-pickers'

import { DropDown } from '@manito/core-ui-components';
import CategoryIcon from 'component/CategoryIcon';

import Transaction, { TransactionType } from 'entity/Transaction';
import Category from 'entity/Category';
import { selectFindCategoryById, useCategoryStore } from 'stores/category';
import { useUserStore } from 'stores/user';
import { useWalletStore, selectAllWallets } from 'stores/wallet';
import { useIconStore, selectAllIconsById } from 'stores/icon';


type ValidationErrors = {
    date?: string,
    category?: string,
    amount?: string,
    notes?: string,
};

type Props = {
    open: boolean,
    transaction?: Transaction,

    onCreate?: (value: Transaction) => void,
    onEdit?: (value: Transaction) => void,
    onClose?: () => void,
};

export default function TransactionCreateEditDialog(props: Props) {
    const [transactionTime, setTransactionTime] = useState(moment());
    const [amount, setAmount] = useState<number | null>(null);
    const [notes, setNotes] = useState<string | null>(null);
    const [transactionCategory, setTransactionCategory] = useState<Category | null>(null);
    const [transactionType, setTransactionType] = useState('expense');
    const [keepOpenOnSubmit, setKeepOpenOnSubmit] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [sourceWalletId, setSourceWalletId] = useState<number | undefined>(undefined);
    const [destinationWalletId, setDestinationWalletId] = useState<number | undefined>(undefined);

    const currentUser = useUserStore((state) => state.loginUser)!;
    const currentWallet = useWalletStore((state) => state.currentWallet)!;
    const allWallets = useWalletStore(selectAllWallets);
    const categories = useCategoryStore((state) => state.categories);
    const findCategoryById = useCategoryStore(selectFindCategoryById);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    const categoryIconsById = useIconStore(selectAllIconsById);
    const fetchIcons = useIconStore((state) => state.fetchIcons);

    const isEditMode = props.transaction && props.transaction.id !== undefined;

    useEffect(() => {
        fetchCategories(currentUser.id);
        fetchIcons();

        if(isEditMode) {
            setTransactionTime(props.transaction!.time);
            setAmount(props.transaction!.amount);
            setNotes(props.transaction!.notes ?? null);
            setTransactionCategory(findCategoryById(props.transaction!.categoryId) ?? null);
            setTransactionType(props.transaction!.getTransactionType(currentWallet.id));
            setSourceWalletId(props.transaction!.sourceWalletId);
            setDestinationWalletId(props.transaction!.destinationWalletId);
        } else {
            setTransactionTime(moment());
            setAmount(null);
            setNotes(null);
            setTransactionCategory(null);
            setTransactionType('expense');
            setSourceWalletId(currentWallet.id!);
            setDestinationWalletId(undefined);
        }
    }, [props.transaction, currentUser, currentWallet, isEditMode, fetchCategories, findCategoryById, fetchIcons]);

    const validateForm = () => {
        let result: ValidationErrors = {}
        if(amount === null || amount === undefined) {
            result.amount = 'Required';
        }
        if(amount === 0) {
            result.amount = 'Cannot be zero';
        }
        if(transactionCategory === null || transactionCategory === undefined) {
            result.category = 'Required';
        }
        return result;
    }

    const clearFormAfterSubmit = () => {
        // NOTE: do not reset date and category for convenience
        setAmount(null);
        setNotes(null);
    }

    const handleClose = () => {
        setValidationErrors({});
        props.onClose?.();
    }

    const handleSubmit = () => {
        const validationErrors = validateForm();
        setValidationErrors(validationErrors);

        if(Object.keys(validationErrors).length !== 0) {
            return;
        }

        const transaction = new Transaction({
            id: props.transaction?.id,
            time: transactionTime.utc(),
            amount: amount!,
            notes: notes ?? undefined,
            categoryId: transactionCategory!.id!,
            sourceWalletId: sourceWalletId,
            destinationWalletId: destinationWalletId,
        });

        if(isEditMode) {
            props.onEdit?.(transaction);
        } else {
            props.onCreate?.(transaction);
        }

        clearFormAfterSubmit();

        if(!keepOpenOnSubmit)
        {
            props.onClose?.();
        }
    }

    const handleTransactionTypeChange = (newValue: TransactionType) => {
        if(newValue == null)
        {
            // ignore, one button must be active
            return;
        }

        setTransactionType(newValue);
    }

    const handleTransactionCategoryChanged = (categoryId: number) => {
        const category = categories.find((c) => c.id === categoryId);
        setTransactionCategory(category!);
    }

    const handleAmountChanged = (e: any) => {
        const rawValue = e.target.value;
        if(rawValue === '') {
            setAmount(null);
        } else {
            const x = parseFloat(rawValue);
            if(!isNaN(x)) {
                setAmount(x);
            }
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>{isEditMode ? 'Edit' : 'New'} transaction</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <Stack direction="column" sx={{p: 1}} gap={1}>
                        <ToggleButtonGroup
                            exclusive
                            value={transactionType}
                            onChange={(e, newValue) => handleTransactionTypeChange(newValue)}
                            fullWidth
                        >
                            <ToggleButton color="red" value="expense">Expense</ToggleButton>
                            <ToggleButton color="green" value="income">Income</ToggleButton>
                            <ToggleButton color="blue" value="transfer">Transfer</ToggleButton>
                        </ToggleButtonGroup>
                        { transactionType === 'transfer' &&
                            <Stack direction="row" gap={1}>
                                <DropDown
                                    label="From wallet"
                                    value={sourceWalletId?.toString()}
                                    margin="none"
                                    fullWidth
                                >
                                    { allWallets.map((w) =>
                                        <MenuItem key={w.id} value={w.id.toString()}>{w.name}</MenuItem>
                                    )}
                                </DropDown>
                                <Button
                                    variant="outlined"
                                    type="button"
                                    // sx={{ padding: 1 }}
                                    size="small"
                                >
                                    <ArrowForwardIcon />
                                </Button>
                                <DropDown
                                    label="To wallet"
                                    value={destinationWalletId?.toString()}
                                    fullWidth
                                    margin="none"
                                >
                                    { allWallets.map((w) =>
                                        <MenuItem key={w.id} value={w.id.toString()}>{w.name}</MenuItem>
                                    )}
                                </DropDown>
                            </Stack>
                        }
                        <DatePicker
                            label="Date"
                            value={moment(transactionTime).local()}
                            onChange={(e) => setTransactionTime(e!)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <TextField
                            label="Category"
                            variant="outlined"
                            select
                            required
                            value={transactionCategory?.id ?? ''}
                            error={validationErrors.category !== undefined}
                            helperText={validationErrors.category}
                            onChange={(e) => handleTransactionCategoryChanged(e.target.value as any as number)}
                        >
                            {categories.map((category, idx) => {
                                // <MenuItem key={idx} value={category.id}>{category.name}</MenuItem>
                                const icon = categoryIconsById.get(category.iconId)!;
                                return (
                                    <MenuItem key={idx} value={category.id}>
                                        <CategoryIcon
                                            color={category.iconColor}
                                            text={category.name}
                                            imageUrl={icon?.imageUrl}/>
                                    </MenuItem>
                                )}
                            )}
                        </TextField>
                        <TextField
                            label="Amount"
                            variant="outlined"
                            placeholder="0"
                            required
                            value={amount ?? ""}
                            type="number"
                            error={validationErrors.amount !== undefined}
                            helperText={validationErrors.amount}
                            onChange={(e) => handleAmountChanged(e)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{transactionType === 'expense' ? '-' : '+'}</InputAdornment>,
                                endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Note (optional)"
                            variant="outlined"
                            value={notes ?? ""}
                            placeholder="e.g. Groceries"
                            error={validationErrors.notes !== undefined}
                            helperText={validationErrors.notes}
                            onChange={(e) => setNotes(e.target.value)}
                            />
                        <Box sx={{display: "inline-flex", justifyContent: "flex-end"}}>
                            {!isEditMode &&
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value={keepOpenOnSubmit}
                                            onChange={(e) => setKeepOpenOnSubmit(e.target.checked)}
                                        />
                                    }
                                    label="Keep open"
                                />
                            }
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </Box>
                    </Stack>
                </FormControl>
            </DialogContent>
        </Dialog>
    );
}

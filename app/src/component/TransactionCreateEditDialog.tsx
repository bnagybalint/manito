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
import { DatePicker } from '@mui/x-date-pickers'

import Transaction, { TransactionType } from 'entity/Transaction';
import Category from 'entity/Category';
import { selectCategoryById, useCategoryStore } from 'stores/category';
import { useUserStore } from 'stores/user';
import { useWalletStore } from 'stores/wallet';


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
    
    const currentUser = useUserStore((state) => state.loginUser)!;
    const currentWallet = useWalletStore((state) => state.currentWallet)!;
    const categories = useCategoryStore((state) => state.categories);
    const getCategoryById = useCategoryStore(selectCategoryById);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);
    
    const isEditMode = props.transaction && props.transaction.id !== undefined;

    useEffect(() => {
        fetchCategories(currentUser.id);

        if(isEditMode) {
            setTransactionTime(props.transaction!.time);
            setAmount(props.transaction!.amount);
            setNotes(props.transaction!.notes ?? null);
            setTransactionCategory(getCategoryById(props.transaction?.categoryId!) ?? null);
            setTransactionType(props.transaction!.getTransactionType(currentWallet.id));
        } else {
            setTransactionTime(moment());
            setAmount(null);
            setNotes(null);
            setTransactionCategory(null);
            setTransactionType('expense');
        }
    }, [props.transaction, currentUser, currentWallet, isEditMode, fetchCategories, getCategoryById]);

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
            categoryId: transactionCategory?.id,
            sourceWalletId: transactionType === 'income' ? undefined : currentWallet.id,
            destinationWalletId: transactionType === 'income' ? currentWallet.id : undefined,
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
        >
            <DialogTitle>{isEditMode ? 'Edit' : 'New'} transaction</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <Stack sx={{p: 1}} gap={1}>
                        <ToggleButtonGroup
                            exclusive
                            value={transactionType}
                            onChange={(e, newValue) => handleTransactionTypeChange(newValue)}
                        >
                            <ToggleButton color="red" value="expense">Expense</ToggleButton>
                            <ToggleButton color="green" value="income">Income</ToggleButton>
                            <ToggleButton disabled value="transfer">Transfer</ToggleButton>
                        </ToggleButtonGroup>
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
                            value={transactionCategory?.id ?? ''}
                            error={validationErrors.category !== undefined}
                            helperText={validationErrors.category}
                            onChange={(e) => handleTransactionCategoryChanged(e.target.value as any as number)}
                        >
                            {categories.map((category, idx) => (
                                <MenuItem key={idx} value={category.id}>{category.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Amount"
                            variant="outlined"
                            placeholder="0"
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
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value={keepOpenOnSubmit}
                                        onChange={(e) => setKeepOpenOnSubmit(e.target.checked)}
                                    />
                                }
                                label="Keep open"
                            />
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

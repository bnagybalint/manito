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

import Transaction from 'entity/Transaction';
import Wallet from 'entity/Wallet'
import Category from 'entity/Category';
import { useCategoryStore } from 'stores/category';
import { useUserStore } from 'stores/user';


type TransactionType = 'income' | 'expense' | 'transfer';

type Props = {
    open: boolean,

    wallet: Wallet,

    onSubmit?: (value: Transaction) => void,
    onClose?: () => void,
};

export default function TransactionDialog(props: Props) {
    const [transactionTime, setTransactionTime] = useState(moment());
    const [amount, setAmount] = useState<number | null>(null);
    const [notes, setNotes] = useState<string | null>(null);
    const [transactionCategory, setTransactionCategory] = useState<Category | null>(null);
    const [transactionType, setTransactionType] = useState('income');
    const [activeWallet] = useState(props.wallet);
    const [keepOpenOnSubmit, setKeepOpenOnSubmit] = useState(false);

    const currentUser = useUserStore((state) => state.loginUser);
    const categories = useCategoryStore((state) => state.categories);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    useEffect(() => {
        fetchCategories(currentUser!.id);
    });

    const clearForm = () => {
        // NOTE: do not reset date for convenience
        setAmount(null);
        setNotes(null);
    }

    const handleSubmit = () => {
        const transaction = new Transaction({
            time: transactionTime!,
            amount: amount!,
            notes: notes ?? undefined,
            categoryId: transactionCategory?.id,
            sourceWalletId: transactionType === 'income' ? undefined : activeWallet.id,
            destinationWalletId: transactionType === 'income' ? activeWallet.id : undefined,
        });

        props.onSubmit?.(transaction);

        clearForm();

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
            onClose={() => props.onClose?.()}
        >
            <DialogTitle>New transaction</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <Stack sx={{p: 1}} gap={1}>
                        <ToggleButtonGroup
                            exclusive
                            value={transactionType}
                            onChange={(e, newValue) => handleTransactionTypeChange(newValue)}
                        >
                            <ToggleButton color="green" value="income">Income</ToggleButton>
                            <ToggleButton color="red" value="expense">Expense</ToggleButton>
                            <ToggleButton disabled value="transfer">Transfer</ToggleButton>
                        </ToggleButtonGroup>
                        <DatePicker
                            label="Date"
                            value={transactionTime}
                            onChange={(e) => setTransactionTime(e!)}
                            renderInput={(params) => <TextField {...params} />}
                        />
                        <TextField
                            label="Category"
                            variant="outlined"
                            select
                            value={transactionCategory?.id ?? ''}
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
                            <Button variant="contained"  onClick={handleSubmit}>Save</Button>
                        </Box>
                    </Stack>
                </FormControl>
            </DialogContent>
        </Dialog>
    );
}

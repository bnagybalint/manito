import moment from 'moment';
import React from 'react';

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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers'

import { ITransaction } from 'api_client/model/Transaction';
import Wallet from 'entity/Wallet'

type TransactionType = 'income' | 'expense' | 'transfer';

type Props = {
    open: boolean,

    wallet: Wallet,

    onSubmit?: (value: ITransaction) => void,
    onClose?: () => void,
};

type State = {
    time: moment.Moment,
    amount: number | null,
    notes: string | null,
    transactionType: TransactionType,
    activeWallet: Wallet,
    
    // Keeps the dialog open when it is submitted
    keepOpenOnSubmit: boolean;
};

export default class TransactionDialog extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            time: moment(),
            amount: null,
            notes: null,
            transactionType: 'income',
            activeWallet: props.wallet,
            keepOpenOnSubmit: false,
        }
    }

    clearForm() {
        this.setState({
            // NOTE: do not reset date for convenience
            amount: null,
            notes: null,
        })
    }

    handleSubmit() {
        const transaction: ITransaction = {
            time: this.state.time!,
            amount: this.state.amount!,
            notes: this.state.notes ?? undefined,
            sourceWalletId: this.state.transactionType == 'income' ? undefined : this.state.activeWallet.id,
            destinationWalletId: this.state.transactionType == 'income' ? this.state.activeWallet.id : undefined,
        };

        this.props.onSubmit?.(transaction);

        this.clearForm();

        if(!this.state.keepOpenOnSubmit)
        {
            this.props.onClose?.();
        }
    }

    handleTransactionTypeChange(newValue: TransactionType) {
        if(newValue == null)
        {
            // ignore, one button must be active
            return;
        }

        this.setState({transactionType: newValue});
    }

    handleAmountChanged(e: any) {
        const rawValue = e.target.value;
        if(rawValue == '') {
            this.setState({amount: null});
        } else {
            const x = parseFloat(rawValue);
            if(!isNaN(x)) {
                this.setState({amount: x});
            }
        }
    }
    
    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={() => this.props.onClose?.()}
            >
                <DialogTitle>New transaction</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <Stack sx={{p: 1}} gap={1}>
                            <ToggleButtonGroup
                                exclusive
                                value={this.state.transactionType}
                                onChange={(e, newValue) => this.handleTransactionTypeChange(newValue)}
                            >
                                <ToggleButton color="primary" value="income">Income</ToggleButton>
                                <ToggleButton color="secondary" value="expense">Expense</ToggleButton>
                                <ToggleButton disabled color="standard" value="transfer">Transfer</ToggleButton>
                            </ToggleButtonGroup>
                            <DatePicker
                                label="Date"
                                value={this.state.time}
                                onChange={(e) => this.setState({time: e!})}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <TextField
                                label="Amount"
                                variant="outlined"
                                placeholder="0"
                                value={this.state.amount ?? ""}
                                type="number"
                                onChange={(e) => this.handleAmountChanged(e)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">{this.state.transactionType == 'expense' ? '-' : '+'}</InputAdornment>,
                                    endAdornment: <InputAdornment position="end">Ft</InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Note (optional)"
                                variant="outlined"
                                value={this.state.notes ?? ""}
                                placeholder="e.g. Groceries"
                                onChange={(e) => this.setState({notes: e.target.value})}
                                />
                            <Box sx={{display: "inline-flex", justifyContent: "flex-end"}}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value={this.state.keepOpenOnSubmit}
                                            onChange={(e) => this.setState({keepOpenOnSubmit: e.target.checked})}
                                        />
                                    }
                                    label="Keep open"
                                />
                                <Button variant="contained"  onClick={() => this.handleSubmit()}>Save</Button>
                            </Box>
                        </Stack>
                    </FormControl>
                </DialogContent>
            </Dialog>
        );
    }
}
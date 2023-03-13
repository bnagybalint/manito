import {
    TextField as MuiTextField,
} from '@mui/material';
import { ReactNode } from 'react';


type Props = {
    children: ReactNode,
    label?: string,
    value?: string,
    required?: boolean,
    placeholder?: string,
    margin?: 'dense' | 'normal' | 'none';
    fullWidth?: boolean;
    // Function called when the checked state changes
    onChange?: (value: string) => void,
}

export function DropDown({children, label, value, required, placeholder, margin, fullWidth, onChange}: Props) {
    return (
        <MuiTextField
            label={label}
            variant="outlined"
            select
            required={required}
            value={value}
            onChange={(e) => onChange?.(e.target.value!)}
            size="small"
            margin={margin ?? 'dense'}
            placeholder={placeholder}
            fullWidth={fullWidth}
        >
            {children}
        </MuiTextField>
    );
}
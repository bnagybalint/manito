import {
    Checkbox as MuiCheckbox,
    FormControlLabel as MuiFormControlLabel,
} from '@mui/material';


type Props = {
    label?: string,
    checked?: boolean,
    // Function called when the checked state changes
    onChange?: (checked: boolean) => void,
}

export function Checkbox({label, checked, onChange}: Props) {
    return (
        <MuiFormControlLabel
            label={label}
            control={
                <MuiCheckbox
                    size="small"
                    checked={checked}
                    onChange={(e) => onChange?.(e.target.checked!)}
                />
            }
        />
    );
}
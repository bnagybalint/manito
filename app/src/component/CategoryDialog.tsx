import { useState } from 'react';

import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControlLabel,
    FormControl,
    Stack,
    TextField,
} from '@mui/material';

import Category from 'entity/Category';
import { useUserStore } from 'stores/user';


type ValidationErrors = {
    name?: string,
};

type Props = {
    open: boolean,

    onSubmit?: (value: Category) => void,
    onClose?: () => void,
};

export default function CategoryDialog(props: Props) {
    const [categoryName, setCategoryName] = useState('')
    const [keepOpenOnSubmit, setKeepOpenOnSubmit] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const currentUser = useUserStore((state) => state.loginUser);

    const validateForm = () => {
        let result: ValidationErrors = {}
        if(categoryName === null || categoryName === undefined || categoryName === "") {
            result.name = 'Required';
        }
        return result;
    }

    const clearForm = () => {
        setCategoryName('');
    }

    const handleClose = () => {
        setValidationErrors({});
        props.onClose?.();
    }

    const handleSubmit = () => {
        const validationErrors = validateForm();
        
        if(Object.keys(validationErrors).length !== 0) {
            setValidationErrors(validationErrors);
            return;
        }

        const category = new Category({
            name: categoryName,
            iconUrl: "dummy",
            ownerId: currentUser!.id,
        });

        props.onSubmit?.(category);

        clearForm();

        if(!keepOpenOnSubmit)
        {
            props.onClose?.();
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
        >
            <DialogTitle>New category</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <Stack sx={{p: 1}} gap={1}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            value={categoryName}
                            placeholder="e.g. Bills"
                            error={validationErrors.name !== undefined}
                            helperText={validationErrors.name}
                            onChange={(e) => setCategoryName(e.target.value)}
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

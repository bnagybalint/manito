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


type Props = {
    open: boolean,

    onSubmit?: (value: Category) => void,
    onClose?: () => void,
};

export default function CategoryDialog(props: Props) {
    const [categoryName, setCategoryName] = useState('')
    const [keepOpenOnSubmit, setKeepOpenOnSubmit] = useState(false);

    const currentUser = useUserStore((state) => state.loginUser);

    const clearForm = () => {
        setCategoryName('');
    }

    const handleSubmit = () => {
        const category = new Category({
            name: categoryName,
            iconUrl: "dummy",
            ownerId: currentUser!.id,
        });

        props.onSubmit?.(category);

        clearForm();

        console.log(keepOpenOnSubmit);
        if(!keepOpenOnSubmit)
        {
            props.onClose?.();
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={() => props.onClose?.()}
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

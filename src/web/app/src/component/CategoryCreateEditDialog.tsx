import { useEffect, useState } from 'react';

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
    MenuItem,
} from '@mui/material';

import Category from 'entity/Category';
import CategoryIcon from 'component/CategoryIcon';
import { useUserStore } from 'stores/user';
import { selectAllIcons, useIconStore } from 'stores/icon';


type ValidationErrors = {
    name?: string,
    icon?: string,
    iconColor?: string,
};

type Props = {
    open: boolean,
    category?: Category,

    onCreate?: (value: Category) => void,
    onEdit?: (value: Category) => void,
    onClose?: () => void,
};

const AVAILABLE_COLORS = [
    "#9f9f9f", // gray
    "#fa962f",
    "#ff5352", // red
    "#ff52d7",
    "#a052ff", // lilac
    "#5867ff",
    "#5ec4ff", // blue
    "#58ffde",
    "#52ff7c", // green
    // // "#7bfa2f",
    "#f0f20e", // yellow
]

const DEFAULT_COLOR = AVAILABLE_COLORS[0];

export default function CategoryCreateEditDialog(props: Props) {
    const [categoryName, setCategoryName] = useState('');
    const [categoryIconId, setCategoryIconId] = useState<number | null>(null);
    const [categoryIconColor, setCategoryIconColor] = useState<string>(DEFAULT_COLOR);
    const [keepOpenOnSubmit, setKeepOpenOnSubmit] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const currentUser = useUserStore((state) => state.loginUser)!;

    const allIcons = useIconStore(selectAllIcons);
    const fetchIcons = useIconStore((state) => state.fetchIcons);

    const isEditMode = props.category && props.category.id !== undefined;

    useEffect(() => {
        fetchIcons();
        if(isEditMode) {
            setCategoryName(props.category!.name);
            setCategoryIconId(props.category!.iconId);
            setCategoryIconColor(props.category!.iconColor);
        } else {
            setCategoryName('');
            setCategoryIconId(null);
            setCategoryIconColor(DEFAULT_COLOR);
        }
    }, [props.category, isEditMode, fetchIcons]);

    const validateForm = () => {
        let result: ValidationErrors = {}
        if(categoryName === null || categoryName === undefined || categoryName === "") {
            result.name = 'Required';
        }
        if(categoryIconId === null || categoryIconId === undefined) {
            result.icon = 'Required';
        }
        return result;
    }

    const clearForm = () => {
        setCategoryName('');
        setCategoryIconId(null);
        setCategoryIconColor(DEFAULT_COLOR);
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
            id: isEditMode ? props.category!.id : undefined,
            ownerId: isEditMode ? props.category!.ownerId : currentUser.id,
            name: categoryName,
            iconId: categoryIconId!,
            iconColor: categoryIconColor!,
        });

        if(isEditMode) {
            props.onEdit?.(category);
        } else {
            props.onCreate?.(category);
        }

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
            <DialogTitle>{isEditMode ? 'Edit' : 'New'} category</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <Stack direction="column" sx={{p: 1}} gap={1}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            required
                            value={categoryName}
                            placeholder="e.g. Bills"
                            error={validationErrors.name !== undefined}
                            helperText={validationErrors.name}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        <Stack direction="row" gap={1}>
                            <TextField
                                label="Icon"
                                variant="outlined"
                                select
                                required
                                fullWidth={true}
                                value={categoryIconId ?? ''}
                                onChange={(e) => setCategoryIconId(e.target.value as any as number)}
                            >
                                {allIcons.map((icon, idx) => (
                                    <MenuItem key={idx} value={icon.id}>
                                        <CategoryIcon
                                            color={categoryIconColor}
                                            imageUrl={icon?.imageUrl}
                                        />
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Color"
                                variant="outlined"
                                select
                                required
                                fullWidth={true}
                                value={categoryIconColor.toLowerCase()}
                                onChange={(e) => setCategoryIconColor(e.target.value)}
                            >
                                {AVAILABLE_COLORS.map((colorHex, idx) => (
                                    <MenuItem key={idx} value={colorHex}>
                                        <CategoryIcon color={colorHex}/>
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
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
                            <Button variant="contained"  onClick={handleSubmit}>Save</Button>
                        </Box>
                    </Stack>
                </FormControl>
            </DialogContent>
        </Dialog>
    );
}

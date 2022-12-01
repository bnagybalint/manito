import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
 } from "@mui/material";
import { Stack } from "@mui/system";


type Props = {
    open: boolean,
    message?: string,
    title?: string,
    color?: any,
    hideCancelButton?: boolean,
    cancelColor?: any,
    buttonText?: string,
    cancelButtonText?: string,
    
    onClose?: () => void,
    onConfirm?: () => void,
}

export default function ConfirmDialog(props: Props) {
    return (
        <Dialog
            fullWidth={true}
            maxWidth="xs"
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle align="center" fontWeight="bold">{props.title ?? 'Confirm?'}</DialogTitle>
            <DialogContent>
                <Stack gap={1}>
                    <Typography textAlign="center">{props.message ?? ''}</Typography>
                        <Box 
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Stack gap={1} direction="row">
                                {!props.hideCancelButton &&
                                    <Button
                                        variant="contained"
                                        color={props.cancelColor ?? 'undesired'}
                                        onClick={() => props.onClose?.()}
                                    >
                                        {props.cancelButtonText ?? 'Cancel'}
                                    </Button>
                                }
                                <Button
                                    variant="contained"
                                    color={props.color ?? 'primary'}
                                    onClick={() => {
                                        props.onConfirm?.();
                                        props.onClose?.();
                                    }}
                                >
                                    {props.buttonText ?? 'Confirm'}
                                </Button>
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
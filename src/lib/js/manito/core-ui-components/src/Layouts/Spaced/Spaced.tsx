import {
    Stack as MuiStack,
} from '@mui/material';
import { ReactNode } from 'react';


type Props = {
    children: ReactNode,
    gap?: number,
}

export function Spaced({children, gap}: Props) {
    return (
        <MuiStack
            direction="row"
            justifyContent="space-between"
            gap={gap ?? 1}
        >
            {children}
        </MuiStack>
    );
}
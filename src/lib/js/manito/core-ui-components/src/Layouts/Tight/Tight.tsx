import {
    Stack as MuiStack,
} from '@mui/material';
import { ReactNode } from 'react';


type Props = {
    children: ReactNode,
    gap?: number
}

export function Tight({children, gap}: Props) {
    return (
        <MuiStack direction="row" gap={gap ?? 1}>
            {children}
        </MuiStack>
    );
}
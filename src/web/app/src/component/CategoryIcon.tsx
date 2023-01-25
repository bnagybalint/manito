import {
    Stack,
    Typography,
} from '@mui/material';


type Props = {
    color?: string,
    text?: string,
    imageUrl?: string,
    size?: number
}


export default function CategoryIcon(props: Props) {
    const iconColor = props.color ?? "#888888";
    const iconMargin = 5;
    const iconSize = props.size ?? 24;
    const circleSize = iconSize + 2 * iconMargin;
    return (
        <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }} gap={1}>
            <div
                style={{
                    width: circleSize,
                    height: circleSize,
                    backgroundColor: iconColor,
                    borderRadius: "50%",
                    overflow: "hidden",
                    alignItems: "center",
                }}
            >
                {props.imageUrl && <img
                    src={ props.imageUrl ?? ''}
                    alt={ props.text ?? '' }
                    style={{
                        width: iconSize,
                        height: iconSize,
                        margin: iconMargin,
                        display: "inline",
                        filter: "invert(100%)"
                    }}
                    />}
            </div>
            <Typography noWrap>{props.text}</Typography>
        </Stack>
    )
}
import {
    Card,
    CardContent,
    Fab,
    Stack,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MergeIcon from '@mui/icons-material/Merge';

import CategoryList from 'component/CategoryList';
import { selectAllCategories, useCategoryStore } from 'stores/category';


export default function SettingsPage() {
    const categories = useCategoryStore(selectAllCategories);

    return (
        <Stack gap={1} paddingTop={1}>
            <Card>
                <CardContent>
                    <Stack gap={1}>
                        <Typography fontWeight="bold">Categories</Typography>
                        <Stack direction="row" gap={1}>
                            <Fab
                                size="medium"
                                color="primary"
                                variant="extended"
                                aria-label="add"
                            >
                                <AddIcon />
                                New category
                            </Fab>
                            <Fab
                                size="medium"
                                color="error"
                                variant="extended"
                                aria-label="delete"
                                disabled={true}
                            >
                                <DeleteIcon />
                                Delete categories
                            </Fab>
                            <Fab
                                size="medium"
                                color="info"
                                variant="extended"
                                aria-label="delete"
                                disabled={true}
                            >
                                <MergeIcon />
                                Merge categories
                            </Fab>
                        </Stack>
                        <CategoryList categories={categories}/>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}

import { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Fab,
    Stack,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MergeIcon from '@mui/icons-material/Merge';

import Category from 'entity/Category';
import CategoryList from 'component/CategoryList';
import { useCategoryStore } from 'stores/category';
import { useUserStore } from 'stores/user';


export default function SettingsPage() {
    const [categoryListSelectionModel, setCategoryListSelectionModel] = useState(new Set<Category>())

    const currentUser = useUserStore((state) => state.loginUser);
    const categories = useCategoryStore((state) => state.categories);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);

    useEffect(() => {
        fetchCategories(currentUser!.id);
    });

    return (
        <Stack gap={1} paddingTop={1}>
            <Card>
                <CardContent>
                    <Stack gap={1}>
                        <Typography fontWeight="bold">Categories</Typography>
                        <Stack direction="row" gap={1}>
                            <Fab
                                size="medium"
                                color="green"
                                variant="extended"
                                aria-label="add"
                            >
                                <AddIcon />
                                New
                            </Fab>
                            {categoryListSelectionModel.size >= 0 &&
                                <Fab
                                    size="medium"
                                    color="red"
                                    variant="extended"
                                    aria-label="delete"

                                    disabled={categoryListSelectionModel.size < 1}
                                >
                                    <DeleteIcon />
                                    Delete{categoryListSelectionModel.size ? ` (${categoryListSelectionModel.size})` : ''}
                                </Fab>
                            }
                            {categoryListSelectionModel.size >= 0 &&
                                <Fab
                                    size="medium"
                                    color="blue"
                                    variant="extended"
                                    aria-label="delete"

                                    disabled={categoryListSelectionModel.size < 2}
                                >
                                    <MergeIcon />
                                    Merge{categoryListSelectionModel.size ? ` (${categoryListSelectionModel.size})` : ''}
                                </Fab>
                            }
                        </Stack>
                        <Typography paddingTop={2} fontWeight="bold">Active categories</Typography>
                        <Box paddingTop={0}>
                            <CategoryList
                                categories={categories}
                                selectionModel={categoryListSelectionModel}
                                onSelectionModelChange={(model) => setCategoryListSelectionModel(model)}
                                />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
}

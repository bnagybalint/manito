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
import ConfirmDialog from 'component/ConfirmDialog';
import CategoryDialog from 'component/CategoryDialog';


export default function SettingsPage() {
    const [categoryListSelectionModel, setCategoryListSelectionModel] = useState(new Set<Category>())
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
    const [isCreateEditDialogOpen, setIsCreateEditDialogOpen] = useState(false);

    const currentUser = useUserStore((state) => state.loginUser);
    const categories = useCategoryStore((state) => state.categories);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);
    const deleteCategory = useCategoryStore((state) => state.deleteCategory);
    const addCategory = useCategoryStore((state) => state.addCategory);
    
    useEffect(() => {
        fetchCategories(currentUser!.id);
    });

    const handleDeleteCategoriesClicked = () => {
        setIsDeleteConfirmDialogOpen(true);
    }

    const handleDeleteCategoriesConfirmed = () => {
        categoryListSelectionModel.forEach((t) => {
            deleteCategory(t);
        })
        setCategoryListSelectionModel(new Set());
    }

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
                                onClick={() => setIsCreateEditDialogOpen(true)}
                            >
                                <AddIcon />
                                New
                            </Fab>
                            {categoryListSelectionModel.size >= 0 &&
                                <Fab
                                    size="medium"
                                    color="red"
                                    variant="extended"
                                    onClick={handleDeleteCategoriesClicked}
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
            <ConfirmDialog
                open={isDeleteConfirmDialogOpen}
                title="Confirm delete?"
                message="Are you sure you want to delete the selected categories?"
                color="red"
                onClose={() => setIsDeleteConfirmDialogOpen(false)}
                onConfirm={handleDeleteCategoriesConfirmed}
            />
            <CategoryDialog
                open={isCreateEditDialogOpen}
                onClose={() => setIsCreateEditDialogOpen(false)}
                onSubmit={(category) => addCategory(category)}
            />
        </Stack>
    );
}

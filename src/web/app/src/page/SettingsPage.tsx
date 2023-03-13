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
import EditIcon from '@mui/icons-material/Edit';
import MergeIcon from '@mui/icons-material/Merge';

import Category from 'entity/Category';
import { useCategoryStore } from 'stores/category';
import { useUserStore } from 'stores/user';
import CategoryList from 'component/CategoryList';
import ConfirmDialog from 'component/ConfirmDialog';
import CategoryCreateEditDialog from 'component/CategoryCreateEditDialog';


export default function SettingsPage() {
    const [categorySelectionModel, setCategorySelectionModel] = useState(new Set<number>())
    const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editedCategory, setEditedCategory] = useState<Category | null>(null);

    const currentUser = useUserStore((state) => state.loginUser);
    const categories = useCategoryStore((state) => state.categories);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);
    const deleteCategoryById = useCategoryStore((state) => state.deleteCategoryById);
    const addCategory = useCategoryStore((state) => state.addCategory);
    const updateCategory = useCategoryStore((state) => state.updateCategory);
    
    useEffect(() => {
        fetchCategories(currentUser!.id);
    });

    const handleCreateCategoryClicked = () => {
        setIsCategoryDialogOpen(true);
    }

    const handleEditCategorysClicked = () => {
        const categoryId = Array.from(categorySelectionModel.values())[0];
        const category = categories.find((c) => c.id === categoryId);
        setEditedCategory(category!);
        setIsCategoryDialogOpen(true);
    }

    const handleCreateEditCategoryClosed = () => {
        setIsCategoryDialogOpen(false);
        setEditedCategory(null);
    }

    const handleMergeCategoriesClicked = () => {
        // TODO implement
    }

    const handleDeleteCategoriesClicked = () => {
        setIsDeleteConfirmDialogOpen(true);
    }

    const handleDeleteCategoriesConfirmed = () => {
        categorySelectionModel.forEach((t) => {
            deleteCategoryById(t);
        })
        setCategorySelectionModel(new Set());
    }

    return (
        <Stack direction="column" gap={1} paddingTop={1}>
            <Card>
                <CardContent>
                    <Stack direction="column" gap={1}>
                        <Typography fontWeight="bold">Categories</Typography>
                        <Stack direction="row" gap={1}>
                            <Fab
                                size="medium"
                                color="green"
                                variant="extended"
                                onClick={handleCreateCategoryClicked}
                            >
                                <AddIcon />
                                New
                            </Fab>
                            {categorySelectionModel.size > 0 &&
                                <Fab
                                    size="medium"
                                    color="blue"
                                    variant="extended"
                                    onClick={handleEditCategorysClicked}
                                    disabled={categorySelectionModel.size > 1}
                                >
                                    <EditIcon />
                                    Edit
                                </Fab>
                            }
                            {categorySelectionModel.size > 0 &&
                                <Fab
                                    size="medium"
                                    color="red"
                                    variant="extended"
                                    onClick={handleDeleteCategoriesClicked}
                                    disabled={categorySelectionModel.size < 1}
                                >
                                    <DeleteIcon />
                                    Delete{categorySelectionModel.size ? ` (${categorySelectionModel.size})` : ''}
                                </Fab>
                            }
                            {categorySelectionModel.size > 0 &&
                                <Fab
                                    size="medium"
                                    color="blue"
                                    variant="extended"
                                    onClick={handleMergeCategoriesClicked}
                                    disabled={categorySelectionModel.size < 1}
                                >
                                    <MergeIcon />
                                    Merge{categorySelectionModel.size ? ` (${categorySelectionModel.size})` : ''}
                                </Fab>
                            }
                        </Stack>
                        <Typography paddingTop={2} fontWeight="bold">Active categories</Typography>
                        <Box paddingTop={0}>
                            <CategoryList
                                categories={categories}
                                selectionModel={categorySelectionModel}
                                onSelectionModelChange={(model) => setCategorySelectionModel(model)}
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
            <CategoryCreateEditDialog
                open={isCategoryDialogOpen}
                category={editedCategory ?? undefined}
                onClose={handleCreateEditCategoryClosed}
                onCreate={(category) => addCategory(category)}
                onEdit={(category) => updateCategory(category)}
            />
        </Stack>
    );
}

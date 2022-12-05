import create from 'zustand';
import produce from 'immer';

import ApiClient from 'api_client/ApiClient'
import Category from 'entity/Category'


interface State {
    categories: Category[];

    loaded: boolean;
    error: string | null;
}

interface Actions {
    fetchCategories: (userId: number) => void;
    addCategory: (category: Category) => void;
    deleteCategoryById: (categoryId: number) => void;
    updateCategory: (category: Category) => void;
}

export type CategoryState = State & Actions;

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    loaded: false,
    error: null,

    fetchCategories: (userId: number) => {
        const state = get();
        if(state.loaded || state.error) {
            // already loaded
            return;
        }

        const client = new ApiClient();
        client.getCategories(userId)
            .then((cs) => cs.map((c) => new Category(c)))
            .then((categories) => set({
                categories: categories,
                loaded: true
            }))
            .catch((error: Error) => set({error: error.message}));
    },

    addCategory: (category: Category)  => {
        const client = new ApiClient();
        client.createCategory(category)
            .then((c) => new Category(c))
            .then((newCategory) => set({
                categories: [...get().categories, newCategory],
            }))
            .catch((error: Error) => set({error: error.message}));
    },

    deleteCategoryById: (categoryId: number)  => {
        const client = new ApiClient();
        client.deleteCategory(categoryId)
            .then(() => set({
                categories: get().categories.filter((c: Category) => c.id !== categoryId)
            }))
            .catch((error: Error) => set({error: error.message}));
    },

    updateCategory: (category: Category) => {
        const client = new ApiClient();
        client.updateCategory(category)
            .then((c) => new Category(c))
            .then((updatedCategory) => set(
                produce((state) => {
                    const idx = state.categories.findIndex((c: Category) => c.id === category.id);
                    state.categories.splice(idx, 1, updatedCategory);
                })
            ))
    },
}));

export const selectAllCategories = (state: CategoryState) => state.categories;
export const selectCategoryById = (state: CategoryState) => (id: number) => state.categories.find((c) => c.id === id);

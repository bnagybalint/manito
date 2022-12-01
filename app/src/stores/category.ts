import create from 'zustand';

import ApiClient from 'api_client/ApiClient'
import Category from 'entity/Category'


interface State {
    categories: Category[];

    loaded: boolean;
    error: string | null;
}

interface Actions {
    fetchCategories: (userId: number) => void;
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
}));

export const selectAllCategories = (state: CategoryState) => state.categories;

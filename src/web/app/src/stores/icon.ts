import create from 'zustand';

import ApiClient from 'api_client/ApiClient'
import Icon from 'entity/Icon'


interface State {
    icons: Icon[];

    loaded: boolean;
    error: string | null;
}

interface Actions {
    fetchIcons: () => void;
}

export type IconState = State & Actions;

export const useIconStore = create<IconState>((set, get) => ({
    icons: [],
    loaded: false,
    error: null,

    fetchIcons: () => {
        const state = get();
        if(state.loaded || state.error) {
            // already loaded
            return;
        }

        const client = new ApiClient();
        client.getIcons()
            .then((icons) => icons.map((x) => new Icon(x)))
            .then((icons) => set({
                icons: icons,
                loaded: true
            }))
            .catch((error: Error) => set({error: error.message}));
    },
}));

export const selectAllIcons = (state: IconState) => state.icons;
export const selectAllIconsById = (state: IconState) => new Map(state.icons.map((x) => ([x.id, x])));
export const selectIconById = (iconId: number) => (state: IconState) => state.icons.find((icon) => icon.id === iconId)

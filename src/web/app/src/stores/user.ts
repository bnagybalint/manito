import create from 'zustand'

import User from 'entity/User'


interface State {
    loginUser: User | null;
}

interface Actions {
    doLogin: (username: string, cred: string) => void;
}

export type UserState = State & Actions;

export const useUserStore = create<UserState>((set) => ({
    loginUser: null,
    
    doLogin: (username: string, cred: string) => {
        // faking login
        // TODO add proper logon with authentication
        const fake: User = {
            id: 159,
            name: 'Jakab',
        };

        set((state: State) => ({loginUser: fake}));
    },
}));

export const selectCurrentUser = (state: UserState) => state.loginUser;

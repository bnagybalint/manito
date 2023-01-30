import create from 'zustand'

import User from 'entity/User'
import ApiClient from 'api_client/ApiClient'
import { LoginResponseModel } from 'api_client/model/LoginResponse';


interface State {
    loginUser: User | null;
    jwt: string | null,
}

interface Actions {
    loginWithUserAndPassword: (username: string, cred: string) => void;
    loginWithGoogle: (jwt: string) => Promise<void>;
}

export type UserState = State & Actions;

export const useUserStore = create<UserState>((set) => ({
    loginUser: null,
    jwt: null,
    
    loginWithUserAndPassword: (username: string, cred: string) => {
        // faking login
        // TODO add proper logon with authentication
        const fake: User = {
            id: 159,
            name: 'Jakab',
        };

        set((state: State) => ({loginUser: fake}));
    },

    loginWithGoogle: (jwt: string) => {
        const client = new ApiClient();
        const p = client.loginWithGoogle(jwt)
            .then((loginResponse: LoginResponseModel) => {
                set((state: State) => ({
                    loginUser: loginResponse.user,
                    jwt: loginResponse.jwt,
                }));
            });
        return p;
    },
}));

export const selectCurrentUser = (state: UserState) => state.loginUser;

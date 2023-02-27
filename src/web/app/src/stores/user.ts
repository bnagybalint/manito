import create from 'zustand'

import User from 'entity/User'
import ApiClient from 'api_client/ApiClient'
import { LoginResponseModel } from 'api_client/model/LoginResponse';


interface State {
    loginUser: User | null;
    jwt: string | null,
}

interface Actions {
    loginWithUserAndPassword: (username: string, cred: string) => Promise<void>;
    loginWithGoogle: (jwt: string) => Promise<void>;
}

export type UserState = State & Actions;

export const useUserStore = create<UserState>((set) => ({
    loginUser: null,
    jwt: null,
    
    loginWithUserAndPassword: (username: string, password: string) => {
        const client = new ApiClient();
        const p = client.loginWithPassword(username, password)
            .then((loginResponse: LoginResponseModel) => {
                set((state: State) => ({
                    loginUser: loginResponse.user,
                    jwt: loginResponse.jwt,
                }));
            });
        return p;
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

import create from 'zustand'

import ApiClient from 'api_client/ApiClient'
import Wallet from 'entity/Wallet'


interface State {
    wallets: Wallet[];
    currentWallet: Wallet | null;

    loaded: boolean;
    error: string | null;
}

interface Actions {
    fetchWallets: (userId: number) => void;
    setCurrentWallet: (wallet: Wallet) => void;
}

export type WalletState = State & Actions;

export const useWalletStore = create<WalletState>((set) => ({
    wallets: [],
    currentWallet: null,
    loaded: false,
    error: null,

    fetchWallets: (userId: number) => {
        const client = new ApiClient();
        client.getWallets(userId)
            .then((wallets) => set({wallets: wallets, currentWallet: wallets ? wallets[0] : null, loaded: true}))
            .catch((error: Error) => set({error: error.message}));
    },
    setCurrentWallet: (wallet: Wallet) => set({currentWallet: wallet}),
}));

export const selectAllWallets = (state: WalletState) => state.wallets;
export const selectCurrentWallet = (state: WalletState) => state.currentWallet;
export const selectWalletsLoaded = (state: WalletState) => state.loaded;

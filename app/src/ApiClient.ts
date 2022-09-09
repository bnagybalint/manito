import Wallet from 'entity/Wallet';

export default class ApiClient {
    async getWallets(userId: number): Promise<Wallet[]> {
        return fetch(`/user/${userId}/wallets`)
            .then((res) => res.json())
    }
}
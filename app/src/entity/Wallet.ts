export default interface Wallet {
    id: number;
    name: string;
    ownerId: number;
    createdAt: Date;
    deletedAt?: Date;
}

export class Category {
    id: number;
    createdAt: Date;
    name: string;
    iconUrl: string;

    constructor(
        id: number,
        createdAt: Date,
        name: string,
        iconUrl: string,
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.name = name;
        this.iconUrl = iconUrl;
    }
}

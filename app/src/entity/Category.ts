import ICategory from 'api_client/model/ICategory'

export default class Category {
    id: number;
    createdAt: Date;
    name: string;
    iconUrl: string;

    constructor({id, createdAt, name, iconUrl}: ICategory) {
        this.id = id;
        this.createdAt = createdAt;
        this.name = name;
        this.iconUrl = iconUrl;
    }
}
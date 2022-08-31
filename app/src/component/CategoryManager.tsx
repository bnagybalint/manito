import React from 'react';

import { Category } from 'entity';

import './CategoryManager.css';


type CategoryEditorLineProps = {
    category: Category,
};

type CategoryEditorLineState = {};

class CategoryEditorLine extends React.Component<CategoryEditorLineProps, CategoryEditorLineState> {
    render() {
        return (
            <tr className="category-row">
                <td className="category-select"><input type="checkbox"/></td>
                <td className="category-icon">
                    <img alt={this.props.category.name} src={this.props.category.iconUrl}></img>
                </td>
                <td className="category-name">{this.props.category.name}</td>
                <td className="category-manip-edit"><button className="greenbutton"></button></td>
                <td className="category-manip-delete"><button className="redbutton"></button></td>
            </tr>
        );
    }
}

type CategoryManagerProps = {};

type CategoryManagerState = {
    categories: Category[];
};

export class CategoryManager extends React.Component<CategoryManagerProps, CategoryManagerState> {
    constructor(props: CategoryManagerProps) {
        super(props);

        this.state = {
            categories: [
                new Category(1000, new Date(), "Income", "https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png"),
                new Category(1001, new Date(), "Expense", "https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png"),
                new Category(1002, new Date(), "Transfer", "https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png"),
            ]
        }
    }

    render() {
        return (
            <div className="block category-manager">
                <h1 className="block-title">Categories</h1>
                <div className="">
                    <button className="airy greenbutton">+ Add category</button>
                    <button className="airy bluebutton">+ Merge categories</button>
                    <button className="airy redbutton">Delete categories</button>
                </div>
                <table className="category-table">
                    {this.state.categories.map(category =>
                        <CategoryEditorLine category={category} />
                    )}
                </table>
            </div>
        );
    }
}

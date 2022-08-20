import React from 'react';

import './CategoryManager.css'

class CategoryEditorLine extends React.Component {
    render() {
        return (
            <tr class="category-row">
                <td class="category-select"><input type="checkbox"/></td>
                <td class="category-icon">
                    <img alt={this.props.categoryName} src={this.props.iconUrl}></img>
                </td>
                <td class="category-name">{this.props.categoryName}</td>
                <td class="category-manip-edit"><button class="greenbutton"></button></td>
                <td class="category-manip-delete"><button class="redbutton"></button></td>
            </tr>
        );
    }
}

class CategoryManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: ["Income", "Expense", "Transfer"]
        }
      }

    render() {
        return (
            <div class="block category-manager">
                <h1 class="block-title">{this.props.title ?? "Categories"}</h1>
                <div class="">
                    <button class="airy greenbutton">+ Add category</button>
                    <button class="airy bluebutton">+ Merge categories</button>
                    <button class="airy redbutton">Delete categories</button>
                </div>
                <table class="category-table">
                    {this.state.categories.map(x =>
                        <CategoryEditorLine
                            categoryName={x} 
                            iconUrl="https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png"
                        />
                    )}
                </table>
            </div>
        );
    }
}

export default CategoryManager;
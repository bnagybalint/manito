import React from 'react';

import './TransactionViewer.css'

class TransactionEditLine extends  React.Component {
    render() {
        return (
            <tr class="transaction-row">
                <td class="transaction-cell">2021-01-02 19:35:19</td>
                <td class="transaction-cell">CATEGORY</td>
                <td class="transaction-cell">SPAR nagybevasarlas</td>
                <td class="transaction-cell">-20.352</td>
                <td class="transaction-cell"><button class="button">E</button></td>
                <td class="transaction-cell"><button class="button">X</button></td>
            </tr>
        )
    }
}

class TransactionViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [
                {
                    id: 1,
                    time: Date(),
                    category: "Income",
                    note: "SPAR bevasarlas",
                    amount: -20345
                },
                {
                    id: 1,
                    time: Date(),
                    category: "Income",
                    note: "SPAR bevasarlas",
                    amount: -20345
                }
            ]
        }
    }
    
    render() {
        return (
            <div class="transaction-viewer">
                <div class="transaction-search"></div>
                <table class="transaction-table">
                    {/* <tr>
                        <td class="transaction-header">Time</td>
                        <td class="transaction-header">Category</td>
                        <td class="transaction-header">Note</td>
                        <td class="transaction-header">Amount</td>
                    </tr> */}
                    {this.state.transactions.map(x =>
                        <TransactionEditLine transaction={x}/>
                    )}
                </table>
            </div>
        );
    }
}

export default TransactionViewer;
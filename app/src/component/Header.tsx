import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css'


type Props = {};

type State = {};

export class Header extends React.Component<Props, State> {
    render() {
        return (
            <Link to="/" className="no-underline">
                <div className="block">
                    <h1 className="header-title">MANITO - The Wolf of Wallet Street</h1>
                </div>
            </Link>
        );
    }
}

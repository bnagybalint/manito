import React from 'react';
import { Link } from 'react-router-dom';


type Props = {};

type State = {};

export class Header extends React.Component<Props, State> {
    render() {
        return (
            <div className="block">
                <h1>MANITO - The Wolf of Wallet Street</h1>
                <Link to='/wallet'>Wallets</Link> |{" "}
                <Link to='/settings'>Settings</Link>
            </div>
        );
    }
}

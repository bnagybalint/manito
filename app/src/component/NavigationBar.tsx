import React from 'react';
import { Link } from 'react-router-dom';


type Props = {};

type State = {};

export default class NavigationBar extends React.Component<Props, State> {
    render() {
        return (
            <div className="block">
                <Link to='/wallet'>Wallets</Link> |{" "}
                <Link to='/settings'>Settings</Link>
            </div>
        );
    }
}

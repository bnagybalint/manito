import React from 'react';

import './Footer.css'


type Props = {};

type State = {};

export default class Footer extends React.Component<Props, State> {
    render() {
        return (
            <div className="footer">
                <p>Manito © 2022</p>
                <p>App version: 0.1</p>
            </div>
        );
    }
}

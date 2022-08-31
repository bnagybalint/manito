import React from 'react';

import './Footer.css';


type Props = {};

type State = {
    apiVersion: string,
    currentTime: Date,
    timerId: number | null,
};

export class Footer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            apiVersion: "0.1",
            currentTime: new Date(),
            timerId: null,
        }
    }


    componentDidMount() {
        this.setState({
            timerId: window.setInterval(() => this.tick(), 1000)
        });
    }

    componentWillUnmount() {
        window.clearInterval(this.state.timerId!);
        this.setState({
            timerId: null,
        });
    }

    tick() {
        this.setState({
            currentTime: new Date()
        });
    }

    render() {
        return (
            <div>
                <p>Manito</p>
                <p>App version: 0.1</p>
                <p>API version: {this.state.apiVersion}</p>
                <p>Current UTC time: {this.state.currentTime.toUTCString()}</p>
                <p>© 2022 Balint Nagy</p>
            </div>
        );
    }
}

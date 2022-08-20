import React from 'react';

import './Footer.css'

class Footer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            api_version: "0.1",
            current_time: new Date()
        }
    }


    componentDidMount() {
        this.timer_id = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer_id);
    }

    tick() {
        this.setState({
            current_time: new Date()
        });
    }

    render() {
        return (
            <div>
                <p>Manito</p>
                <p>App version: 0.1</p>
                <p>API version: {this.state.api_version}</p>
                <p>Current UTC time: {this.state.current_time.toUTCString()}</p>
                <p>© 2022 Balint Nagy</p>
            </div>
        );
    }
}

export default Footer;
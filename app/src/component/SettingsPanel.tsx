import React from 'react';

import CategoryList from 'component/CategoryList';


type Props = {};

type State = {};

export default class SettingsPanel extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <p className="page-title">Settings</p>
                <CategoryList /> 
            </div>
        );
    }
}

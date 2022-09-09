import React from 'react';

import { CategoryManager } from 'component/CategoryManager';


type Props = {};

type State = {};

export class SettingsPanel extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <p className="page-title">Settings</p>
                <CategoryManager /> 
            </div>
        );
    }
}

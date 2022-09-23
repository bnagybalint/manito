import React from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    TextField,
    Stack,
} from '@mui/material'

import './LoginPanel.css'


type Props = {};

type State = {};

export default class LoginPanel extends React.Component<Props, State> {
    render() {
        return (
            <div className="block">
                <div className="login-form">
                    <h1 className="login-title">Login to Manito</h1>
                    <p className="login-subtitle">In case you don't have an account, <Link to="/signup">Sign Up here!</Link></p>
                    <Stack direction="column" justifyContent="center" spacing={1}>
                        <TextField
                            id="username"
                            label="E-mail"
                            required
                            variant="standard"
                            />
                        <TextField
                            id="password"
                            label="Password"
                            required    
                            type="password"
                            autoComplete="current-password"
                            variant="standard"
                        />

                        <Button variant="contained" type="button" color="primary">Log in</Button>
                    </Stack>
                </div>
            </div>
        );
    }
}

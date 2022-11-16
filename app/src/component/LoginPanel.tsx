import React from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    TextField,
    Stack,
} from '@mui/material'

import { useUserStore } from 'stores/user';

import './LoginPanel.css'


export default function LoginPanel() {

    const doLogin = useUserStore((state) => state.doLogin);

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

                    <Button
                        variant="contained"
                        type="button"
                        color="primary"
                        onClick={(e) => doLogin("dummy", "dummy")}
                    >
                        Log in
                    </Button>
                </Stack>
            </div>
        </div>
    );
}

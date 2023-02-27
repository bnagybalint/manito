import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { GoogleLogin } from '@react-oauth/google';

import { useUserStore } from 'stores/user';

export default function LoginPage() {

    const loginWithUserAndPassword = useUserStore((state) => state.loginWithUserAndPassword);
    const loginWithGoogle = useUserStore((state) => state.loginWithGoogle);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleGoogleLogin = (jwt: string) => {
        loginWithGoogle(jwt)
            .catch((error: Error) => {
                setLoginError("Login failed!");
            });
    };

    const handlePasswordLogin = () => {
        loginWithUserAndPassword(username, password)
            .catch((error: Error) => {
                setLoginError("Login failed!");
            });
    };

    const handleLoginError = () => {
        setLoginError("Gogle authentication failed!");
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setLoginError(null);
      };

    return (
        <Container maxWidth="sm">
            <Stack gap={1} paddingTop={1}>
                <Card>
                    <CardContent>
                        <Typography align="center" variant="h4">Login</Typography>
                        <Typography align="center">In case you don't have an account, <Link to="/signup">sign up here!</Link></Typography>
                        <Stack
                            margin="auto"
                            direction="column"
                            justifyContent="center"
                            spacing={1}
                            sx={{
                                display: "flex",
                                alignContent: "center",
                                width: 300,
                            }}
                        >
                            <TextField
                                id="username"
                                label="E-mail"
                                required
                                variant="standard"
                                value={username}
                                onChange={(e) => {setUsername(e.target.value)}}
                                />
                            <TextField
                                id="password"
                                label="Password"
                                required    
                                type="password"
                                autoComplete="current-password"
                                variant="standard"
                                value={password}
                                onChange={(e) => {setPassword(e.target.value)}}
                            />

                            <Button
                                variant="contained"
                                type="button"
                                color="primary"
                                sx={{width: "100%"}}
                                onClick={(e) => handlePasswordLogin()}
                            >
                                Log in
                            </Button>
                            <Typography align="center" padding={1}>
                                Or login using one of the following:
                            </Typography>
                            <GoogleLogin
                                auto_select
                                useOneTap
                                width="300"
                                text="continue_with"
                                onSuccess={response => handleGoogleLogin(response.credential!)}
                                onError={handleLoginError}
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
            <Snackbar
                open={loginError != null}
                autoHideDuration={3500}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {loginError}
                </Alert>
            </Snackbar>
        </Container>
    );
}

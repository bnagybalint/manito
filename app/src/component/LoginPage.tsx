import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography,
} from '@mui/material'

import { useUserStore } from 'stores/user';


export default function LoginPage() {

    const doLogin = useUserStore((state) => state.doLogin);

    return (
        <Container maxWidth="sm">
            <Stack gap={1} paddingTop={1}>
                <Card>
                    <CardContent>
                        <Typography align="center" variant="h4">Login</Typography>
                        <Typography align="center">In case you don't have an account, <Link to="/signup">sign up here!</Link></Typography>
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
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
}

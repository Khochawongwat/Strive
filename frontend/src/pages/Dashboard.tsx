import { Button, CssBaseline, Grid, Paper, ThemeProvider } from '@mui/material';
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { firebaseAuth, signOut } from '../services/auth.service';
import defaultTheme from '../theme';
import NavAppBar from '../components/features/NavAppBar';
import { User } from '@firebase/auth';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState("");

    useEffect(() => {
        const handleAuthStateChanged = async (user: User | null) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    console.log("User found via Firebase");
                    setToken(token)
                } catch (error: any) {
                    console.error('Error getting user token:', error.message);
                }
            } else {
                console.log("No user signed in.");
            }
            setSuccess(true)
            setLoading(false)
        };

        const unsubscribe = firebaseAuth.onAuthStateChanged(handleAuthStateChanged);

        return () => {
            unsubscribe()
        };

    }, [token]);


    const shouldRedirect = token.length === 0 && success && !loading

    if (shouldRedirect) {
        console.log("Leaving");
        return <Navigate to="/auth" />;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            {!loading && <>
                <NavAppBar />
                <Button onClick={async () => console.log(await firebaseAuth.currentUser)}>
                    Get User
                </Button>
                <Button onClick={async () => {
                    const response = await signOut()
                    if (response) {
                        setToken('')
                    }
                }}>
                    Log out
                </Button>
                <Grid container component={Paper} square sx={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    userSelect: 'none',
                }}>
                    <CssBaseline />

                    We're here!
                </Grid>
            </>}
        </ThemeProvider>
    )
}

export default DashboardPage
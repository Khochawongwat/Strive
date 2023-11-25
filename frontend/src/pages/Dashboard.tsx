import { Button, CssBaseline, Grid, Paper, ThemeProvider } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { firebaseAuth } from '../services/auth.service';
import { AUTH_ENDPOINTS } from '../utils/Endpoints';
import defaultTheme from '../theme';
import NavAppBar from '../components/features/NavAppBar';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    const [sessionState, setSessionState] = useState({
        firebaseToken: '',
        sessionToken: '',
        verified: false,
    });

    useEffect(() => {
        firebaseAuth.onAuthStateChanged(async function (user) {
            if (user) {
                const token = await user.getIdToken();
                setSessionState((prevState) => ({
                    ...prevState,
                    firebaseToken: token
                }));
                console.log("User found.")
            } else {
                console.log("No user signed in.");
            }
            setLoading(false)
        });
    }, [])

    useEffect(() => {
        const fetchSession = async () => {
            if (!loading && sessionState.firebaseToken.length > 0) {
                setLoading(true)
                try {
                    const response = await axios.get(AUTH_ENDPOINTS.retrieveSession)
                    const session = response.data.session;
                    console.log('Verifying sessions')
                    if (session === sessionState.firebaseToken) {
                        console.log("Session found.")
                        setSessionState((prevState) => ({
                            ...prevState,
                            sessionToken: session,
                            verified: true,
                        }));
                    } else {
                        console.error("Session is not the same. Please login again.")
                    }
                } catch (error: any) {
                    console.error('Error retrieving session:', error.message);
                }
                setSuccess(true)
                setLoading(false)
            }
        };
        fetchSession();
    }, [sessionState.firebaseToken]);

    if (!sessionState.verified && !loading && success) {
        return <Navigate to="/auth" />
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <NavAppBar/>
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
        </ThemeProvider>
    )
}

export default DashboardPage
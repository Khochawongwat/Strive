import { Box, CssBaseline, Paper, ThemeProvider } from '@mui/material';
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { firebaseAuth } from '../../services/auth.service';
import { defaultTheme } from '../../theme';
import NavAppBar from '../../components/features/NavAppBar';
import TasksBoard from '../../components/features/TaskBoard/TaskBoard';
import { User } from '@firebase/auth';
import PomoBoard from '../../components/features/Pomodoro/PomoBoard';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState("");
    const [timer, setTimer] = useState(0)
    const [timerIsRunning, setTimerIsRunning] = useState(false)
    
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

    const shouldRedirect = token.length === 0 && success && !loading;

    if (shouldRedirect) {
        console.log("Leaving");
        return <Navigate to="/auth" />;
    }

    if (loading) {
        return <>Loading</>;
    }

    return ( 
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    userSelect: 'none'
                }}
            >
                <NavAppBar  timer = {timer} setTimer= {setTimer} timerIsRunning = {timerIsRunning} setTimerIsRunning= {setTimerIsRunning}/>
                <Paper
                    component={Box}
                    square
                    sx={{
                        flexGrow: 1, 
                        overflowY: 'scroll',
                        px: '12.5%',
                        pt: '6.25%'
                    }}
                >      
                    <PomoBoard/>
                    <TasksBoard />
                </Paper>
            </Box>
        </ThemeProvider>
    );
}

export default DashboardPage;

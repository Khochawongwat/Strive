import { Box, Paper } from '@mui/material';
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { firebaseAuth } from '../../services/auth.service';
import NavAppBar from '../../components/features/NavAppBar';
import TasksBoard from '../../components/features/TaskBoard/TaskBoard';
import { User } from '@firebase/auth';
import Timer from '../../schema/Timer.schema';
import PomoBoard from '../../components/features/Pomodoro/PomoBoard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState("");
    const [timer, setTimer] = useState<Timer>(new Timer())
    const [time, setTime] = useState(timer.time)
    const [isRunning, setIsRunning] = useState(timer.timerIsRunning)
    const [isSessionDone, setIsSessionDone] = useState(false)

    const [status, setStatus] = useState(timer.status)

    useEffect(() => {
        const savedTimer = localStorage.getItem("timer");
        if (savedTimer) {
            try {
                const parsedTimer = JSON.parse(savedTimer);
                const timerInstance = new Timer();

                timerInstance.time = parsedTimer.time;
                timerInstance.timerIsRunning = parsedTimer.timerIsRunning;
                timerInstance.isPomo = parsedTimer.isPomo;
                timerInstance.status = parsedTimer.status;
                timerInstance.autoStart = parsedTimer.autoStart;
                timerInstance.completedShorts = parsedTimer.completedShorts;
                timerInstance.shortsNeeded = parsedTimer.shortsNeeded;
                timerInstance.completedLoops = parsedTimer.completedLoops;
                timerInstance.loopsNeeded = parsedTimer.loopsNeeded;
                setTimer(timerInstance);
            } catch (error) {
                console.error("Error parsing timer from localStorage:", error);
            }
        }
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(timer.time);
            setIsRunning(timer.timerIsRunning)
            setStatus(timer.status)
            setIsSessionDone(timer.isSessionDone())
            localStorage.setItem("timer", JSON.stringify(timer))
        }, 250);

        return () => {
            clearInterval(intervalId);
        };
    }, [timer.time, timer.timerIsRunning, timer]);

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
        <DndProvider backend={HTML5Backend}>
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    userSelect: 'none'
                }}
            >
                <NavAppBar timer={timer} timeStates={{ time: time, running: isRunning }} />
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
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
                        <PomoBoard timer={timer} timeStates={{ time: time, running: isRunning, status: status, done: isSessionDone }} />
                    </Box>
                    <TasksBoard />
                </Paper>
            </Box>
        </DndProvider>

    );
}

export default DashboardPage;

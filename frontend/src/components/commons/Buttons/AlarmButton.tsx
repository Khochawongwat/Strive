import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, InputAdornment } from '@mui/material';
import { grey } from "@mui/material/colors";
import { Timer, MoreHorizOutlined, Close, PlayArrowOutlined, TimerOutlined, ReplayOutlined, EventNoteOutlined, Pause, NoteOutlined } from "@mui/icons-material";
import AlarmSettingsDialog from "../Dialogs/AlarmSettingsDialog";
import TaskListsDialog from "../Dialogs/TaskListsDialog";
import { myPalette } from "../../../theme";
import { formatTime } from "../../../utils/helper";

interface AlarmState {
    openAlarm: boolean;
    openSettings: boolean;
    openTasks: boolean;
}

interface Props {
    timer: number;
    setTimer: React.Dispatch<React.SetStateAction<number>>;
    timerIsRunning: boolean;
    setTimerIsRunning: (state: boolean) => void;
}

const AlarmButton: React.FC<Props> = ({ timer, setTimer, timerIsRunning, setTimerIsRunning }) => {
    const [_, setAnchorEl] = useState<null | HTMLElement>(null);
    const [alarmState, setAlarmState] = useState<AlarmState>({
        openAlarm: false,
        openSettings: false,
        openTasks: false,
    });
    const [timerId, setTimerId] = useState<any>()
    const [shake, setShake] = useState(false);

    useEffect(() => {
        const storedTimer = localStorage.getItem("timer");
        if (storedTimer && storedTimer.length > 0) {
            setTimer(Number(storedTimer));
        }
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setAlarmState({
            ...alarmState,
            openAlarm: true
        });
    };

    const openSettings = () => {
        setAlarmState({
            ...alarmState,
            openSettings: true,
        });
    };

    const closeTasks = () => {
        setAlarmState({
            ...alarmState,
            openTasks: false,
        });
    };


    useEffect(() => {
        let shakeInterval: string | number | NodeJS.Timeout | undefined;

        if (timerIsRunning) {
            shakeInterval = setInterval(() => {
                setShake(true);
                setTimeout(() => {
                    setShake(false);
                }, 250);
            }, 3000);
        }

        return () => clearInterval(shakeInterval);
    }, [timerIsRunning]);

    const closeSettings = () => {
        setAlarmState({
            ...alarmState,
            openSettings: false,
        });
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAlarmState({
            ...alarmState,
            openAlarm: false
        });
    };

    const handleTimer = () => {
        if (timerIsRunning) {
            setTimerIsRunning(false);
            clearInterval(timerId);
        } else {
            setTimerIsRunning(true);
            const newTimerId = setInterval(() => {
                setTimer((prevTimer) => {
                    localStorage.setItem('timer', JSON.stringify(prevTimer + 1));
                    return prevTimer + 1
                });
            }, 1000);
            setTimerId(newTimerId);
        }
    };

    const resetTimer = () => {
        if (timer && timer > 0) {
            setTimer(() => {
                return 0
            })
            localStorage.setItem('timer', JSON.stringify(0))
        }
    }

    return (
        <>
            {alarmState.openAlarm ? (
                <Box
                    aria-haspopup="true"
                    sx={{
                        display: 'flex',
                        borderRadius: 2,
                        justifyContent: 'start',
                        width: 'fit-content',
                        background: grey[800],
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Box sx={{
                            px: '8px',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '.75rem'
                        }}>
                            <TimerOutlined color={"primary"} />
                            <Typography color={grey[400]}>{formatTime(timer)}</Typography>
                        </Box>
                        <IconButton color={"primary"} onClick={resetTimer}><ReplayOutlined /></IconButton>
                        <IconButton color={"primary"} onClick={handleTimer}>{timerIsRunning ? <Pause /> : <PlayArrowOutlined />}</IconButton>
                        <IconButton color={"primary"} onClick={openSettings}><MoreHorizOutlined /></IconButton>
                    </Box>
                    <IconButton disableRipple color={"primary"} onClick={handleClose}><Close /></IconButton>
                    <TaskListsDialog handleClose={closeTasks} open={alarmState.openTasks} />
                    <AlarmSettingsDialog handleClose={closeSettings} open={alarmState.openSettings} />
                </Box>
            ) : (
                <IconButton
                    disableRipple
                    aria-haspopup="true"
                    onClick={handleClick}
                    sx={{
                        color: timerIsRunning ? myPalette[400] : "",
                        borderRadius: 2,
                        justifyContent: "center",
                        width: "fit-content",
                        animation: shake ? "shake 0.5s" : "",
                        "&:hover": {
                            animation: "none",
                        },
                        "@keyframes shake": {
                            "10%, 90%": {
                                transform: "translate3d(-1px, 0, 0)",
                            },
                            "20%, 80%": {
                                transform: "translate3d(1px, 0, 0)",
                            },
                            "30%, 50%, 70%": {
                                transform: "translate3d(-2px, 0, 0)",
                            },
                            "40%, 60%": {
                                transform: "translate3d(2px, 0, 0)",
                            },
                        },
                    }}
                >
                    <Timer />
                </IconButton>
            )}
        </>
    );
};

export default AlarmButton;

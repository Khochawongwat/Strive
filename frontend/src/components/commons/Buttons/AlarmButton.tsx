import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from '@mui/material';
import { grey } from "@mui/material/colors";
import { TimerOutlined, ReplayOutlined, PlayArrowOutlined, Pause, MoreHorizOutlined, Close } from "@mui/icons-material";
import AlarmSettingsDialog from "../Dialogs/AlarmSettingsDialog";
import TaskListsDialog from "../Dialogs/TaskListsDialog";
import { myPalette } from "../../../theme";
import { formatTime } from "../../../utils/helper";
import TimerClass from "../../../schema/Timer.schema";

interface AlarmState {
    openAlarm: boolean;
    openSettings: boolean;
    openTasks: boolean;
}

interface Props {
    timer: TimerClass;
    timeStates: {
        time: number
        running: boolean
      } 
}

const AlarmButton: React.FC<Props> = ({ timer, timeStates}) => {
    const [_, setAnchorEl] = useState<null | HTMLElement>(null);
    const [alarmState, setAlarmState] = useState<AlarmState>({
        openAlarm: false,
        openSettings: false,
        openTasks: false,
    });
    const [shake, setShake] = useState(false);

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
        if (timeStates.running) {
            shakeInterval = setInterval(() => {
                setShake(true);
                setTimeout(() => {
                    setShake(false);
                }, 250);
            }, 3000);
        }

        return () => clearInterval(shakeInterval);
    }, [timeStates.running]);

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

    const startTimer = () => {
        timer.start();
    };

    const resetTimer = () => {
        timer.reset();
    };

    const pauseTimer = () => {
        timer.pause();
    };

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
                            <Typography color={grey[400]}>{formatTime(timeStates.time)}</Typography>
                        </Box>
                        <IconButton color={"primary"} onClick={resetTimer}><ReplayOutlined /></IconButton>
                        <IconButton color={"primary"} onClick={timeStates.running ? pauseTimer : startTimer}>{timeStates.running ? <Pause /> : <PlayArrowOutlined />}</IconButton>
                        <IconButton color={"primary"} onClick={openSettings}><MoreHorizOutlined /></IconButton>
                    </Box>
                    <IconButton disableRipple color={"primary"} onClick={handleClose}><Close /></IconButton>
                    <TaskListsDialog handleClose={closeTasks} open={alarmState.openTasks} />
                    <AlarmSettingsDialog timer = {timer} handleClose={closeSettings} open={alarmState.openSettings} />
                </Box>
            ) : (
                <IconButton
                    disableRipple
                    aria-haspopup="true"
                    onClick={handleClick}
                    sx={{
                        color: timeStates.running ? myPalette[400] : "",
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
                    <TimerOutlined />
                </IconButton>
            )}
        </>
    );
};

export default AlarmButton;

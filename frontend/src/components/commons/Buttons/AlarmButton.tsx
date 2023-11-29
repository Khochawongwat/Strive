import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Timer, MoreHorizOutlined, Close, PlayArrowOutlined, TimerOutlined, ReplayOutlined, EventNoteOutlined } from "@mui/icons-material";
import AlarmSettingsDialog from "../Dialogs/AlarmSettingsDialog";
import TaskListsDialog from "../Dialogs/TaskListsDialog";

interface AlarmState {
    openAlarm: boolean;
    openSettings: boolean;
    openTasks: boolean;
}

const AlarmButton = () => {
    const [_, setAnchorEl] = useState<null | HTMLElement>(null);
    const [alarmState, setAlarmState] = useState<AlarmState>({
        openAlarm: false,
        openSettings: false,
        openTasks: false,
    });

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setAlarmState({
            ...alarmState,
            openAlarm: true
        })
    }

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
        })
    }
    const openTasks = () => {
        setAlarmState({
            ...alarmState,
            openTasks: true
        })
    }
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
                            <Typography color={grey[400]}>00:00:00</Typography>
                        </Box>
                        <IconButton color={"primary"}><ReplayOutlined /></IconButton>
                        <IconButton color={"primary"}><PlayArrowOutlined /></IconButton>
                        <IconButton color={"primary"} onClick={openTasks}><EventNoteOutlined /></IconButton>
                        <IconButton color={"primary"} onClick={openSettings}><MoreHorizOutlined /></IconButton>
                    </Box>
                    <IconButton disableRipple color={"primary"} onClick={handleClose}><Close /></IconButton>
                    <TaskListsDialog handleClose={closeTasks} open= {alarmState.openTasks}/>
                    <AlarmSettingsDialog handleClose={closeSettings} open={alarmState.openSettings}/>
                </Box>
            ) : (
                <IconButton
                    disableRipple
                    aria-haspopup="true"
                    onClick={handleClick}
                    sx={{
                        borderRadius: 2,
                        justifyContent: 'center',
                        width: 'fit-content',
                    }}
                >
                    <Timer />
                </IconButton>
            )}
        </>
    );
};

export default AlarmButton;

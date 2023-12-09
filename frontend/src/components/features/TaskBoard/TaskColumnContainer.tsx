import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button, IconButton, CircularProgress, Alert, Snackbar, SnackbarOrigin } from "@mui/material";
import { TaskClass } from "../../../schema/Task.schema";
import TaskItem from "./TaskItem";
import { myPalette } from '../../../theme';
import { AddOutlined, DeleteOutline, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import TaskCreationDialog from "../../commons/Dialogs/TaskCreationDialog";
import axios from 'axios';
import { TASKS_ENDPOINTS } from '../../../utils/endpoints';
import { getAuth } from '@firebase/auth';
import { firebaseApp } from '../../../apps/firebase.app';

interface Props {
    id: string;
    maxHeight?: number | string;
    handleAddTask: (newTask: TaskClass) => void;
    hidden: boolean;
    handleHiddenStates: (preStatus: number) => void;
    title: string;
    list: TaskClass[];
    preStatus: number;
    updateDeletedTaskLists: (status: number) => void
    handleUpdatedTask: (newTask: TaskClass, prevTask: TaskClass) => void
    loading: boolean
}

interface DialogStates {
    taskCreationDialog: boolean;
    settingsDialog: boolean;

}
interface State extends SnackbarOrigin {
    open: boolean
    message: String
}

const TaskColumnContainer: React.FC<Props> = ({handleUpdatedTask, loading, updateDeletedTaskLists, list, title, handleAddTask, preStatus, hidden, handleHiddenStates, id, maxHeight }) => {
    const [dialogStates, setDialogStates] = useState<DialogStates>({
        taskCreationDialog: false,
        settingsDialog: false,
    });
    const [snackState, setSnackState] = useState<State>({
        open: false,
        message: "",
        vertical: 'top',
        horizontal: 'center',
    }
    )
    const { vertical, horizontal, open, message } = snackState
    const [deleting, setDeleting] = useState(false)

    const handleOpenSnack = (message: String) => {
        setSnackState({ ...snackState, open: true, message: message })
    }

    const handleCloseSnack = () => {
        setSnackState({ ...snackState, open: false })
    }

    const handleCloseDialog = (dialogName: keyof DialogStates) => {
        setDialogStates((prevStates) => ({
            ...prevStates,
            [dialogName]: false,
        }));
    };

    const handleOpenDialog = (dialogName: keyof DialogStates) => {
        setDialogStates((prevStates) => ({
            ...prevStates,
            [dialogName]: true,
        }));
    };

    const handleDeleteByColumn = async () => {
        const user = getAuth(firebaseApp).currentUser

        if (!user || deleting || list.length === 0) {
            if (list.length === 0) {
                handleOpenSnack("Error: It's already empty!")
            } else {
                handleOpenSnack("Error: Something went wrong with your user token!")
            }
            return
        }

        const uid = user.uid

        try {
            setDeleting(true)
            await axios.delete(TASKS_ENDPOINTS.tasks, {
                data: {
                    author: uid,
                    status: preStatus
                }
            });
            updateDeletedTaskLists(preStatus)
            handleOpenSnack(`Successfully cleared all tasks!`)
        } catch (error) {
            handleOpenSnack(`Error: ` + error)
        }
        setDeleting(false)
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3} sx={{ opacity: hidden ? 0.6 : 1 }}>
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleCloseSnack}
                key={vertical + horizontal}
            >
                <Alert onClose={handleCloseSnack} severity={message.includes("Error") ? "error" : 'success'}>
                    {message}
                </Alert>
            </Snackbar>
            <Paper id={id} sx={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'space-between', height: hidden ? 'fit-content' : maxHeight, bgcolor: myPalette[950], p: '8px' }}>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', pb: 2, flexDirection: 'row', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                            <Typography fontSize="12px" color={myPalette[975]} fontWeight="700">{title.toUpperCase()}</Typography>
                            <Typography fontSize="12px" color={myPalette[925]}>{hidden || loading ? '-' : list.length}</Typography>
                        </Box>
                        <Box>
                            <IconButton sx={{ p: 0, mr: 1 }} disableRipple onClick={handleDeleteByColumn}>
                                {
                                    deleting ? <CircularProgress sx={{ color: myPalette[925] }} style={{ width: '16px', height: '16px' }} /> : <DeleteOutline sx={{ color: myPalette[925], fontSize: '18px' }} />
                                }
                            </IconButton>
                            <IconButton sx={{ p: 0 }} disableRipple onClick={() => handleHiddenStates(preStatus)}>
                                {
                                    hidden ? <VisibilityOffOutlined sx={{ color: myPalette[925], fontSize: '18px' }} /> : <VisibilityOutlined sx={{ color: myPalette[925], fontSize: '18px' }} />
                                }
                            </IconButton>
                        </Box>
                    </Box>
                    {loading ? (
                        <Box sx = {{display: 'flex', justifyContent:'center', height: '6rem', alignItems: 'center'}}>
                            {!hidden && <CircularProgress style={{width: '2.5rem', height: '2.5rem', opacity: '.5'}}/>}
                        </Box>) : (!hidden && list.map((task, index) => (
                            <TaskItem handleUpdatedTask = {handleUpdatedTask} key={index} task={task} />
                        )))}
                    {!hidden && <Button onClick={() => handleOpenDialog('taskCreationDialog')} sx={{ background: myPalette[400], color: myPalette[50], alignItems: 'center', py: '0px' }}>
                        <AddOutlined />
                    </Button>}
                </Box>

            </Paper>
            <TaskCreationDialog open={dialogStates.taskCreationDialog} handleClose={() => handleCloseDialog('taskCreationDialog')} preStatus={preStatus} updateTaskLists={handleAddTask} />
        </Grid>
    )
}

export default TaskColumnContainer;

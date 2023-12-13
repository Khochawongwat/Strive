import { Alert, Box, Card, CircularProgress, Snackbar, SnackbarOrigin, Typography } from "@mui/material";
import { myPalette } from '../../../theme';
import { CheckCircleOutline, DragIndicatorOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import TaskInfoDialog from "../../commons/Dialogs/TaskInfoDialog";
import { useSpring, animated } from 'react-spring';
import { Task, TaskClass } from "../../../schema/Task.schema";
import TaskTagsComponent from "./TaskTagsComponent";
import axios from "axios";
import { TASKS_ENDPOINTS } from "../../../utils/endpoints";
import { useDrag } from "react-dnd";
interface Props {
    task: TaskClass;
}
interface State extends SnackbarOrigin {
    openSnack: boolean
    message: String
}


const TaskItem: React.FC<Props> = ({ task}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [progress, setProgress] = useState(0)
    const [subtasks, setSubtasks] = useState<TaskClass[]>([])
    const [snackState, setSnackState] = useState<State>({
        openSnack: false,
        message: "",
        vertical: 'top',
        horizontal: 'center',
    })
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK_ITEM',
        item: { task: task, preStatus: task.status },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });
    const { vertical, horizontal, openSnack, message } = snackState

    const handleSnackOpen = (message: String) => {
        setSnackState({ ...snackState, openSnack: true, message: message })
    }

    const handleSnackClose = () => {
        setSnackState({ ...snackState, openSnack: false, message: '' })
    }

    const handleUpdateSubtask = async (taskId: string, subtaskId: string, updatedSubtask: Task) => {
        try {
            const response = await axios.put(
                `${TASKS_ENDPOINTS.tasks}/${taskId}/${subtaskId}`,
                updatedSubtask
            );
            console.log("Subtask updated successfully:", response.data);
            return response.data as Task
        } catch (error) {
            throw Error("Error updatig subtask: " + error)
        }
    };

    const handleDoubleClick = () => {
        handleOpenDialog();
    };

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const slideAnimation = useSpring({
        transform: dialogOpen ? 'translateY(-12.5%)' : 'translateY(0%)',
    });

    useEffect(() => {
        if (task.subtasks) {
            setSubtasks(task.subtasks)
        }
    }, [])

    useEffect(() => {
        if (subtasks && subtasks.length > 0) {
            const completedSubtasks = subtasks.filter((subtask) => subtask.status === 3);
            const completionPercentage = (completedSubtasks.length / subtasks.length) * 100;
            setProgress(completionPercentage);
        } else {
            setProgress(0);
        }
    }, [subtasks]);

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <Box>
                <Snackbar
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical, horizontal }}
                    open={openSnack}
                    onClose={handleSnackClose}
                    key={vertical + horizontal}
                >
                    <Alert onClose={handleSnackClose} severity={message.includes("Error") ? "error" : 'success'}>
                        {message}
                    </Alert>
                </Snackbar>
                <animated.div style={slideAnimation}>
                    <Card
                        onDoubleClick={handleDoubleClick}
                        sx={{
                            border: `1px solid ${dialogOpen ? myPalette[50] : 'transparent'}`,
                            my: 1,
                            borderRadius: '4px',
                            background: myPalette[952],
                            py: '12px',
                            pl: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            cursor: 'pointer'
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            mr: '4px',

                        }}>
                            <Typography
                                fontSize="12px"
                                color={myPalette[50]}
                                fontWeight="500"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 5,
                                    minHeight: '3em',
                                    maxHeight: '6em',
                                    wordWrap: 'break-word'
                                }}
                            >
                                {task.description}
                            </Typography>
                            <DragIndicatorOutlined sx={{ fontSize: '18px', color: myPalette[975] }} />
                        </Box>
                        <TaskTagsComponent tags={task.tags} />
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {progress === 100 ? <CheckCircleOutline color={progress === 100 ? "success" : "primary"} /> : <CircularProgress style={{ width: '24px', height: '24px' }} value={progress} variant="determinate" color={progress === 100 ? "success" : "primary"} />}
                            {subtasks.length > 0 && <Typography sx={{ fontSize: '12px' }}>{`${subtasks.filter((subtask) => subtask.status === 3).length}/${subtasks.length}`}</Typography>}
                        </Box>
                        <TaskInfoDialog handleSnackOpen={handleSnackOpen} setSubtasks={setSubtasks} subtasks={subtasks} handleUpdateSubtask={handleUpdateSubtask} handleClose={handleCloseDialog} open={dialogOpen} task={task} />
                    </Card>
                </animated.div>
            </Box>
        </div>
    );
};

export default TaskItem;
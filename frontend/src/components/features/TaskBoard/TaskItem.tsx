import { Alert, Box, Card, CircularProgress, LinearProgress, Snackbar, SnackbarOrigin, Typography } from "@mui/material";
import { myPalette, priorityPalette } from '../../../theme';
import { ArrowBackIosNew, CheckCircleOutline, CompareArrowsOutlined, DragIndicatorOutlined, KeyboardArrowDown, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined, KeyboardDoubleArrowDownOutlined, KeyboardDoubleArrowUpOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import TaskInfoDialog from "../../commons/Dialogs/TaskInfoDialog";
import { useSpring, animated } from 'react-spring';
import { Task, TaskClass } from "../../../schema/Task.schema";
import axios from "axios";
import { TASKS_ENDPOINTS } from "../../../utils/endpoints";
import { useDrag } from "react-dnd";
interface Props {
    task: TaskClass;
    setAnItemIsDragging: (isDragging: boolean) => void
}
interface State extends SnackbarOrigin {
    openSnack: boolean
    message: String
}


const TaskItem: React.FC<Props> = ({ task, setAnItemIsDragging}) => {
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
        item: {
            task: {
                ...task,
                subtasks: subtasks
            }, preStatus: task.status
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });
    useEffect(() => {
        setAnItemIsDragging(isDragging)
    }, [isDragging])
    const { vertical, horizontal, openSnack, message } = snackState

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 0:
                return priorityPalette[0]; // color for priority 0
            case 1:
                return priorityPalette[1];
            case 2:
                return priorityPalette[2];
            case 3:
                return priorityPalette[3];
            case 4:
                return priorityPalette[4];
            default:
                return myPalette[952]; // default color
        }
    }

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
    const getPriorityIcon = (priority: number) => {
        switch (priority) {
            case 0:
                return <KeyboardDoubleArrowDownOutlined sx={{ color: getPriorityColor(priority) }} />;
            case 1:
                return <KeyboardArrowDownOutlined sx={{ color: getPriorityColor(priority) }} />;
            case 2:
                return <Box sx={{ color: getPriorityColor(priority) }} />;
            case 3:
                return <KeyboardArrowUpOutlined sx={{ color: getPriorityColor(priority) }} />;
            case 4:
                return <KeyboardDoubleArrowUpOutlined sx={{ color: getPriorityColor(priority) }} />;
            default:
                return <KeyboardDoubleArrowDownOutlined sx={{ color: getPriorityColor(priority) }} />;
        }
    }
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
                        <Box sx={{ display: 'flex', gap: 1, pr: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1 }}>
                                {task.subtasks && task.subtasks.length > 0 && <CircularProgress
                                    style={{ width: '24px', height: '24px', position: 'absolute' }}
                                    value={progress}
                                    variant="determinate"
                                    sx={{
                                        color:"success"
                                    }}
                                />}
                            </Box>
                            {getPriorityIcon(task.priority)}
                        </Box>
                        <TaskInfoDialog handleSnackOpen={handleSnackOpen} setSubtasks={setSubtasks} subtasks={subtasks} handleUpdateSubtask={handleUpdateSubtask} handleClose={handleCloseDialog} open={dialogOpen} task={task} />
                    </Card>
                </animated.div>
            </Box>
        </div>
    );
};

export default TaskItem;
import { Alert, Box, Card, CircularProgress, Snackbar, SnackbarOrigin, Typography } from "@mui/material";
import { myPalette, priorityPalette } from '../../../theme';
import { DragIndicatorOutlined, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined, KeyboardDoubleArrowDownOutlined, KeyboardDoubleArrowUpOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import TaskInfoDialog from "../../commons/Dialogs/TaskInfoDialog";
import { useSpring, animated } from 'react-spring';
import { TaskClass } from "../../../schema/Task.schema";
import axios from "axios";
import { TASKS_ENDPOINTS } from "../../../utils/endpoints";
import { useDrag } from "react-dnd";
import TaskTagsComponent from "./TaskTagsComponent";
import { formatTime } from "../../../utils/helper";
interface Props {
    task: TaskClass;
    setAnItemIsDragging: (isDragging: boolean) => void
}
interface State extends SnackbarOrigin {
    openSnack: boolean
    message: String
}


const TaskItem: React.FC<Props> = ({ task, setAnItemIsDragging }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [progress, setProgress] = useState(0)
    const [subtasks, setSubtasks] = useState<TaskClass[]>([])
    const [snackState, setSnackState] = useState<State>({
        openSnack: false,
        message: "",
        vertical: 'top',
        horizontal: 'center',
    })
    const [countdown, setCountdown] = useState<number>(Date.now() / 1000);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown + 1);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

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

    const handleUpdateSubtask = async (taskId: string, subtaskId: string, updatedSubtask: TaskClass) => {
        try {
            const response = await axios.put(
                `${TASKS_ENDPOINTS.tasks}/${taskId}/${subtaskId}`,
                updatedSubtask
            );
            console.log("Subtask updated successfully:", response.data);
            return response.data
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

    const handleDateTime = (datetime: Date | string) => {
        const countDownFormat = (seconds: number) => {
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
        
            let timeString = '';
            if (days > 0) {
                timeString += days > 1 ? `${days} days` : `${days} day`;
            }
            if (hours > 0) {
                if (timeString) timeString += ', ';
                timeString += hours > 1 ? `${hours} hours` : `${hours} hour`;
            }
            if (minutes > 0) {
                if (timeString) timeString += ' and ';
                timeString += minutes > 1 ? `${minutes} minutes` : `${minutes} minute`;
            }
            return timeString;
        };

        if (typeof datetime === 'string') {
            datetime = new Date(datetime);
        }
        const remainingTime = datetime.getTime() / 1000 - countdown;
        if (remainingTime > 0 && remainingTime <= 48 * 60 * 60 * 1000) {
            const remainingTimeInSeconds = Math.floor(remainingTime);
            return 'Due in ' + countDownFormat(remainingTimeInSeconds);
        }
        return `${task.status === 3 ? 'Finished' : 'Due'} ${countDownFormat(Math.floor(Math.abs(remainingTime)))} ago`;
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
                        <TaskTagsComponent tags={task.tags} />
                        <Box sx={{ display: 'flex', gap: 1, pr: 2, alignItems: 'center', justifyContent: 'space-between' }}>
                            {task.subtasks && task.subtasks.length > 0 && <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 1 }}>
                                <CircularProgress
                                    style={{ width: '24px', height: '24px', position: 'absolute' }}
                                    value={progress}
                                    variant="determinate"
                                    sx={{
                                        color: "success"
                                    }}
                                />
                            </Box>}
                            <Typography color={myPalette[50]} fontSize="12px">
                                {task.dueDate && handleDateTime(task.dueDate)}
                            </Typography>
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
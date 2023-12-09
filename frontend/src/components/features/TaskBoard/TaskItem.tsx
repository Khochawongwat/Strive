import { Box, Card, CircularProgress, Typography } from "@mui/material";
import { myPalette } from '../../../theme';
import { CheckCircleOutline, DragIndicatorOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import TaskInfoDialog from "../../commons/Dialogs/TaskInfoDialog";
import { useSpring, animated } from 'react-spring';
import { Task, TaskClass } from "../../../schema/Task.schema";
import TaskTagsComponent from "./TaskTagsComponent";
import axios from "axios";
import { TASKS_ENDPOINTS } from "../../../utils/endpoints";

interface Props {
    task: TaskClass;
    handleUpdatedTask: (newTask: TaskClass, prevTask: TaskClass) => void
}

const TaskItem: React.FC<Props> = ({ task, handleUpdatedTask }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [progress, setProgress] = useState(0)
    const [subtasks, setSubtasks] = useState<TaskClass[]>([])

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
                {progress === 100 ? <CheckCircleOutline color={progress === 100 ? "success" : "primary"}/> : <CircularProgress style = {{width: '24px', height: '24px'}} value={progress} variant="determinate" color={progress === 100 ? "success" : "primary"}/> }
                <TaskInfoDialog setSubtasks={setSubtasks} subtasks={subtasks} handleUpdateSubtask={handleUpdateSubtask} handleUpdatedTask={handleUpdatedTask} handleClose={handleCloseDialog} open={dialogOpen} task={task} />
            </Card>
        </animated.div>
    );
};

export default TaskItem;
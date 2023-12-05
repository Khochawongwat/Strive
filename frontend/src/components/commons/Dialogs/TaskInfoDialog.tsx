import { CloseOutlined, AutoAwesomeMosaicOutlined, CheckBoxOutlined } from "@mui/icons-material";
import { Dialog, DialogTitle, IconButton, DialogContent, Box, Button, Typography, LinearProgress, TextField, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Task, TaskClass } from "../../../schema/Task.schema";
import { useEffect, useState } from "react";
import { myPalette } from "../../../theme";
import axios from "axios";
import { TASKS_ENDPOINTS } from "../../../utils/endpoints";

interface Props {
    handleClose: () => void;
    open: boolean;
    task: TaskClass;
}

const TaskInfoDialog: React.FC<Props> = ({ handleClose, open, task }) => {
    const [showSubtasks, setShowSubtasks] = useState(task.subtasks && task.subtasks.length > 0 ? true : false)
    const [subtasks, setSubtasks] = useState<TaskClass[]>([])
    const [creatingTask, setCreatingTask] = useState(false)
    const [subtaskInput, setSubtaskInput] = useState("");
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (task.subtasks) {
            setSubtasks(task.subtasks)
        }
    }, [])

    const handleOpenSubtasksCreation = () => {
        setShowSubtasks(true)
    }

    const addSubtask = async () => {
        console.log("Adding subtask:", subtaskInput);
        const subtask = {
            description: subtaskInput,
            priority: 0,
            status: 0,
            parent: task._id
        } as Task
        const response = await axios.post(TASKS_ENDPOINTS.tasks + `/${task._id}`, {
            subtask
        })
        console.log(response)
        setSubtaskInput("");
    };

    useEffect(() => {
        console.log(subtasks)
        if (subtasks.length > 0) {
            const completedSubtasks = subtasks.filter((subtask) => subtask.status === 3);
            const completionPercentage = (completedSubtasks.length / subtasks.length) * 100;
            setProgress(completionPercentage);
        } else {
            setProgress(0);
        }
    }, [subtasks]);

    return (
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth maxWidth="sm">
            <Box sx={{ display: 'flex', alignItems: 'center', mx: '12px', justifyContent: 'space-between', userSelect: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AutoAwesomeMosaicOutlined />
                    <DialogTitle>
                        {task.description}
                    </DialogTitle>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    disableRipple
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseOutlined />
                </IconButton>
            </Box>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {!showSubtasks && <Button onClick={handleOpenSubtasksCreation}>
                        Create Subtasks
                    </Button>}
                </Box>
                {showSubtasks && (
                    <Box sx={{ userSelect: 'none', display: 'flex', height: 'fit-content', p: '12px', gap: 3, flexDirection: 'column', background: myPalette[951], borderRadius: '6px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', color: myPalette[975], gap: 2 }}>
                                <CheckBoxOutlined />
                                <Typography sx={{ fontWeight: '500' }}>Subtask Lists</Typography>
                            </Box>
                            <Button onClick={() => setShowSubtasks(false)} sx={{ bgcolor: myPalette[952], color: myPalette[50] }}>
                                Delete
                            </Button>
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ minWidth: 35, ml: 1 }}>
                                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                                        progress,
                                    )}%`}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress variant="determinate" color={progress === 1 ? 'success' : 'primary'} value={progress} style={{ height: '6px', borderRadius: '6px'}}></LinearProgress>
                                </Box>
                            </Box>
                        </Box>
                        <FormGroup>
                            {subtasks.map((value: any, index) => {
                                const subtask = value.subtask as Task
                                return (
                                    <FormControlLabel key={index} control={
                                    <Checkbox
                                        defaultChecked={subtask.status === 3}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            const updatedSubtasks = [...subtasks];
                                            const subtask = updatedSubtasks[index] as Task
                                            subtask.status = isChecked ? 3 : 0;
                                            setSubtasks(updatedSubtasks);
                                            console.log(subtask.status)
                                        }}
                                    />} label={subtask.description} />
                                )
                            })}
                        </FormGroup>
                        {creatingTask ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    placeholder="Add an item"
                                    value={subtaskInput}
                                    onChange={(e) => setSubtaskInput(e.target.value)}
                                />
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Button sx={{ bgcolor: myPalette[400], color: myPalette[50] }} onClick={addSubtask}>
                                        Add
                                    </Button>
                                    <Button disableRipple sx={{ color: myPalette[975] }} onClick={() => setCreatingTask(false)}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        )
                            :
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Button onClick={() => setCreatingTask(true)} sx={{ bgcolor: myPalette[400], color: myPalette[50] }}>
                                    Add an item
                                </Button>
                            </Box>}
                    </Box>)}
            </DialogContent>
        </Dialog>
    );
}

export default TaskInfoDialog;
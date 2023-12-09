import { CloseOutlined, AutoAwesomeMosaicOutlined, CheckBoxOutlined, Delete } from "@mui/icons-material";
import { Dialog, DialogTitle, IconButton, DialogContent, Box, Button, Typography, LinearProgress, TextField, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Task, TaskClass } from "../../../schema/Task.schema";
import { useEffect, useState } from "react";
import { myPalette } from "../../../theme";
import axios from "axios";
import { TASKS_ENDPOINTS } from '../../../utils/endpoints';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Props {
    handleClose: () => void;
    open: boolean;
    task: TaskClass;
    handleUpdatedTask: (newTask: TaskClass, prevTask: TaskClass) => void
    handleUpdateSubtask: (taskId: string, subtaskId: string, updatedTask: Task) => Promise<Task>;
    subtasks: TaskClass[];
    setSubtasks: (subtasks: TaskClass[]) => void
    handleSnackOpen: (message: string) => void
}

const validationSchema = Yup.object({
    subtaskInput: Yup.string().required('A description is needed').min(1, "Description must not be less than 1 character long"),
});

const TaskInfoDialog: React.FC<Props> = ({ handleSnackOpen, handleClose, open, task, subtasks, setSubtasks, handleUpdateSubtask }) => {
    const [showSubtasks, setShowSubtasks] = useState(task.subtasks && task.subtasks.length > 0 ? true : false)
    const [creatingTask, setCreatingTask] = useState(false)
    const [progress, setProgress] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (task.subtasks) {
            setSubtasks(task.subtasks)
        }
    }, [])

    useEffect(() => {
        if (subtasks.length > 0) {
            const completedSubtasks = subtasks.filter((subtask) => subtask.status === 3);
            const completionPercentage = (completedSubtasks.length / subtasks.length) * 100;
            setProgress(completionPercentage);
        } else {
            setProgress(0);
        }
    }, [subtasks]);

    const formik = useFormik({
        initialValues: {
            subtaskInput: ''
        },

        validationSchema: validationSchema,

        onSubmit: async (values) => {
            return values
        },
    });

    const handleOpenSubtasksCreation = () => {
        setShowSubtasks(true)
    }

    const handleDeleteAllSubtasks = async () => {
        if (!loading) {
            setLoading(true)
            try {
                await axios.delete(`${TASKS_ENDPOINTS.tasks}/${task._id}/all-subtasks`)
                setSubtasks([])
                setShowSubtasks(false)
                handleSnackOpen("Successfully deleted all subtasks")
            } catch (error) {
                console.error("Error deleting subtasks:", error);
                handleSnackOpen("Error deleting subtasks: " + error)
            }
            setLoading(false)
        } else {
            handleSnackOpen("Error: Please wait for the previous task to be finished!")
        }
    }

    const handleDeleteSubtask = async (subtask: TaskClass) => {
        if (!loading) {
            setLoading(true)
            try {
                await axios.delete(`${TASKS_ENDPOINTS.tasks}/${task._id}/${subtask._id}`);
                setSubtasks(subtasks.filter((prevSubtask) => prevSubtask._id !== subtask._id));
                handleSnackOpen(`Successfully deleted subtask {${(subtask.description as string).slice(0, 6)}....}`)
            } catch (error) {
                console.error("Error deleting subtask:", error);
                handleSnackOpen("Error deleting subtask: " + error)
            }
            setLoading(false)
        } else {
            handleSnackOpen("Error: Please wait for the previous task to be finished!")
        }
    };

    const addSubtask = async () => {
        if (!loading) {
            setLoading(true)
            try {
                const subtask = {
                    description: formik.values['subtaskInput'],
                    priority: 0,
                    status: 0,
                    parent: task._id
                } as Task

                const response = await axios.post(TASKS_ENDPOINTS.tasks + `/${task._id}`,
                    subtask
                )

                handleSnackOpen(`Successfully added a subtask {${(subtask.description as string).slice(0, 6)}....}`)
                setSubtasks(response.data.subtasks)
                formik.resetForm()
            } catch (error) {
                console.error("Error deleting subtask:", error);
            }
            setLoading(false)
        } else {
            handleSnackOpen("Error: Please wait for the previous task to be finished!")
        }
    };

    const handleCheckSubtask = async (index: number, e: any) => {
        if (!loading) {
            setLoading(true)
            try {
                const isChecked = e.target.checked;
                const updatedSubtasks = [...subtasks];
                const subtaskToUpdate = updatedSubtasks[index] as Task;
                await handleUpdateSubtask(task._id, subtaskToUpdate._id, {
                    ...subtaskToUpdate,
                    status: isChecked ? 3 : 0,
                });
                subtaskToUpdate.status = isChecked ? 3 : 0;
                setSubtasks(updatedSubtasks);
            } catch (error) {
                handleSnackOpen("Error: " + error)
            }
            setLoading(false)
        } else {
            handleSnackOpen("Error: Please wait for the previous task to be finished!")
        }
    }

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
                            <Button onClick={handleDeleteAllSubtasks} sx={{ bgcolor: myPalette[952], color: myPalette[50] }}>
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
                                    <LinearProgress variant="determinate" color={progress === 1 ? 'success' : 'primary'} value={progress} style={{ height: '6px', borderRadius: '6px' }}></LinearProgress>
                                </Box>
                            </Box>
                        </Box>
                        <FormGroup>
                            {subtasks.map((subtask: Task, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                disableRipple
                                                checked={subtask.status === 3}
                                                onChange={async (e) => {
                                                    await handleCheckSubtask(index, e)
                                                }}
                                            />
                                        }
                                        label={subtask.description}
                                    />
                                    <IconButton
                                        disableRipple
                                        onClick={async () => {
                                            try {
                                                await handleDeleteSubtask(new TaskClass(subtask));
                                                const updatedSubtasks = subtasks.filter((_, i) => i !== index);
                                                setSubtasks(updatedSubtasks);
                                            } catch (error) {
                                                console.error(error)
                                            }
                                        }
                                        }
                                    >
                                        <Delete sx={{ color: myPalette[952] }} />
                                    </IconButton>
                                </div>
                            ))}
                        </FormGroup>
                        {creatingTask ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    placeholder="Add an item"
                                    name = "subtaskInput"
                                    value={formik.values['subtaskInput']}
                                    onChange={formik.handleChange}
                                />
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Button sx={{ bgcolor: myPalette[400], color: myPalette[50] }} disabled = {Object.keys(formik.errors).length > 0 || formik.values['subtaskInput'].length === 0} onClick={addSubtask}>
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

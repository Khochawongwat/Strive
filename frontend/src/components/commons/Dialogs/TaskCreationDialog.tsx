import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    IconButton,
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Chip,
    Typography,
    CircularProgress,
} from '@mui/material';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { TaskStatusSteps } from '../Steps/TaskStatusSteps';
import { myPalette } from '../../../theme';
import { AutoAwesomeOutlined, CheckCircleOutline } from '@mui/icons-material';
import axios from 'axios';
import { TASKS_ENDPOINTS } from '../../../utils/endpoints';
import { firebaseApp } from '../../../apps/firebase.app';
import { getAuth } from '@firebase/auth';
import { green } from '@mui/material/colors';
import { TaskClass } from '../../../schema/Task.schema';
import { Tag, tags } from '../../../schema/Tag.schema';
import { MAX_TAGS_PER_TASK, MAX_WORDS_PER_TASK } from '../../../configs/app.config';
const validationSchema = Yup.object({
    description: Yup.string()
        .test('word-limit', 'Description should not exceed 100 words.', (value) => {
            if (!value) {
                return false
            }

            const wordCount = value.trim().split(/\s+/).length;
            return wordCount <= MAX_WORDS_PER_TASK;
        }),
    priority: Yup.number().required("Priority is required"),
    status: Yup.number().required("Status is required"),
    tags: Yup.array().of(Yup.string()),
    dueDate: Yup.date(),
});

interface Props {
    handleClose: () => void
    open: boolean
    updateTaskLists: (newTask: TaskClass) => void
    preStatus?: number
}

enum Priority {
    Highest = 4,
    High = 3,
    Medium = 2,
    Low = 1,
    Lowest = 0,
}
const priorityValues = [
    { label: 'Highest', value: Priority.Highest },
    { label: 'High', value: Priority.High },
    { label: 'Medium', value: Priority.Medium },
    { label: 'Low', value: Priority.Low },
    { label: 'Lowest', value: Priority.Lowest },
];

const TaskCreationDialog: React.FC<Props> = ({ handleClose, open, preStatus, updateTaskLists }) => {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const formik = useFormik({
        initialValues: {
            description: '',
            priority: Priority.Lowest,
            status: preStatus ? preStatus : 0,
            tags: [],
            dueDate: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const user = getAuth(firebaseApp).currentUser;

                if (user && !loading && !success) {
                    setLoading(true);

                    const body = {
                        ...values,
                        author: user.uid,
                    };

                    const response = await axios.post(TASKS_ENDPOINTS.tasks, body);
                    updateTaskLists(response.data.task)
                    setSuccess(true);
                    handleClose();
                } else {
                    console.log("User is not found.");
                }
            } catch (error) {
                console.error('Error submitting the form:', error);
            } finally {
                setLoading(false);
                setSuccess(false);
                resetForm();
            }
        },

    });

    useEffect(() => {
        return () => {
            formik.resetForm()
        };
    }, [open]);

    async function handleCreation() {
        if (Object.keys(formik.errors).length > 0) {
            throw Error("Some required values are missing. Please fill them up before continuing.")
        }
        try {
            await formik.submitForm()
        } catch (error) {
            console.log(error)
        }
    }
    const storedTags = localStorage.getItem("tags")
    const parsedTags = storedTags ? JSON.parse(storedTags) : tags
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle sx={{ m: 0, alignItems: 'center', gap: 1 }}><AutoAwesomeOutlined />Task Wizard</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                disableRipple
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseOutlined />
            </IconButton>
            <DialogContent dividers sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '.5rem',
            }}>
                {/* Description */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <DialogContentText sx={{ color: formik.errors['description'] ? 'red' : '' }}>Description ({formik.values['description'].trim().split(/\s+/).length}/{MAX_WORDS_PER_TASK})</DialogContentText>
                    <TextField
                        multiline
                        rows={4}
                        variant="outlined"
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                </Box>
                {/* Priority */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <DialogContentText>Priority</DialogContentText>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            name="priority"
                            value={formik.values.priority}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            variant="outlined"
                        >
                            {priorityValues.map((priority) => (
                                <MenuItem key={priority.value} value={priority.value}>
                                    {priority.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Status */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <DialogContentText>Status</DialogContentText>
                    <TaskStatusSteps value={formik.values.status} callBack={formik.setFieldValue} />
                </Box>

                {/* Tags */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <DialogContentText>Tags</DialogContentText>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            multiple
                            name="tags"
                            value={formik.values.tags}
                            onChange={(event) => {
                                const selectedTags = event.target.value as string[];

                                if (selectedTags.length <= MAX_TAGS_PER_TASK) {
                                    formik.handleChange(event);
                                }
                            }}
                            onBlur={formik.handleBlur}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {(selected as string[]).map((value, index) => (
                                        <Chip key={index} label={JSON.parse(value).title} sx={{ bgcolor: JSON.parse(value).color, borderRadius: '8px' }} />
                                    ))}
                                </Box>
                            )}
                        >
                            {parsedTags.map((tag: Tag, index: React.Key | null | undefined) => (
                                <MenuItem key={index} value={JSON.stringify(tag)}>
                                    {tag.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <DialogContentText>Due Date</DialogContentText>
                    <TextField
                        type="date"
                        name="dueDate"
                        value={formik.values.dueDate}
                        onChange={formik.handleChange}
                        variant="outlined"
                    />
                </Box>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={(Object.keys(formik.errors).length > 0)}
                        onClick={handleCreation}
                        sx={{
                            ...(success && {
                                bgcolor: green[500],
                                '&:hover': {
                                    bgcolor: green[700],
                                },
                            }),
                            width: '7rem',
                            bgcolor: myPalette[400],
                            color: myPalette[50],
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                transition: 'opacity 0.3s ease',
                            }}
                        >
                            {loading && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        color: green,
                                        top: '50%',
                                        left: '50%',
                                        opacity: success ? 0 : 1,
                                    }}
                                />
                            )}
                            {!loading && (
                                success ? (
                                    <CheckCircleOutline sx={{ marginRight: 1, opacity: 1 }} />
                                ) : (
                                    <Typography>Create Task</Typography>
                                )
                            )}
                        </Box>
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default TaskCreationDialog;

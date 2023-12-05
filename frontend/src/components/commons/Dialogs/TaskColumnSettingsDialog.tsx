import React from "react";
import { CloseOutlined } from "@mui/icons-material";
import { capitalizeWords } from '../../../utils/styling';
import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    DialogActions,
    Button,
    Box,
    DialogContentText,
    Switch,
} from "@mui/material";
import { useState } from "react";

interface TaskColumnSettingsDialogProps {
    open: boolean;
    handleClose: () => void;
    title: string;
}

const settingsItems = [
    { label: 'Implement SMART', key: 'smart', defaultValue: false },
    { label: 'Max Task', key: 'maxTask', defaultValue: true },
    { label: 'Max Tags', key: 'maxTags', defaultValue: false },
    { label: 'Hide Tags', key: 'hideTags', defaultValue: false },
    { label: 'Clear all tasks', key: 'clearTasks', defaultValue: false },
];


const TaskColumnSettingsDialog: React.FC<TaskColumnSettingsDialogProps> = ({
    open,
    handleClose,
    title,
}) => {
    const [implementSmart, setImplementSmart] = useState(false);

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle sx={{ m: 0 }}>[{capitalizeWords(title)}] Settings</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                disableRipple
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                    "&:hover": {},
                }}
            >
                <CloseOutlined />
            </IconButton>
            <DialogContent
                dividers
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: ".5rem",
                }}
            >
                {settingsItems.map(({ label, key}) => (
                    <Box
                        key={key}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <DialogContentText>{label}</DialogContentText>
                        <Switch
                            disabled={key !== 'smart' && implementSmart}
                            onChange={(event) => {
                                if (key === 'smart') {
                                    setImplementSmart(event.target.checked);
                                }
                            }}
                        />
                    </Box>
                ))}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Save changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskColumnSettingsDialog;

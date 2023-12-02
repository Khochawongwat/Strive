import { CloseOutlined, AlarmOutlined } from "@mui/icons-material"
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Switch, TextField, Typography } from "@mui/material"
import { useState } from "react"

interface Props {
    handleClose: () => void
    open: boolean
}
const TaskCreationDialog: React.FC<Props> = ({ handleClose, open }) => {
    const priorities = ["High", "Medium", "Low"];
    const [selectedPriority, setSelectedPriority] = useState("");

    const tags = ["Tag1", "Tag2", "Tag3"];
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const statusOptions = ["To Do", "In Progress", "On Hold", "Completed"];
    const [selectedStatus, setSelectedStatus] = useState("");

    const [selectedDueDate, setSelectedDueDate] = useState("");
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle sx={{ m: 0 }}>
                Task Wizard
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                disableRipple
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                    "hover": {}
                }}
            >
                <CloseOutlined />
            </IconButton>
            <DialogContent dividers sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '.5rem',
            }}>
                {/* Title */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <DialogContentText>Title</DialogContentText>
                    <TextField multiline rows={1} variant="outlined" />
                </Box>
                {/* Description */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <DialogContentText>Description</DialogContentText>
                    <TextField multiline rows={4} variant="outlined" />
                </Box>
                {/* Priority */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <DialogContentText>Priority</DialogContentText>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            value={selectedPriority}
                            onChange={(event) => setSelectedPriority(event.target.value as string)}
                            variant="outlined"
                        >
                            {priorities.map((priority, index) => (
                                <MenuItem key={index} value={priority}>
                                    {priority}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Status */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <DialogContentText>Status</DialogContentText>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            value={selectedStatus}
                            onChange={(event) => setSelectedStatus(event.target.value as string)}
                            variant="outlined"
                        >
                            {statusOptions.map((status, index) => (
                                <MenuItem key={index} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <DialogContentText>Tags</DialogContentText>
                    <FormControl fullWidth variant="outlined">
                        <Select
                            multiple
                            value={selectedTags}
                            onChange={(event) => setSelectedTags(event.target.value as string[])}
                            renderValue={(selected) => (
                                <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                    {(selected as string[]).map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {tags.map((tag, index) => (
                                <MenuItem key={index} value={tag}>
                                    {tag}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <DialogContentText>Due Date</DialogContentText>
                    <TextField
                        type="date"
                        value={selectedDueDate}
                        onChange={(event) => setSelectedDueDate(event.target.value)}
                        variant="outlined"
                    />
                </Box>

            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Save changes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default TaskCreationDialog
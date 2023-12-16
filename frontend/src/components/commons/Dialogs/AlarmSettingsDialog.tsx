import { CloseOutlined, AlarmOutlined } from "@mui/icons-material"
import { Dialog, DialogTitle, IconButton, DialogContent, Box, Typography, DialogContentText, Switch, DialogActions, Button, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import Timer from "../../../schema/Timer.schema"

interface Props {
    handleClose: () => void
    open: boolean
    timer: Timer
}

const AlarmSettingsDialog: React.FC<Props> = ({ handleClose, open, timer }) => {
    const [editedLoops, setEditedLoops] = useState(timer.loopsNeeded);
    const [editedShorts, setEditedShorts] = useState(timer.shortsNeeded);
    const [editedAutoStart, setEditedAutoStart] = useState<boolean>(timer.autoStart);

    const handleSaveChanges = () => {
        timer.loopsNeeded = editedLoops;
        timer.shortsNeeded = editedShorts;
        timer.autoStart = editedAutoStart;
        console.log("Saved", timer.autoStart)
    }

    useEffect(() => {
        handleSaveChanges()
    }, [editedLoops, editedShorts, editedAutoStart, timer])

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle sx={{ m: 0 }}>
                Settings
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
                <Box sx={{
                    display: 'flex',
                    gap: '.5rem',
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',

                }}>
                    <AlarmOutlined />
                    <Typography fontWeight={600}>
                        TIMER
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                    <DialogContentText>
                        Auto Start Breaks
                    </DialogContentText>

                    <Switch
                        checked={editedAutoStart}
                        onChange={(e) => setEditedAutoStart(e.target.checked)}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    <DialogContentText>How many long breaks</DialogContentText>
                    <TextField
                        type="number"
                        value={editedLoops}
                        onChange={(e) => setEditedLoops(parseInt(e.target.value, 10))}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    <DialogContentText>How many short breaks before a long break</DialogContentText>
                    <TextField
                        type="number"
                        value={editedShorts}
                        onChange={(e) => setEditedShorts(parseInt(e.target.value, 10))}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button onClick={() => {
                        timer.default()
                        setEditedLoops(timer.loopsNeeded)
                        setEditedShorts(timer.shortsNeeded)
                    }}>
                        Reset to default
                    </Button>
                    <Button onClick={() => {
                        timer.resetSession()
                    }}>
                        Restart Pomodoro
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    DONE
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default AlarmSettingsDialog